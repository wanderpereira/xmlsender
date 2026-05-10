const PocketBase = require('pocketbase/cjs');
const logger = require('../utils/logger');

class PocketBaseService {
  constructor(url = 'http://127.0.0.1:8090') {
    this.pb = new PocketBase(url);
    this.isConnected = false;
    this.currentAuth = null;
  }

  /**
   * Conectar ao PocketBase
   */
  async connect() {
    try {
      // Testar conexão
      await this.pb.health.check();
      this.isConnected = true;
      logger.info('✅ Conectado ao PocketBase com sucesso');
      return true;
    } catch (error) {
      logger.error('❌ Erro ao conectar ao PocketBase', { error: error.message });
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Autenticar como admin
   */
  async authenticateAdmin(email, password) {
    try {
      const admin = await this.pb.admins.authWithPassword(email, password);
      this.currentAuth = admin;
      logger.info('✅ Autenticação admin realizada');
      return admin;
    } catch (error) {
      logger.error('❌ Erro na autenticação admin', { error: error.message });
      throw error;
    }
  }

  /**
   * Salvar/Atualizar estabelecimento
   */
  async saveEstabelecimento(data) {
    try {
      const record = await this.pb.collection('estabelecimentos').create(data);
      logger.info('✅ Estabelecimento salvo', { id: record.id });
      return record;
    } catch (error) {
      logger.error('❌ Erro ao salvar estabelecimento', data);
      throw error;
    }
  }

  /**
   * Obter estabelecimento por ID
   */
  async getEstabelecimento(id) {
    try {
      const record = await this.pb.collection('estabelecimentos').getOne(id);
      return record;
    } catch (error) {
      logger.error('❌ Erro ao buscar estabelecimento', { id });
      throw error;
    }
  }

  /**
   * Listar todos os estabelecimentos
   */
  async listEstabelecimentos() {
    try {
      const records = await this.pb.collection('estabelecimentos').getFullList();
      return records;
    } catch (error) {
      logger.error('❌ Erro ao listar estabelecimentos');
      throw error;
    }
  }

  /**
   * Salvar configurações SMTP
   */
  async saveSmtpConfig(data) {
    try {
      const record = await this.pb.collection('smtp_config').create(data);
      logger.info('✅ Configuração SMTP salva');
      return record;
    } catch (error) {
      logger.error('❌ Erro ao salvar SMTP config', data);
      throw error;
    }
  }

  /**
   * Obter configurações SMTP
   */
  async getSmtpConfig() {
    try {
      const records = await this.pb.collection('smtp_config').getFullList({ limit: 1 });
      return records.length > 0 ? records[0] : null;
    } catch (error) {
      logger.error('❌ Erro ao buscar SMTP config');
      throw error;
    }
  }

  /**
   * Registrar envio de email
   */
  async logEmailSent(data) {
    try {
      const record = await this.pb.collection('email_logs').create({
        estabelecimento: data.estabelecimento,
        destinatario: data.destinatario,
        assunto: data.assunto,
        arquivo: data.arquivo,
        status: data.status || 'enviado',
        data_envio: new Date().toISOString(),
        erro: data.erro || null
      });
      logger.info('✅ Email registrado no log', { id: record.id });
      return record;
    } catch (error) {
      logger.error('❌ Erro ao registrar email no log', data);
      throw error;
    }
  }

  /**
   * Obter histórico de emails
   */
  async getEmailHistory(filters = {}) {
    try {
      let query = {};
      
      if (filters.estabelecimento) {
        query['estabelecimento.id'] = filters.estabelecimento;
      }
      
      if (filters.startDate && filters.endDate) {
        query['data_envio'] = `>=${filters.startDate} && <=${filters.endDate}`;
      }

      const records = await this.pb.collection('email_logs').getFullList({
        filter: Object.entries(query).map(([k, v]) => `${k}="${v}"`).join(' && '),
        sort: '-data_envio'
      });
      
      return records;
    } catch (error) {
      logger.error('❌ Erro ao buscar histórico de emails');
      throw error;
    }
  }

  /**
   * Salvar arquivo XML para rastreamento
   */
  async saveXmlFile(data) {
    try {
      const record = await this.pb.collection('xml_files').create({
        estabelecimento: data.estabelecimento,
        nome_arquivo: data.nomeArquivo,
        tipo: data.tipo || 'nfe', // nfe, cte, etc
        data_criacao: new Date().toISOString(),
        processado: data.processado || false
      });
      return record;
    } catch (error) {
      logger.error('❌ Erro ao salvar arquivo XML', data);
      throw error;
    }
  }

  /**
   * Obter estatísticas
   */
  async getStatistics() {
    try {
      const totalEstabelecimentos = await this.pb.collection('estabelecimentos').getFullList();
      const totalEmails = await this.pb.collection('email_logs').getFullList();
      const totalXmls = await this.pb.collection('xml_files').getFullList();

      const emailsEnviados = totalEmails.filter(e => e.status === 'enviado').length;
      const emailsErro = totalEmails.filter(e => e.status === 'erro').length;

      return {
        totalEstabelecimentos: totalEstabelecimentos.length,
        totalEmails: totalEmails.length,
        emailsEnviados,
        emailsErro,
        totalXmls: totalXmls.length
      };
    } catch (error) {
      logger.error('❌ Erro ao buscar estatísticas');
      throw error;
    }
  }

  /**
   * Desconectar
   */
  disconnect() {
    this.isConnected = false;
    this.currentAuth = null;
    logger.info('Desconectado do PocketBase');
  }
}

module.exports = new PocketBaseService();
