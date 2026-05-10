/**
 * Schemas para PocketBase
 * 
 * Instruções:
 * 1. Criar cada coleção no painel admin do PocketBase
 * 2. Adicionar os campos conforme especificado abaixo
 * 3. Configurar permissões conforme necessário
 */

module.exports = {
  /**
   * Collection: estabelecimentos
   * Armazena informações dos estabelecimentos
   */
  estabelecimentos: {
    name: 'estabelecimentos',
    type: 'base',
    fields: [
      { name: 'razao_social', type: 'text', required: true },
      { name: 'cnpj', type: 'text', unique: true, required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'telefone', type: 'text' },
      { name: 'contador_email', type: 'email', required: true },
      { name: 'contato_responsavel', type: 'text' },
      { name: 'ativo', type: 'bool', default: true },
      { name: 'observacoes', type: 'editor' }
    ]
  },

  /**
   * Collection: smtp_config
   * Configurações SMTP para cada estabelecimento
   */
  smtp_config: {
    name: 'smtp_config',
    type: 'base',
    fields: [
      { name: 'estabelecimento', type: 'relation', collection: 'estabelecimentos', required: true },
      { name: 'servico', type: 'select', options: 'gmail,outlook,yahoo,smtp_customizado', required: true },
      { name: 'email_usuario', type: 'email', required: true },
      { name: 'senha_app', type: 'text', required: true },
      { name: 'host_smtp', type: 'text' },
      { name: 'porta_smtp', type: 'number' },
      { name: 'usar_tls', type: 'bool', default: true },
      { name: 'testado', type: 'bool', default: false },
      { name: 'ativo', type: 'bool', default: true }
    ]
  },

  /**
   * Collection: email_logs
   * Histórico de emails enviados
   */
  email_logs: {
    name: 'email_logs',
    type: 'base',
    fields: [
      { name: 'estabelecimento', type: 'relation', collection: 'estabelecimentos', required: true },
      { name: 'destinatario', type: 'email', required: true },
      { name: 'assunto', type: 'text', required: true },
      { name: 'arquivo', type: 'text' },
      { name: 'status', type: 'select', options: 'enviado,erro,pendente', required: true },
      { name: 'data_envio', type: 'date', required: true },
      { name: 'erro_mensagem', type: 'text' }
    ]
  },

  /**
   * Collection: xml_files
   * Rastreamento de arquivos XML
   */
  xml_files: {
    name: 'xml_files',
    type: 'base',
    fields: [
      { name: 'estabelecimento', type: 'relation', collection: 'estabelecimentos', required: true },
      { name: 'nome_arquivo', type: 'text', required: true },
      { name: 'tipo', type: 'select', options: 'nfe,cte,mdfe,nfse,cfop', required: true },
      { name: 'data_criacao', type: 'date', required: true },
      { name: 'processado', type: 'bool', default: false },
      { name: 'data_processamento', type: 'date' }
    ]
  },

  /**
   * Collection: configuracoes_app
   * Configurações gerais da aplicação
   */
  configuracoes_app: {
    name: 'configuracoes_app',
    type: 'base',
    fields: [
      { name: 'chave', type: 'text', unique: true, required: true },
      { name: 'valor', type: 'text' },
      { name: 'tipo', type: 'select', options: 'string,number,boolean,json', required: true },
      { name: 'descricao', type: 'text' }
    ]
  }
};
