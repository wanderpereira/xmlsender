# 📁 Estrutura do Projeto XML Sender v4.0

## Visão Geral

```
xmlsender/
├── 📄 main.js                         ⭐ Entry point Electron
├── 📄 preload.js                      🔒 IPC seguro
├── 📄 package.json                    📦 Dependências
├── 📄 .env.example                    🔐 Variáveis de exemplo
├── 📄 .env                            🔐 Variáveis locais (git ignored)
├── 📄 .gitignore                      🚫 Arquivos ignorados
├── 📄 README.md                       📖 Documentação principal
├── 📄 LICENSE.md                      ⚖️  Licença MIT
├── 📂 public/                         🎨 Frontend (HTML/CSS/JS)
│   ├── 📄 home.html                   Página inicial
│   ├── 📄 ajustes.html                Configurações
│   ├── 📄 avancado.html               Opções avançadas
│   ├── 📄 smtp.html                   Configuração SMTP
│   └── 📂 css/
│       ├── materialize.min.css
│       └── styles.css
├── 📂 src/                            💻 Código fonte
│   ├── 📂 config/
│   │   └── 📄 config.js               ⚙️  Configurações centralizadas
│   ├── 📂 services/
│   │   └── 📄 pocketbaseService.js    🗄️  Cliente PocketBase ⭐ NOVO
│   ├── 📂 controllers/
│   │   ├── 📄 core.js                 🎯 Lógica principal
│   │   ├── 📄 mailer.js               📧 Envio de emails
│   │   ├── 📄 analyzer.js             📊 Análise de arquivos
│   │   ├── 📄 filtered.js             🔍 Filtros
│   │   ├── 📄 original.js             📁 Cópia de arquivos
│   │   ├── 📄 download.js             ⬇️  Downloads
│   │   └── 📂 components/
│   │       ├── 📄 checkString.js
│   │       ├── 📄 copy.js
│   │       └── 📄 zippath.js
│   ├── 📂 pages/
│   │   ├── 📄 home.js                 🏠 Lógica home
│   │   ├── 📄 ajustes.js              ⚙️  Lógica ajustes
│   │   ├── 📄 smtp.js                 📧 Lógica SMTP
│   │   └── 📄 switches.js             🔘 Controladores
│   ├── 📂 utils/
│   │   ├── 📄 validators.js           ✓ Validações
│   │   ├── 📄 logger.js               📋 Sistema de logs
│   │   └── ...
│   ├── 📂 database/
│   │   ├── 📄 pocketbase-schemas.js   🗄️  Schemas PocketBase ⭐ NOVO
│   │   └── 📄 package-*.json          (dados antigos v3.x)
│   └── 📂 activities.js               📝 Atividades
├── 📂 scripts/                        🔧 Scripts utilitários
│   ├── 📄 initialize-pocketbase.js    🔧 Setup banco de dados ⭐ NOVO
│   ├── 📄 migrate-to-pocketbase.js    📦 Migração v3→v4 ⭐ NOVO
│   └── 📄 verify-setup.js             ✓ Verificação ⭐ NOVO
├── 📂 docs/                           📚 Documentação
│   ├── 📄 POCKETBASE.md               🗄️  PocketBase guide ⭐ NOVO
│   ├── 📄 QUICK-START.md              🚀 Quick start ⭐ NOVO
│   ├── 📄 CHANGELOG.md                📝 Histórico versões ⭐ NOVO
│   └── 📄 EXAMPLES.js                 💡 Exemplos de uso ⭐ NOVO
├── 📂 data/                           💾 Dados aplicação
│   └── 📂 logs/
│       └── app-YYYY-MM-DD.log         📋 Logs
├── 📂 pb/                             🗄️  PocketBase (git ignored)
│   ├── 📂 pb_data/
│   │   ├── data.db                    SQLite database
│   │   └── ...
│   └── pocketbase                     Executável PocketBase
└── 📂 node_modules/                   📦 Dependências (git ignored)
```

## 📊 Legenda de Ícones

| Ícone | Significado |
|-------|------------|
| ⭐ NOVO | Arquivo criado/alterado na v4.0 |
| 📄 | Arquivo |
| 📂 | Pasta |
| 💻 | Código-fonte |
| 🗄️ | Database |
| ⚙️ | Configuração |
| 🎯 | Lógica principal |
| 📧 | Email |
| 🔒 | Segurança |
| 📚 | Documentação |

## 📋 Arquivos Principais

### Inicialização
- **main.js** - Cria janela Electron, configura IPC
- **preload.js** - Expõe APIs seguras para renderer

### Configuração
- **config.js** - Gerencia variáveis de ambiente
- **.env** - Credenciais locais (NÃO COMMITAR)
- **.env.example** - Template de configuração

### Backend
- **pocketbaseService.js** - ⭐ Cliente PocketBase (NOVO)
- **pocketbase-schemas.js** - ⭐ Definições de coleções (NOVO)

### Controllers
- **core.js** - Orquestra o processo principal
- **mailer.js** - Envia emails via SMTP
- **analyzer.js** - Analisa arquivos XML
- **filtered.js** - Filtra e copia arquivos
- **original.js** - Cria estrutura de pastas

### Utilidades
- **validators.js** - Validação de dados
- **logger.js** - Logs em arquivo + console

### Documentação
- **SETUP.md** - Guia de instalação completo
- **POCKETBASE.md** - ⭐ Documentação técnica (NOVO)
- **QUICK-START.md** - ⭐ Guia rápido (NOVO)
- **CHANGELOG.md** - ⭐ Histórico de versões (NOVO)
- **EXAMPLES.js** - ⭐ Exemplos de código (NOVO)

### Scripts
- **initialize-pocketbase.js** - ⭐ Cria coleções (NOVO)
- **migrate-to-pocketbase.js** - ⭐ Migra dados v3→v4 (NOVO)
- **verify-setup.js** - ⭐ Verifica configuração (NOVO)

## 🔄 Fluxo de Dados

```
┌─────────────────┐
│   Electron UI   │ (public/*.html)
└────────┬────────┘
         │ IPC
┌────────▼────────────┐
│   Main Process      │ (main.js)
└────────┬────────────┘
         │
┌────────▼──────────────────────┐
│   Controllers (core.js)        │
│   ├─ Analyzer                  │
│   ├─ Filter                    │
│   ├─ Mailer                    │
│   └─ Download                  │
└────────┬───────────────────────┘
         │
┌────────▼──────────────────────┐
│   PocketBase Service           │ ⭐ NOVO
│   └─ REST API calls            │
└────────┬───────────────────────┘
         │
┌────────▼──────────────────────┐
│   PocketBase Server            │
│   ├─ SQLite Database           │
│   ├─ REST API                  │
│   └─ Admin Panel               │
└────────────────────────────────┘
```

## 🎯 Responsabilidades por Camada

### Frontend (public/)
- Renderizar interface
- Capturar entrada do usuário
- Comunicar via IPC

### Main Process (main.js)
- Gerenciar janelas
- Validar IPC
- Orquestrar operações

### Controllers (src/controllers/)
- Lógica de negócio
- Processamento de arquivos
- Orquestração de serviços

### Services (src/services/)
- Comunicação com PocketBase
- Operações CRUD
- Tratamento de erros

### PocketBase
- Armazenamento persistente
- APIs REST
- Autenticação

## 📈 Escalabilidade

A estrutura foi projetada para:
- ✅ Suportar múltiplos estabelecimentos
- ✅ Armazenar histórico de operações
- ✅ Expandir com novos tipos de documentos
- ✅ Integrar com APIs externas
- ✅ Fazer backup e restore

## 🔐 Segurança

Arquivos sensíveis (git ignored):
```
.env              # Credenciais locais
pb/pb_data/       # Database PocketBase
node_modules/     # Dependências instaladas
data/logs/        # Logs da aplicação
database.json     # Database antigo (v3.x)
```

## 🚀 Próximos Passos para Extensão

1. **Novos Controllers** - Adicionar em `src/controllers/`
2. **Novos Serviços** - Adicionar em `src/services/`
3. **Nova Coleção** - Definir em `pocketbase-schemas.js`
4. **Novas Páginas** - Adicionar em `public/` e `src/pages/`

---

Para mais informações, veja:
- [SETUP.md](../SETUP.md) - Guia de instalação
- [docs/POCKETBASE.md](../docs/POCKETBASE.md) - Documentação técnica
- [docs/QUICK-START.md](../docs/QUICK-START.md) - Início rápido
