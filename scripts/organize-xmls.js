#!/usr/bin/env node

/**
 * Script de Exemplo - Organizar XMLs por Data de Emissão
 * 
 * Uso:
 *   node scripts/organize-xmls.js
 *   node scripts/organize-xmls.js --source ./xmls --dest ./organized --period month
 */

const fs = require('fs');
const path = require('path');
const xmlOrganizer = require('../src/controllers/xmlOrganizer');
const xmlDateParser = require('../src/utils/xmlDateParser');
const pocketbaseService = require('../src/services/pocketbaseService');
const logger = require('../src/utils/logger');
require('dotenv').config();

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m'
};

function printHeader(text) {
  console.log(`\n${colors.blue}${'═'.repeat(50)}${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}${text}${colors.reset}`);
  console.log(`${colors.blue}${'═'.repeat(50)}${colors.reset}\n`);
}

function printSuccess(text) {
  console.log(`${colors.green}✅ ${text}${colors.reset}`);
}

function printError(text) {
  console.log(`${colors.red}❌ ${text}${colors.reset}`);
}

function printInfo(text) {
  console.log(`${colors.blue}ℹ️  ${text}${colors.reset}`);
}

function printWarning(text) {
  console.log(`${colors.yellow}⚠️  ${text}${colors.reset}`);
}

// Parse de argumentos
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    source: './xmls',
    dest: './xmls_organized',
    period: 'month',
    copy: true,
    usePocketBase: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--source':
      case '-s':
        options.source = args[++i];
        break;
      case '--dest':
      case '-d':
        options.dest = args[++i];
        break;
      case '--period':
      case '-p':
        options.period = args[++i];
        break;
      case '--move':
      case '-m':
        options.copy = false;
        break;
      case '--pocketbase':
      case '--pb':
        options.usePocketBase = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
${colors.bright}XML Organizer - Organizador de Arquivos XML por Data${colors.reset}

${colors.bright}Uso:${colors.reset}
  node scripts/organize-xmls.js [opções]

${colors.bright}Opções:${colors.reset}
  -s, --source <dir>     Diretório de origem (padrão: ./xmls)
  -d, --dest <dir>       Diretório de destino (padrão: ./xmls_organized)
  -p, --period <period>  Período: year|month|week|day (padrão: month)
  -m, --move             Mover arquivos em vez de copiar
  --pb, --pocketbase     Registrar no PocketBase
  -h, --help             Mostrar esta ajuda

${colors.bright}Exemplos:${colors.reset}
  # Copiar para month (padrão)
  node scripts/organize-xmls.js

  # Organizar por dia
  node scripts/organize-xmls.js --period day

  # Mover arquivos para outro local
  node scripts/organize-xmls.js --source /mnt/nfs/xmls --dest ./organized --move

  # Registrar no PocketBase
  node scripts/organize-xmls.js --pocketbase

${colors.bright}Estrutura de saída:${colors.reset}
  month: 2024/01 - Janeiro/
  week:  2024/Semana 01/
  day:   2024/01 - Janeiro/15 - Segunda/
  year:  2024/
  `);
}

async function main() {
  try {
    const options = parseArgs();

    printHeader('🚀 Organizador de XMLs - v4.1.0');

    // Validações
    if (!fs.existsSync(options.source)) {
      printError(`Diretório de origem não encontrado: ${options.source}`);
      process.exit(1);
    }

    // Mostrar configurações
    console.log(`📁 Origem:      ${colors.bright}${options.source}${colors.reset}`);
    console.log(`📁 Destino:     ${colors.bright}${options.dest}${colors.reset}`);
    console.log(`📅 Período:     ${colors.bright}${options.period}${colors.reset}`);
    console.log(`📋 Ação:        ${colors.bright}${options.copy ? 'Copiar' : 'Mover'}${colors.reset}`);
    console.log();

    // PocketBase (opcional)
    let estabelecimentoId = null;
    if (options.usePocketBase) {
      printInfo('Conectando ao PocketBase...');
      try {
        await pocketbaseService.connect();
        await pocketbaseService.authenticateAdmin(
          process.env.POCKETBASE_ADMIN_EMAIL,
          process.env.POCKETBASE_ADMIN_PASSWORD
        );
        printSuccess('Conectado ao PocketBase');

        const estabelecimentos = await pocketbaseService.listEstabelecimentos();
        if (estabelecimentos.length > 0) {
          estabelecimentoId = estabelecimentos[0].id;
          printInfo(`Usando estabelecimento: ${estabelecimentos[0].razao_social}`);
        } else {
          printWarning('Nenhum estabelecimento cadastrado no PocketBase');
        }
      } catch (error) {
        printWarning(`Não foi possível conectar ao PocketBase: ${error.message}`);
      }
    }

    // Contar arquivos
    printInfo('Contando arquivos...');
    const files = xmlOrganizer.getXmlFiles(options.source);
    if (files.length === 0) {
      printWarning('Nenhum arquivo XML encontrado');
      process.exit(0);
    }
    printInfo(`${colors.bright}${files.length}${colors.reset} arquivo(s) XML encontrado(s)`);

    // Amostra de datas
    console.log(`\n${colors.bright}Amostra de datas encontradas:${colors.reset}`);
    for (let i = 0; i < Math.min(5, files.length); i++) {
      const dateInfo = await xmlDateParser.parseXmlDate(files[i]);
      const folder = xmlDateParser.generateFolderPath(dateInfo.date, options.period);
      console.log(`  • ${path.basename(files[i])} → ${colors.bright}${folder}${colors.reset}`);
    }
    if (files.length > 5) {
      console.log(`  • ... e mais ${files.length - 5} arquivo(s)`);
    }

    // Proceder com organização
    console.log();
    printInfo('Iniciando organização...');
    console.log();

    const resultado = await xmlOrganizer.organize(
      options.source,
      options.dest,
      {
        period: options.period,
        copy: options.copy,
        estabelecimentoId
      }
    );

    // Resultados
    printHeader('📊 Resultados');

    if (resultado.success) {
      printSuccess(`${resultado.organized} arquivo(s) organizado(s) com sucesso`);
      
      if (resultado.errors > 0) {
        printWarning(`${resultado.errors} arquivo(s) com erro`);
      }

      console.log(`\n${colors.bright}Resumo por tipo:${colors.reset}`);
      Object.entries(resultado.byType).forEach(([type, count]) => {
        console.log(`  • ${type.toUpperCase()}: ${colors.bright}${count}${colors.reset}`);
      });

      console.log(`\n${colors.bright}Resumo por período:${colors.reset}`);
      Object.entries(resultado.byMonth).forEach(([month, count]) => {
        console.log(`  • ${month}: ${colors.bright}${count}${colors.reset}`);
      });

      // Estatísticas
      if (resultado.details) {
        const successful = resultado.details.filter(d => d.status === 'success');
        const withErrors = resultado.details.filter(d => d.status === 'error');

        console.log(`\n${colors.bright}Estatísticas:${colors.reset}`);
        console.log(`  Taxa de sucesso: ${colors.green}${(successful.length / resultado.details.length * 100).toFixed(1)}%${colors.reset}`);
        
        if (withErrors.length > 0) {
          console.log(`\n${colors.bright}Erros encontrados:${colors.reset}`);
          withErrors.slice(0, 5).forEach(err => {
            console.log(`  • ${colors.red}${err.file}${colors.reset}: ${err.error}`);
          });
          if (withErrors.length > 5) {
            console.log(`  • ... e mais ${withErrors.length - 5} erro(s)`);
          }
        }
      }

    } else {
      printError(`Erro durante organização: ${resultado.error}`);
      process.exit(1);
    }

    // Gerar relatório
    const report = xmlOrganizer.generateReport();
    const reportPath = path.join(options.dest, 'relatorio.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    printInfo(`Relatório salvo em: ${colors.bright}${reportPath}${colors.reset}`);

    printHeader('✅ Processo Concluído!');
    printInfo(`Arquivos organizados em: ${colors.bright}${options.dest}${colors.reset}`);

    process.exit(0);

  } catch (error) {
    printError(`Erro fatal: ${error.message}`);
    logger.error('Erro ao organizar XMLs', error);
    process.exit(1);
  }
}

// Executar
main();
