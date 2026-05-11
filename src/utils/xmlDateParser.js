/**
 * XML Date Parser - Extrai datas de arquivos XML
 * 
 * Suporta leitura de tags:
 * - NFe (dhEmi - data e hora de emissão)
 * - CTe (dhEmi)
 * - MDFe (dhEmi)
 * - Fallback para sistema de arquivos
 */

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const logger = require('./logger');

class XMLDateParser {
  constructor() {
    this.parser = new xml2js.Parser({ 
      explicitArray: false,
      mergeAttrs: true,
      ignoreAttrs: false
    });
  }

  /**
   * Parse XML e extrai data de emissão
   * @param {string} filePath - Caminho do arquivo XML
   * @returns {Object} { date: Date, dateString: string, source: 'xml'|'filesystem' }
   */
  async parseXmlDate(filePath) {
    try {
      // Validar arquivo
      if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo não encontrado: ${filePath}`);
      }

      const stats = fs.statSync(filePath);
      if (stats.size === 0) {
        throw new Error('Arquivo vazio');
      }

      const xmlContent = fs.readFileSync(filePath, 'utf8');

      // Tentar fazer parse do XML
      const result = await this.parser.parseStringPromise(xmlContent);

      // Tentar extrair data da tag
      const dateString = this.extractDateFromParsed(result);

      if (dateString) {
        const date = new Date(dateString);
        
        // Validar se é uma data válida
        if (!isNaN(date.getTime())) {
          logger.info(`✅ Data extraída do XML: ${dateString}`, { file: path.basename(filePath) });
          return {
            date,
            dateString,
            source: 'xml',
            rawTag: dateString
          };
        }
      }

      // Fallback para data do sistema
      logger.warn(`⚠️  Não foi possível extrair data do XML, usando data do sistema`, { file: path.basename(filePath) });
      return {
        date: stats.mtime,
        dateString: stats.mtime.toISOString(),
        source: 'filesystem',
        rawTag: null
      };

    } catch (error) {
      logger.error(`❌ Erro ao fazer parse do XML`, { 
        file: path.basename(filePath),
        error: error.message 
      });

      // Fallback final - usar data do arquivo
      const stats = fs.statSync(filePath);
      return {
        date: stats.mtime,
        dateString: stats.mtime.toISOString(),
        source: 'filesystem_fallback',
        error: error.message
      };
    }
  }

  /**
   * Extrai data de um objeto XML parseado
   * @private
   */
  extractDateFromParsed(result) {
    // Estrutura NFe
    if (result.nfeProc?.NFe?.infNFe?.ide?.dhEmi) {
      return result.nfeProc.NFe.infNFe.ide.dhEmi;
    }
    
    // Estrutura NFe alternativa (sem nfeProc)
    if (result.NFe?.infNFe?.ide?.dhEmi) {
      return result.NFe.infNFe.ide.dhEmi;
    }

    // Estrutura CTe
    if (result.cteProc?.CTe?.infCte?.ide?.dhEmi) {
      return result.cteProc.CTe.infCte.ide.dhEmi;
    }

    // Estrutura CTe alternativa
    if (result.CTe?.infCte?.ide?.dhEmi) {
      return result.CTe.infCte.ide.dhEmi;
    }

    // Estrutura MDFe
    if (result.mdfProc?.MDFe?.infMDFe?.ide?.dhEmi) {
      return result.mdfProc.MDFe.infMDFe.ide.dhEmi;
    }

    // Fallback genérico - procurar qualquer dhEmi
    const findDhEmi = (obj) => {
      if (typeof obj !== 'object' || obj === null) return null;
      
      if (obj.dhEmi) {
        return obj.dhEmi;
      }

      for (const key in obj) {
        const result = findDhEmi(obj[key]);
        if (result) return result;
      }

      return null;
    };

    return findDhEmi(result);
  }

  /**
   * Extrai metadados do XML
   * @returns {Object} { cnpj, nf, type, date }
   */
  async extractMetadata(filePath) {
    try {
      const xmlContent = fs.readFileSync(filePath, 'utf8');
      const result = await this.parser.parseStringPromise(xmlContent);

      let metadata = {
        file: path.basename(filePath),
        cnpj: null,
        nf: null,
        type: null,
        date: null,
        serie: null,
        modelo: null
      };

      // NFe
      if (result.nfeProc?.NFe?.infNFe) {
        const infNFe = result.nfeProc.NFe.infNFe;
        metadata.type = 'nfe';
        metadata.cnpj = infNFe.emit?.CNPJ || null;
        metadata.nf = infNFe.ide?.nNF || null;
        metadata.serie = infNFe.ide?.serie || null;
        metadata.modelo = infNFe.ide?.mod || '55';
        metadata.date = infNFe.ide?.dhEmi || null;
      }

      // CTe
      else if (result.cteProc?.CTe?.infCte) {
        const infCte = result.cteProc.CTe.infCte;
        metadata.type = 'cte';
        metadata.cnpj = infCte.emit?.CNPJ || null;
        metadata.nf = infCte.ide?.cCT || null;
        metadata.date = infCte.ide?.dhEmi || null;
      }

      // MDFe
      else if (result.mdfProc?.MDFe?.infMDFe) {
        const infMDFe = result.mdfProc.MDFe.infMDFe;
        metadata.type = 'mdfe';
        metadata.cnpj = infMDFe.emit?.CNPJ || null;
        metadata.nf = infMDFe.ide?.cMDF || null;
        metadata.date = infMDFe.ide?.dhEmi || null;
      }

      return metadata;

    } catch (error) {
      logger.error(`Erro ao extrair metadata do XML`, { file: path.basename(filePath) });
      return null;
    }
  }

  /**
   * Gera caminho de pasta baseado em data e período
   * @param {Date} date - Data a organizar
   * @param {string} period - 'year', 'month', 'week', 'day'
   * @returns {string} Caminho relativo
   */
  generateFolderPath(date, period = 'month') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const week = Math.ceil((date.getDate() + new Date(year, 0, 1).getDay()) / 7);

    switch (period) {
      case 'year':
        return year.toString();

      case 'month':
        return path.join(year.toString(), `${month} - ${this.getMonthName(date.getMonth())}`);

      case 'week':
        return path.join(
          year.toString(),
          `Semana ${String(week).padStart(2, '0')}`
        );

      case 'day':
        return path.join(
          year.toString(),
          `${month} - ${this.getMonthName(date.getMonth())}`,
          `${day} - ${this.getDayName(date.getDay())}`
        );

      default:
        return path.join(year.toString(), month);
    }
  }

  /**
   * Retorna nome do mês
   * @private
   */
  getMonthName(monthIndex) {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[monthIndex];
  }

  /**
   * Retorna nome do dia
   * @private
   */
  getDayName(dayIndex) {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayIndex];
  }

  /**
   * Valida se arquivo é XML válido
   */
  isValidXml(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.trim().startsWith('<?xml') || content.trim().startsWith('<');
    } catch {
      return false;
    }
  }

  /**
   * Processa múltiplos arquivos e retorna com datas
   */
  async processMultipleFiles(filePaths) {
    const results = [];

    for (const filePath of filePaths) {
      const dateInfo = await this.parseXmlDate(filePath);
      results.push({
        file: filePath,
        ...dateInfo,
        folderPath: this.generateFolderPath(dateInfo.date, 'month')
      });
    }

    return results;
  }
}

module.exports = new XMLDateParser();
