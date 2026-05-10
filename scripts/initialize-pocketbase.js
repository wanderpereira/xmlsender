#!/usr/bin/env node

/**
 * Script para inicializar PocketBase com as coleções necessárias
 * Uso: node scripts/initialize-pocketbase.js
 */

const PocketBase = require('pocketbase/cjs');
const logger = require('../src/utils/logger');
require('dotenv').config();

const config = {
  url: process.env.POCKETBASE_URL || 'http://127.0.0.1:8090',
  adminEmail: process.env.POCKETBASE_ADMIN_EMAIL,
  adminPassword: process.env.POCKETBASE_ADMIN_PASSWORD,
};

async function initializePocketBase() {
  const pb = new PocketBase(config.url);

  try {
    logger.info('🔌 Conectando ao PocketBase...');
    
    // Autenticar como admin
    await pb.admins.authWithPassword(config.adminEmail, config.adminPassword);
    logger.info('✅ Autenticado com sucesso');

    // Definir schemas das coleções
    const collections = [
      {
        name: 'estabelecimentos',
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
      {
        name: 'smtp_config',
        fields: [
          { name: 'estabelecimento', type: 'relation', collectionId: 'estabelecimentos', required: true },
          { name: 'servico', type: 'select', required: true },
          { name: 'email_usuario', type: 'email', required: true },
          { name: 'senha_app', type: 'text', required: true },
          { name: 'host_smtp', type: 'text' },
          { name: 'porta_smtp', type: 'number' },
          { name: 'usar_tls', type: 'bool', default: true },
          { name: 'testado', type: 'bool', default: false },
          { name: 'ativo', type: 'bool', default: true }
        ]
      },
      {
        name: 'email_logs',
        fields: [
          { name: 'estabelecimento', type: 'relation', collectionId: 'estabelecimentos', required: true },
          { name: 'destinatario', type: 'email', required: true },
          { name: 'assunto', type: 'text', required: true },
          { name: 'arquivo', type: 'text' },
          { name: 'status', type: 'select', required: true },
          { name: 'data_envio', type: 'date', required: true },
          { name: 'erro_mensagem', type: 'text' }
        ]
      },
      {
        name: 'xml_files',
        fields: [
          { name: 'estabelecimento', type: 'relation', collectionId: 'estabelecimentos', required: true },
          { name: 'nome_arquivo', type: 'text', required: true },
          { name: 'tipo', type: 'select', required: true },
          { name: 'data_criacao', type: 'date', required: true },
          { name: 'processado', type: 'bool', default: false },
          { name: 'data_processamento', type: 'date' }
        ]
      }
    ];

    logger.info('📦 Criando coleções...');

    for (const collection of collections) {
      try {
        // Verificar se coleção já existe
        const existing = await pb.collections.getOne(collection.name).catch(() => null);
        
        if (existing) {
          logger.info(`⏭️  Coleção '${collection.name}' já existe`);
          continue;
        }

        // Criar nova coleção
        await pb.collections.create({
          name: collection.name,
          type: 'base',
          schema: collection.fields.map(field => ({
            id: generateId(),
            name: field.name,
            type: field.type,
            required: field.required || false,
            unique: field.unique || false,
            ...field
          }))
        });

        logger.info(`✅ Coleção '${collection.name}' criada com sucesso`);
      } catch (error) {
        logger.error(`❌ Erro ao criar coleção '${collection.name}'`, { error: error.message });
      }
    }

    logger.info('🎉 Inicialização concluída!');
    process.exit(0);

  } catch (error) {
    logger.error('❌ Erro durante inicialização', { error: error.message });
    process.exit(1);
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Executar inicialização
initializePocketBase();
