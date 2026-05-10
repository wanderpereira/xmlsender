const nodemailer = require('nodemailer');
const path = require('path');
const pocketbaseService = require('../services/pocketbaseService');
const logger = require('../utils/logger');

module.exports.email = async function(options = {}) {
  try {
    const { estabelecimentoId, pastaArquivos } = options;
    
    if (!estabelecimentoId) {
      throw new Error('ID do estabelecimento é obrigatório');
    }

    logger.info('📧 Iniciando processo de envio de email');

    // Obter dados do estabelecimento do PocketBase
    const estabelecimento = await pocketbaseService.getEstabelecimento(estabelecimentoId);
    if (!estabelecimento) {
      throw new Error(`Estabelecimento ${estabelecimentoId} não encontrado`);
    }

    // Obter configurações SMTP do PocketBase
    const smtpConfig = await pocketbaseService.getSmtpConfig();
    if (!smtpConfig || !smtpConfig.ativo) {
      throw new Error('Configuração SMTP não encontrada ou desativada');
    }

    // Validar credenciais SMTP
    if (!smtpConfig.email_usuario || !smtpConfig.senha_app) {
      throw new Error('Credenciais SMTP incompletas');
    }

    // Executar análise de arquivos
    const ini = require('./analyzer.js');
    await ini.analise();

    // Configurar transporte SMTP
    let transporter = nodemailer.createTransport({
      service: smtpConfig.servico === 'smtp_customizado' ? undefined : smtpConfig.servico,
      host: smtpConfig.host_smtp,
      port: smtpConfig.porta_smtp,
      secure: smtpConfig.usar_tls,
      auth: {
        user: smtpConfig.email_usuario,
        pass: smtpConfig.senha_app
      }
    });

    // Template HTML do email
    const htmlTemplate = `
      <center><h1>>>> XML <em>Sender</em></h1></center><br>
      <h3>Dados do Contribuinte</h3>
      <p>Olá, segue em anexo os arquivos fiscais. Qualquer dúvida, entre em contato com o responsável.</p>
      <fieldset style="border: 1px solid #ccc; padding: 15px; border-radius: 5px;">
        <h3>Nome do Estabelecimento: ${estabelecimento.razao_social}</h3>
        <h3>CNPJ: ${estabelecimento.cnpj}</h3>
        <h3>E-mail: ${estabelecimento.email}</h3>
        <h3>Contato: ${estabelecimento.telefone || 'N/A'}</h3>
        <h3>Contabilidade: ${estabelecimento.contador_email}</h3>
      </fieldset>
      <hr>
      <p><strong>XML Sender</strong> é um programa que realiza envios automáticos de pacotes XMLs.<br>
      Por favor não responda este e-mail, esta é uma mensagem automática.</p>
    `;

    const attachmentPath = path.join(process.cwd(), `${pastaArquivos}.zip`);

    // Enviar email
    const result = await transporter.sendMail({
      from: smtpConfig.email_usuario,
      to: estabelecimento.contador_email,
      subject: `[${estabelecimento.razao_social}] Arquivos Fiscais - ${pastaArquivos}`,
      html: htmlTemplate,
      attachments: [{
        path: attachmentPath
      }]
    });

    // Registrar sucesso no log
    await pocketbaseService.logEmailSent({
      estabelecimento: estabelecimentoId,
      destinatario: estabelecimento.contador_email,
      assunto: `[${estabelecimento.razao_social}] Arquivos Fiscais - ${pastaArquivos}`,
      arquivo: pastaArquivos,
      status: 'enviado'
    });

    logger.info('✅ Email encaminhado com sucesso', { 
      to: estabelecimento.contador_email,
      messageId: result.messageId
    });

    return {
      success: true,
      message: 'E-mail encaminhado com sucesso',
      messageId: result.messageId
    };

  } catch (error) {
    logger.error('❌ Erro ao enviar email', { error: error.message });
    
    // Registrar erro no log
    if (options.estabelecimentoId) {
      await pocketbaseService.logEmailSent({
        estabelecimento: options.estabelecimentoId,
        status: 'erro',
        erro: error.message
      }).catch(err => logger.error('Erro ao registrar falha no log', err));
    }

    return {
      success: false,
      error: error.message
    };
  }
};