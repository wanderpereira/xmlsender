const pocketbaseService = require('../services/pocketbaseService');
const logger = require('../utils/logger');

module.exports.core = async function(options = {}) {
  try {
    const { estabelecimentoId, pastaArquivos, enableEmail = true, enableSubpastas = false } = options;

    if (!estabelecimentoId) {
      throw new Error('ID do estabelecimento é obrigatório');
    }

    // Validar configuração do PocketBase
    await pocketbaseService.connect();

    logger.info('🚀 Iniciando processamento de arquivos', { estabelecimentoId });

    const criaPasta = require('./mkdir');
    const copiaArquivos = require('./filtered');
    const criaSubpasta = require('./original');
    const enviaEmail = require('./mailer');

    // Obter configurações do estabelecimento do PocketBase
    const estabelecimento = await pocketbaseService.getEstabelecimento(estabelecimentoId);
    
    if (!estabelecimento) {
      throw new Error(`Estabelecimento ${estabelecimentoId} não encontrado no banco de dados`);
    }

    if (!estabelecimento.ativo) {
      throw new Error(`Estabelecimento ${estabelecimento.razao_social} está desativado`);
    }

    if (enableEmail) {
      logger.info('📧 Modo EMAIL ativado');
      
      // Criar estrutura de pastas
      await criaPasta.estrutura();
      
      // Copiar arquivos
      await copiaArquivos.filtro();
      
      // Enviar email
      const emailResult = await enviaEmail.email({
        estabelecimentoId,
        pastaArquivos: pastaArquivos || 'xmlfiles'
      });

      if (!emailResult.success) {
        throw new Error(`Erro ao enviar email: ${emailResult.error}`);
      }

      return {
        success: true,
        message: 'Arquivos processados e email enviado com sucesso',
        data: {
          estabelecimento: estabelecimento.razao_social,
          messageId: emailResult.messageId
        }
      };

    } else if (enableSubpastas) {
      logger.info('📁 Modo SUBPASTAS ativado');
      
      // Apenas gerar subpastas
      await criaSubpasta.gerar();

      return {
        success: true,
        message: 'Subpastas geradas com sucesso na raiz',
        data: {
          estabelecimento: estabelecimento.razao_social
        }
      };

    } else {
      throw new Error('Nenhuma operação foi ativada (email ou subpastas)');
    }

  } catch (error) {
    logger.error('❌ Erro no processamento', { error: error.message });
    
    return {
      success: false,
      error: error.message,
      type: 'CORE_ERROR'
    };
  }
};