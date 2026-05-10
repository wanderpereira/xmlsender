/**
 * Exemplos de Uso - PocketBase Service
 * 
 * Este arquivo mostra exemplos práticos de como usar pocketbaseService
 */

const pocketbaseService = require('../services/pocketbaseService');

/**
 * ========================
 * INICIALIZAÇÃO
 * ========================
 */

// Conectar ao PocketBase
async function example_connect() {
  try {
    await pocketbaseService.connect();
    console.log('✅ Conectado ao PocketBase');
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
  }
}

// Autenticar como admin
async function example_authenticate() {
  try {
    await pocketbaseService.authenticateAdmin(
      process.env.POCKETBASE_ADMIN_EMAIL,
      process.env.POCKETBASE_ADMIN_PASSWORD
    );
    console.log('✅ Autenticado como admin');
  } catch (error) {
    console.error('❌ Erro na autenticação:', error.message);
  }
}

/**
 * ========================
 * ESTABELECIMENTOS
 * ========================
 */

// Criar novo estabelecimento
async function example_createEstabelecimento() {
  try {
    const record = await pocketbaseService.saveEstabelecimento({
      razao_social: 'Minha Empresa LTDA',
      cnpj: '12.345.678/0001-90',
      email: 'contato@empresa.com',
      telefone: '(11) 98765-4321',
      contador_email: 'contador@empresa.com',
      contato_responsavel: 'João Silva',
      observacoes: 'Empresa de teste'
    });

    console.log('✅ Estabelecimento criado:', record.id);
    return record.id;
  } catch (error) {
    console.error('❌ Erro ao criar:', error.message);
  }
}

// Obter estabelecimento por ID
async function example_getEstabelecimento(id) {
  try {
    const record = await pocketbaseService.getEstabelecimento(id);
    console.log('✅ Estabelecimento encontrado:');
    console.log(record);
    return record;
  } catch (error) {
    console.error('❌ Erro ao obter:', error.message);
  }
}

// Listar todos os estabelecimentos
async function example_listEstabelecimentos() {
  try {
    const records = await pocketbaseService.listEstabelecimentos();
    console.log(`✅ ${records.length} estabelecimento(s) encontrado(s)`);
    
    records.forEach(est => {
      console.log(`  - ${est.razao_social} (${est.cnpj})`);
    });
    
    return records;
  } catch (error) {
    console.error('❌ Erro ao listar:', error.message);
  }
}

/**
 * ========================
 * CONFIGURAÇÃO SMTP
 * ========================
 */

// Salvar configuração SMTP
async function example_saveSmtpConfig(estabelecimentoId) {
  try {
    const config = await pocketbaseService.saveSmtpConfig({
      estabelecimento: estabelecimentoId,
      servico: 'gmail',
      email_usuario: 'seu-email@gmail.com',
      senha_app: 'xxxx xxxx xxxx xxxx',
      host_smtp: 'smtp.gmail.com',
      porta_smtp: 587,
      usar_tls: true,
      ativo: true
    });

    console.log('✅ Configuração SMTP salva:', config.id);
    return config.id;
  } catch (error) {
    console.error('❌ Erro ao salvar SMTP:', error.message);
  }
}

// Obter configuração SMTP
async function example_getSmtpConfig() {
  try {
    const config = await pocketbaseService.getSmtpConfig();
    
    if (config) {
      console.log('✅ Configuração SMTP encontrada:');
      console.log(`  Email: ${config.email_usuario}`);
      console.log(`  Serviço: ${config.servico}`);
      console.log(`  Ativo: ${config.ativo}`);
    } else {
      console.log('⚠️  Nenhuma configuração SMTP encontrada');
    }
    
    return config;
  } catch (error) {
    console.error('❌ Erro ao obter SMTP:', error.message);
  }
}

/**
 * ========================
 * LOGS DE EMAIL
 * ========================
 */

// Registrar email enviado
async function example_logEmailSent(estabelecimentoId) {
  try {
    const log = await pocketbaseService.logEmailSent({
      estabelecimento: estabelecimentoId,
      destinatario: 'contador@empresa.com',
      assunto: '[Minha Empresa] Arquivos Fiscais - Janeiro/2024',
      arquivo: '2024-01.zip',
      status: 'enviado'
    });

    console.log('✅ Email registrado no log:', log.id);
    return log.id;
  } catch (error) {
    console.error('❌ Erro ao registrar:', error.message);
  }
}

// Registrar erro de email
async function example_logEmailError(estabelecimentoId) {
  try {
    const log = await pocketbaseService.logEmailSent({
      estabelecimento: estabelecimentoId,
      destinatario: 'contador@empresa.com',
      assunto: '[Minha Empresa] Arquivos Fiscais - Janeiro/2024',
      status: 'erro',
      erro: 'SMTP authentication failed: Invalid credentials'
    });

    console.log('✅ Erro registrado:', log.id);
    return log.id;
  } catch (error) {
    console.error('❌ Erro ao registrar falha:', error.message);
  }
}

// Obter histórico de emails
async function example_getEmailHistory(estabelecimentoId) {
  try {
    const history = await pocketbaseService.getEmailHistory({
      estabelecimento: estabelecimentoId,
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    });

    console.log(`✅ ${history.length} email(s) encontrado(s)`);
    
    history.forEach(email => {
      console.log(`  - ${email.assunto} (${email.status})`);
    });
    
    return history;
  } catch (error) {
    console.error('❌ Erro ao obter histórico:', error.message);
  }
}

/**
 * ========================
 * ARQUIVOS XML
 * ========================
 */

// Salvar rastreamento de arquivo XML
async function example_saveXmlFile(estabelecimentoId) {
  try {
    const record = await pocketbaseService.saveXmlFile({
      estabelecimento: estabelecimentoId,
      nomeArquivo: 'NF123456789.xml',
      tipo: 'nfe',
      processado: false
    });

    console.log('✅ Arquivo XML registrado:', record.id);
    return record.id;
  } catch (error) {
    console.error('❌ Erro ao registrar XML:', error.message);
  }
}

/**
 * ========================
 * ESTATÍSTICAS
 * ========================
 */

// Obter estatísticas gerais
async function example_getStatistics() {
  try {
    const stats = await pocketbaseService.getStatistics();
    
    console.log('📊 Estatísticas do Sistema:');
    console.log(`  Total de Estabelecimentos: ${stats.totalEstabelecimentos}`);
    console.log(`  Total de Emails: ${stats.totalEmails}`);
    console.log(`    - Enviados com sucesso: ${stats.emailsEnviados}`);
    console.log(`    - Com erro: ${stats.emailsErro}`);
    console.log(`  Total de Arquivos XML: ${stats.totalXmls}`);
    
    return stats;
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error.message);
  }
}

/**
 * ========================
 * FLUXO COMPLETO DE EXEMPLO
 * ========================
 */

async function example_fullFlow() {
  console.log('\n🚀 Iniciando fluxo completo de exemplo...\n');

  try {
    // 1. Conectar e autenticar
    console.log('1️⃣  Conectando ao PocketBase...');
    await pocketbaseService.connect();
    await pocketbaseService.authenticateAdmin(
      process.env.POCKETBASE_ADMIN_EMAIL,
      process.env.POCKETBASE_ADMIN_PASSWORD
    );

    // 2. Criar estabelecimento
    console.log('\n2️⃣  Criando estabelecimento...');
    const estId = await example_createEstabelecimento();

    // 3. Salvar configuração SMTP
    console.log('\n3️⃣  Configurando SMTP...');
    await example_saveSmtpConfig(estId);

    // 4. Registrar arquivo XML
    console.log('\n4️⃣  Registrando arquivo XML...');
    await example_saveXmlFile(estId);

    // 5. Registrar email enviado
    console.log('\n5️⃣  Registrando email enviado...');
    await example_logEmailSent(estId);

    // 6. Obter histórico
    console.log('\n6️⃣  Obtendo histórico...');
    await example_getEmailHistory(estId);

    // 7. Obter estatísticas
    console.log('\n7️⃣  Obtendo estatísticas...');
    await example_getStatistics();

    console.log('\n✅ Fluxo completo executado com sucesso!');

  } catch (error) {
    console.error('❌ Erro no fluxo:', error.message);
  } finally {
    pocketbaseService.disconnect();
  }
}

// ========================
// EXPORTAR EXEMPLOS
// ========================

module.exports = {
  example_connect,
  example_authenticate,
  example_createEstabelecimento,
  example_getEstabelecimento,
  example_listEstabelecimentos,
  example_saveSmtpConfig,
  example_getSmtpConfig,
  example_logEmailSent,
  example_logEmailError,
  example_getEmailHistory,
  example_saveXmlFile,
  example_getStatistics,
  example_fullFlow
};

/**
 * Para testar, execute:
 * 
 * node -e "
 *   require('dotenv').config();
 *   const examples = require('./examples');
 *   examples.example_fullFlow();
 * "
 * 
 */
