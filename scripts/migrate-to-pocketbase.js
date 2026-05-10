#!/usr/bin/env node

/**
 * Script para migrar dados JSON antigos para PocketBase
 * Uso: node scripts/migrate-to-pocketbase.js
 */

const fs = require('fs');
const path = require('path');
const PocketBase = require('pocketbase/cjs');
const logger = require('../src/utils/logger');
require('dotenv').config();

const config = {
  url: process.env.POCKETBASE_URL || 'http://127.0.0.1:8090',
  adminEmail: process.env.POCKETBASE_ADMIN_EMAIL,
  adminPassword: process.env.POCKETBASE_ADMIN_PASSWORD,
};

async function migrateData() {
  const pb = new PocketBase(config.url);

  try {
    logger.info('🔌 Conectando ao PocketBase...');
    await pb.admins.authWithPassword(config.adminEmail, config.adminPassword);
    logger.info('✅ Autenticado com sucesso');

    // Migrar estabelecimentos
    const ajustesPath = path.join(__dirname, '../src/database/package-ajustes.json');
    if (fs.existsSync(ajustesPath)) {
      logger.info('📦 Migrando dados de estabelecimentos...');
      const ajustes = JSON.parse(fs.readFileSync(ajustesPath, 'utf8'));

      const estabelecimento = await pb.collection('estabelecimentos').create({
        razao_social: ajustes.estabelecimento,
        cnpj: ajustes.cnpj,
        email: ajustes.email,
        telefone: ajustes.telefone,
        contador_email: ajustes.contab,
        contato_responsavel: ajustes.contato || 'Responsável'
      });

      logger.info(`✅ Estabelecimento migrado com ID: ${estabelecimento.id}`);

      // Migrar configurações SMTP
      const smtpPath = path.join(__dirname, '../src/database/package-smtp.json');
      if (fs.existsSync(smtpPath)) {
        logger.info('📧 Migrando configurações SMTP...');
        const smtp = JSON.parse(fs.readFileSync(smtpPath, 'utf8'));

        const smtpConfig = await pb.collection('smtp_config').create({
          estabelecimento: estabelecimento.id,
          servico: smtp.service,
          email_usuario: smtp.username,
          senha_app: smtp.password,
          ativo: true
        });

        logger.info(`✅ Configuração SMTP migrada com ID: ${smtpConfig.id}`);
      }
    }

    logger.info('🎉 Migração concluída com sucesso!');
    logger.info('⚠️  Importante: Agora use o painel admin do PocketBase para gerenciar dados');
    process.exit(0);

  } catch (error) {
    logger.error('❌ Erro durante migração', { error: error.message });
    process.exit(1);
  }
}

// Executar migração
migrateData();
