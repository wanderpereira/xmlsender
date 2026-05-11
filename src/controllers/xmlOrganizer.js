/**
 * XML Organizer - Organiza arquivos XML por data de emissão
 * 
 * Lê a tag <dhEmi> do XML e organiza em estrutura de pastas
 * Exemplos de organização:
 * - 2024/01 - Janeiro/
 * - 2024/02 - Fevereiro/
 * - etc.
 */

const fs = require('fs');
const path = require('path');
const xmlDateParser = require('../utils/xmlDateParser');
const logger = require('../utils/logger');
const pocketbaseService = require('../services/pocketbaseService');

class XMLOrganizer {
  constructor() {
    this.baseDir = process.cwd();
    this.organizedCount = 0;
    this.errorCount = 0;
    this.results = [];
  }

  /**
   * Organiza arquivos XML em uma pasta por data de emissão
   * @param {string} sourceDir - Pasta com arquivos XML
   * @param {string} destinationDir - Pasta destino para organizar
   * @param {Object} options - { period: 'month'|'week'|'day', copy: true|false }
   * @returns {Promise<Object>} Resultado da organização
   */
  async organize(sourceDir, destinationDir, options = {}) {
    const {
      period = 'month',
      copy = true,
      estabelecimentoId = null
    } = options;

    logger.info('🚀 Iniciando organização de XMLs', { 
      sourceDir, 
      destinationDir,
      period 
    });

    try {
      // Validar diretórios
      if (!fs.existsSync(sourceDir)) {
        throw new Error(`Diretório de origem não encontrado: ${sourceDir}`);
      }

      // Criar diretório destino se não existir
      if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
        logger.info(`📁 Diretório criado: ${destinationDir}`);
      }

      // Obter lista de arquivos XML
      const files = this.getXmlFiles(sourceDir);
      
      if (files.length === 0) {
        logger.warn('⚠️  Nenhum arquivo XML encontrado');
        return {
          success: true,
          organized: 0,
          errors: 0,
          message: 'Nenhum arquivo XML encontrado'
        };
      }

      logger.info(`📦 ${files.length} arquivo(s) XML encontrado(s)`);

      // Processar cada arquivo
      for (const file of files) {
        await this.processFile(
          file,
          sourceDir,
          destinationDir,
          period,
          copy,
          estabelecimentoId
        );
      }

      const result = this.getSummary();
      logger.info('✅ Organização concluída', result);

      return {
        success: true,
        ...result,
        details: this.results
      };

    } catch (error) {
      logger.error('❌ Erro na organização de XMLs', { error: error.message });
      return {
        success: false,
        error: error.message,
        organized: this.organizedCount,
        errors: this.errorCount
      };
    }
  }

  /**
   * Processa um arquivo individual
   * @private
   */
  async processFile(filePath, sourceDir, destDir, period, copy, estId) {
    try {
      const fileName = path.basename(filePath);

      // Validar XML
      if (!xmlDateParser.isValidXml(filePath)) {
        throw new Error('Arquivo não é um XML válido');
      }

      // Extrair data
      const dateInfo = await xmlDateParser.parseXmlDate(filePath);
      const folderPath = xmlDateParser.generateFolderPath(dateInfo.date, period);
      const destPath = path.join(destDir, folderPath);

      // Criar estrutura de pastas
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }

      const destFile = path.join(destPath, fileName);

      // Copiar ou mover arquivo
      if (copy) {
        fs.copyFileSync(filePath, destFile);
        logger.debug(`📋 Arquivo copiado: ${fileName} → ${folderPath}`);
      } else {
        fs.renameSync(filePath, destFile);
        logger.debug(`📦 Arquivo movido: ${fileName} → ${folderPath}`);
      }

      // Extrair metadados
      const metadata = await xmlDateParser.extractMetadata(filePath);

      // Registrar no PocketBase (se configurado)
      if (estId && pocketbaseService.isConnected) {
        await this.registerInPocketBase(estId, {
          ...metadata,
          folderPath,
          source: dateInfo.source,
          dateFrom: dateInfo.dateString
        });
      }

      // Registrar resultado
      this.results.push({
        file: fileName,
        source: dateInfo.source,
        date: dateInfo.dateString,
        folder: folderPath,
        status: 'success',
        metadata
      });

      this.organizedCount++;

    } catch (error) {
      logger.error(`❌ Erro ao processar ${path.basename(filePath)}`, { error: error.message });
      
      this.results.push({
        file: path.basename(filePath),
        status: 'error',
        error: error.message
      });

      this.errorCount++;
    }
  }

  /**
   * Registra arquivo no PocketBase
   * @private
   */
  async registerInPocketBase(estabelecimentoId, data) {
    try {
      await pocketbaseService.saveXmlFile({
        estabelecimento: estabelecimentoId,
        nomeArquivo: data.file,
        tipo: data.type || 'desconhecido',
        processado: true,
        folderPath: data.folderPath,
        dataEmissao: data.dateFrom,
        cnpj: data.cnpj,
        numeroNF: data.nf
      });
    } catch (error) {
      logger.error('Erro ao registrar no PocketBase', error);
      // Não lancar erro - apenas logar
    }
  }

  /**
   * Obtém lista de arquivos XML em um diretório
   * @private
   */
  getXmlFiles(dir) {
    const files = [];

    const walk = (currentPath) => {
      const items = fs.readdirSync(currentPath);

      items.forEach(item => {
        const fullPath = path.join(currentPath, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          walk(fullPath);
        } else if (item.toLowerCase().endsWith('.xml')) {
          files.push(fullPath);
        }
      });
    };

    walk(dir);
    return files;
  }

  /**
   * Gera resumo da organização
   * @private
   */
  getSummary() {
    const byType = {};
    const byMonth = {};

    this.results.forEach(result => {
      if (result.metadata?.type) {
        byType[result.metadata.type] = (byType[result.metadata.type] || 0) + 1;
      }

      if (result.folder) {
        byMonth[result.folder] = (byMonth[result.folder] || 0) + 1;
      }
    });

    return {
      organized: this.organizedCount,
      errors: this.errorCount,
      total: this.organizedCount + this.errorCount,
      byType,
      byMonth
    };
  }

  /**
   * Gera relatório detalhado
   */
  generateReport() {
    return {
      timestamp: new Date().toISOString(),
      summary: this.getSummary(),
      details: this.results,
      successRate: this.organizedCount / (this.organizedCount + this.errorCount) * 100
    };
  }

  /**
   * Reseta contadores
   */
  reset() {
    this.organizedCount = 0;
    this.errorCount = 0;
    this.results = [];
  }
}

module.exports = new XMLOrganizer();
