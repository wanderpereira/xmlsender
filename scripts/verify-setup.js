#!/usr/bin/env node

/**
 * Script de Verificação - XML Sender v4.0
 * 
 * Verifica se todas as configurações e dependências estão corretas
 * Uso: node scripts/verify-setup.js
 */

const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[36m';
const RESET = '\x1b[0m';

let errors = [];
let warnings = [];

function success(message) {
  console.log(`${GREEN}✅${RESET} ${message}`);
}

function error(message) {
  console.log(`${RED}❌${RESET} ${message}`);
  errors.push(message);
}

function warning(message) {
  console.log(`${YELLOW}⚠️${RESET}  ${message}`);
  warnings.push(message);
}

function info(message) {
  console.log(`${BLUE}ℹ️${RESET}  ${message}`);
}

function header(message) {
  console.log(`\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`${BLUE}${message}${RESET}`);
  console.log(`${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);
}

async function verify() {
  header('🔍 Verificando Setup - XML Sender v4.0');

  // 1. Verificar arquivos essenciais
  header('1️⃣  Arquivos Essenciais');

  const essentialFiles = [
    'package.json',
    'main.js',
    'preload.js',
    '.env.example',
    '.gitignore',
    'src/config/config.js',
    'src/services/pocketbaseService.js',
    'src/database/pocketbase-schemas.js',
    'SETUP.md',
    'README.md',
  ];

  essentialFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      success(`${file}`);
    } else {
      error(`${file} - NÃO ENCONTRADO`);
    }
  });

  // 2. Verificar scripts
  header('2️⃣  Scripts de Setup');

  const scripts = [
    'scripts/initialize-pocketbase.js',
    'scripts/migrate-to-pocketbase.js',
  ];

  scripts.forEach(script => {
    const scriptPath = path.join(__dirname, '..', script);
    if (fs.existsSync(scriptPath)) {
      success(`${script}`);
    } else {
      error(`${script} - NÃO ENCONTRADO`);
    }
  });

  // 3. Verificar documentação
  header('3️⃣  Documentação');

  const docs = [
    'docs/POCKETBASE.md',
    'docs/CHANGELOG.md',
    'docs/QUICK-START.md',
    'docs/EXAMPLES.js',
  ];

  docs.forEach(doc => {
    const docPath = path.join(__dirname, '..', doc);
    if (fs.existsSync(docPath)) {
      success(`${doc}`);
    } else {
      error(`${doc} - NÃO ENCONTRADO`);
    }
  });

  // 4. Verificar package.json
  header('4️⃣  Dependências (package.json)');

  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
    );

    const requiredDeps = [
      'electron',
      'nodemailer',
      'pocketbase',
      'moment',
      'adm-zip',
      'xml-js',
    ];

    requiredDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        success(`${dep} v${packageJson.dependencies[dep]}`);
      } else {
        error(`${dep} - NÃO ENCONTRADO em dependencies`);
      }
    });

    // Verificar versão
    info(`Versão do projeto: ${packageJson.version}`);
    
    if (packageJson.version === '4.0.0') {
      success('Versão v4.0.0 confirmada');
    } else {
      warning(`Versão é ${packageJson.version}, esperado 4.0.0`);
    }

  } catch (err) {
    error(`Erro ao ler package.json: ${err.message}`);
  }

  // 5. Verificar .env
  header('5️⃣  Configuração de Ambiente');

  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');

  if (fs.existsSync(envPath)) {
    success('.env encontrado');
    
    // Verificar variáveis
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
      'POCKETBASE_URL',
      'POCKETBASE_ADMIN_EMAIL',
      'POCKETBASE_ADMIN_PASSWORD',
      'SMTP_SERVICE',
      'SMTP_USERNAME',
      'SMTP_PASSWORD',
    ];

    requiredVars.forEach(varName => {
      if (envContent.includes(varName)) {
        success(`${varName} configurado`);
      } else {
        warning(`${varName} não está em .env`);
      }
    });

  } else {
    warning('.env não encontrado');
    if (fs.existsSync(envExamplePath)) {
      info('Execute: cp .env.example .env');
    }
  }

  // 6. Verificar estrutura de pastas
  header('6️⃣  Estrutura de Pastas');

  const folders = [
    'src',
    'src/config',
    'src/services',
    'src/controllers',
    'src/pages',
    'src/utils',
    'src/database',
    'public',
    'public/css',
    'public/js',
    'scripts',
    'docs',
  ];

  folders.forEach(folder => {
    const folderPath = path.join(__dirname, '..', folder);
    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      success(`${folder}/`);
    } else {
      error(`${folder}/ - NÃO ENCONTRADO`);
    }
  });

  // 7. Verificar node_modules
  header('7️⃣  Node Modules');

  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    success('node_modules encontrado');
    info('Execute: npm install (se tiver atualizações)');
  } else {
    error('node_modules não encontrado');
    info('Execute: npm install');
  }

  // 8. Resultado final
  header('📋 Resumo da Verificação');

  if (errors.length === 0 && warnings.length === 0) {
    console.log(`${GREEN}🎉 Tudo está configurado corretamente!${RESET}\n`);
    console.log('Próximos passos:');
    console.log(`${BLUE}1.${RESET} Inicie PocketBase:      npm run pocketbase`);
    console.log(`${BLUE}2.${RESET} Em outro terminal:      npm start`);
    console.log(`${BLUE}3.${RESET} Acesse painel admin:    http://127.0.0.1:8090/_/\n`);
    process.exit(0);
  }

  if (warnings.length > 0) {
    console.log(`${YELLOW}⚠️  ${warnings.length} aviso(s):${RESET}`);
    warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
    console.log();
  }

  if (errors.length > 0) {
    console.log(`${RED}❌ ${errors.length} erro(s) encontrado(s):${RESET}`);
    errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
    console.log();
    console.log(`${RED}Corrija os erros acima antes de continuar.${RESET}\n`);
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Executar verificação
verify().catch(err => {
  console.error('Erro ao verificar:', err);
  process.exit(1);
});
