# 🚀 Guia de Setup - XML Sender v4.0

Com **PocketBase** integrado! Backend robusto com SQLite, autenticação e APIs REST.

## Pré-requisitos

- Node.js 14+
- npm ou yarn
- PocketBase (será instalado automaticamente)

## Instalação Rápida

### 1. Clonar o repositório
```bash
git clone https://github.com/wanderpereira/xmlsender.git
cd xmlsender
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
nano .env
```

### Variáveis de Ambiente Necessárias

```env
# PocketBase Configuration
POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=sua-senha-admin-segura
POCKETBASE_DIR=./pb

# SMTP Configuration (para fallback)
SMTP_SERVICE=gmail
SMTP_USERNAME=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-app

# Email Settings
MAIL_FROM=XML Sender <seu-email@gmail.com>
MAIL_TO=contador@example.com

# Application
APP_DATA_DIR=./data
DEFAULT_ZIP_PATH=./xmlfiles.zip

# Debug
DEBUG=false
```

## Como Usar

### Iniciar PocketBase (em um terminal)
```bash
npm run pocketbase
# Ou se tiver PocketBase instalado globalmente:
# pocketbase serve --dir ./pb
```

Acesse o painel admin em: **http://127.0.0.1:8090/_/**

### Iniciar a Aplicação Electron (em outro terminal)
```bash
npm start
```

## Configurar PocketBase

### 1. Login no Painel Admin
- URL: `http://127.0.0.1:8090/_/`
- Email: Use o `POCKETBASE_ADMIN_EMAIL` do `.env`
- Senha: Use o `POCKETBASE_ADMIN_PASSWORD` do `.env`

### 2. Criar Coleções
Use o arquivo `src/database/pocketbase-schemas.js` como referência. Crie as seguintes coleções:

#### Estabelecimentos
- `razao_social` (texto) *obrigatório
- `cnpj` (texto, único) *obrigatório
- `email` (email) *obrigatório
- `telefone` (texto)
- `contador_email` (email) *obrigatório
- `contato_responsavel` (texto)
- `ativo` (booleano, padrão: true)
- `observacoes` (editor)

#### SMTP Config
- `estabelecimento` (relação → estabelecimentos) *obrigatório
- `servico` (select: gmail, outlook, yahoo, smtp_customizado) *obrigatório
- `email_usuario` (email) *obrigatório
- `senha_app` (texto) *obrigatório
- `host_smtp` (texto)
- `porta_smtp` (número)
- `usar_tls` (booleano, padrão: true)
- `testado` (booleano)
- `ativo` (booleano, padrão: true)

#### Email Logs
- `estabelecimento` (relação → estabelecimentos) *obrigatório
- `destinatario` (email) *obrigatório
- `assunto` (texto) *obrigatório
- `arquivo` (texto)
- `status` (select: enviado, erro, pendente) *obrigatório
- `data_envio` (data) *obrigatório
- `erro_mensagem` (texto)

#### XML Files
- `estabelecimento` (relação → estabelecimentos) *obrigatório
- `nome_arquivo` (texto) *obrigatório
- `tipo` (select: nfe, cte, mdfe, nfse, cfop) *obrigatório
- `data_criacao` (data) *obrigatório
- `processado` (booleano, padrão: false)
- `data_processamento` (data)

### 3. Configurar Permissões
Defina as permissões de acesso para cada coleção conforme sua necessidade.

## Estrutura de Pastas

```
.
├── main.js                          # Entrada da app Electron
├── preload.js                       # IPC seguro
├── package.json                     # Dependências
├── .env.example                     # Variáveis de exemplo
├── SETUP.md                         # Este arquivo
├── public/                          # Assets da interface
│   ├── home.html
│   ├── ajustes.html
│   └── css/
├── src/
│   ├── config/
│   │   └── config.js               # Configuração centralizada
│   ├── services/
│   │   └── pocketbaseService.js    # Integração PocketBase ⭐
│   ├── controllers/
│   │   ├── mailer.js               # Envio de emails
│   │   ├── core.js                 # Lógica principal
│   │   └── ...
│   ├── pages/
│   │   ├── home.js
│   │   └── ...
│   ├── utils/
│   │   ├── validators.js           # Validações
│   │   ├── logger.js               # Sistema de logs
│   │   └── ...
│   └── database/
│       └── pocketbase-schemas.js   # Schemas do PocketBase
└── pb/                             # Dados do PocketBase (gitignore)
    └── pb_data/
```

## Melhorias na v4.0

✅ **Banco de Dados:** PocketBase (SQLite) em vez de JSON  
✅ **Backend:** API REST automática com PocketBase  
✅ **Autenticação:** Sistema de autenticação integrado  
✅ **Logs:** Rastreamento completo de emails e processamentos  
✅ **Escalabilidade:** Estrutura pronta para múltiplos estabelecimentos  
✅ **Segurança:** Validação, context isolation e logs detalhados  
✅ **Painel Admin:** Interface web para gerenciar dados

## Troubleshooting

### PocketBase não inicia
```bash
# Verificar se a porta 8090 está disponível
lsof -i :8090

# Ou tentar porta diferente
pocketbase serve --http=127.0.0.1:8091
```

### Erro ao conectar ao PocketBase
- Verificar se PocketBase está rodando
- Confirmar URL em `.env` (padrão: http://127.0.0.1:8090)
- Verificar credenciais admin no `.env`

### Email não foi encaminhado
- Verificar configuração SMTP no painel PocketBase
- Confirmar se o estabelecimento está ativo
- Validar credenciais de email
- Verificar logs em `./data/logs/`

## Backup e Migrations

Para fazer backup do PocketBase:
```bash
cp -r pb/pb_data pb/pb_data.backup
```

## Documentação

- [PocketBase Docs](https://pocketbase.io/)
- [PocketBase JavaScript SDK](https://pocketbase.io/docs/sdk-setup/javascript/)

## Suporte

Para reportar bugs ou sugerir melhorias, abra uma issue no GitHub.
