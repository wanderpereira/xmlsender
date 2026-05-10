# XML Sender 🚀 v4.0

> Aplicativo Electron para envio de pacotes XML via Email com backend **PocketBase**

Agora com banco de dados integrado, painel admin e APIs REST!

## ✨ Características

- 📧 **Email Automático** - Envie pacotes XML via email
- 🗄️ **PocketBase Backend** - Database SQLite + APIs REST
- 👤 **Autenticação** - Sistema de login integrado
- 📊 **Painel Admin** - Gerencie dados via interface web
- 📝 **Histórico** - Rastreamento completo de emails
- 🔒 **Seguro** - Context isolation + validação
- ⚡ **Vanilla JS** - Sem dependências desnecessárias
- 🎯 **Modularizado** - Código bem organizado

## 🚀 Quick Start

### 1. Clonar e instalar
```bash
git clone https://github.com/wanderpereira/xmlsender.git
cd xmlsender
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite .env com suas credenciais
```

### 3. Iniciar PocketBase (terminal 1)
```bash
npm run pocketbase
# Acesse: http://127.0.0.1:8090/_/
```

### 4. Iniciar Aplicação (terminal 2)
```bash
npm start
```

## 📚 Documentação

- **[SETUP.md](./SETUP.md)** - Guia de instalação detalhado
- **[docs/POCKETBASE.md](./docs/POCKETBASE.md)** - Documentação do PocketBase
- **[CHANGELOG.md](./CHANGELOG.md)** - Histórico de versões

## 📂 Estrutura

```
.
├── main.js                       # Entry point Electron
├── preload.js                    # IPC seguro
├── package.json
├── .env.example
├── SETUP.md                      # 📖 Leia primeiro!
├── public/                       # Interface HTML
│   ├── home.html
│   ├── ajustes.html
│   ├── avancado.html
│   └── css/
├── src/
│   ├── config/
│   │   └── config.js            # ⚙️ Configurações
│   ├── services/
│   │   └── pocketbaseService.js # 🗄️ PocketBase
│   ├── controllers/
│   │   ├── mailer.js            # 📧 Emails
│   │   ├── core.js              # 🎯 Core logic
│   │   └── ...
│   ├── pages/
│   │   ├── home.js
│   │   └── ...
│   ├── utils/
│   │   ├── validators.js        # ✓ Validações
│   │   ├── logger.js            # 📋 Logs
│   │   └── ...
│   └── database/
│       ├── pocketbase-schemas.js
│       └── ...
├── scripts/
│   ├── initialize-pocketbase.js  # 🔧 Setup PocketBase
│   └── migrate-to-pocketbase.js  # 📦 Migrar dados
├── docs/
│   └── POCKETBASE.md             # 📚 PocketBase docs
└── pb/                           # 📦 Dados PocketBase
    └── pb_data/
```

## 🛠️ Scripts Disponíveis

```bash
npm start           # Iniciar aplicação
npm run dev         # Modo desenvolvimento
npm run build       # Build da aplicação
npm run pocketbase  # Iniciar servidor PocketBase
```

## 🔄 Migração de Dados (v3.x → v4.0)

Se você vinha usando versões anteriores:

```bash
# 1. Configurar .env
cp .env.example .env

# 2. Iniciar PocketBase
npm run pocketbase

# 3. Em outro terminal, migrar dados
node scripts/migrate-to-pocketbase.js

# 4. Iniciar aplicação
npm start
```

## 🔐 Segurança

- ✅ Sem credenciais expostas em código
- ✅ Variáveis de ambiente (.env)
- ✅ Context isolation no Electron
- ✅ Validação de entrada em todos os campos
- ✅ Logs detalhados de operações
- ✅ Autenticação no PocketBase

## 📊 Versão Atual

**v4.0.0** - Integração completa com PocketBase

### Mudanças na v4.0
- ✅ Migração para PocketBase (SQLite)
- ✅ Novo serviço `pocketbaseService.js`
- ✅ Scripts de inicialização e migração
- ✅ Documentação expandida
- ✅ Painel admin integrado
- ✅ APIs REST automáticas
- ✅ Suporte a múltiplos estabelecimentos

## 📋 Changelog Recente

- [v4.0.0](./docs/CHANGELOG.md#v400) - PocketBase integration
- [v3.9.0](./docs/CHANGELOG.md#v390) - Melhorias de segurança
- [v3.8.0](./docs/CHANGELOG.md#v380) - Versão inicial

## 🤝 Contribuindo

Pull requests são bem-vindos! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

MIT License - veja [LICENSE.md](LICENSE.md)

## 👤 Autor

**Wander Pereira**
- GitHub: [@wanderpereira](https://github.com/wanderpereira)

## 🙏 Agradecimentos

- [Electron.js](https://www.electronjs.org/)
- [PocketBase](https://pocketbase.io/)
- [Nodemailer](https://nodemailer.com/)
- [Materialize CSS](https://materializecss.com/)