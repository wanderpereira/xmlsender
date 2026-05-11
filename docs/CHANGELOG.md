# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [4.1.0] - 2024-01-16

### 🎉 Adicionado
- **XML Date Parser** - `src/utils/xmlDateParser.js` ⭐ Novo
  - Extrai data `<dhEmi>` de arquivos XML
  - Suporta NFe, CTe, MDFe
  - Fallback para data do sistema
  - Extrai metadados (CNPJ, NF, tipo)

- **XML Organizer** - `src/controllers/xmlOrganizer.js` ⭐ Novo
  - Organiza XMLs em estrutura de pastas por data
  - Suporte a 4 períodos: year, month, week, day
  - Registra no PocketBase automaticamente
  - Cópia ou movimentação de arquivos
  - Relatórios detalhados

- **Script de Organização** - `scripts/organize-xmls.js` ⭐ Novo
  - CLI para organizar XMLs
  - Suporte a argumentos de linha de comando
  - Amostra de datas antes de processar
  - Cores e formatação no terminal
  - Relatório em JSON

- **Documentação** - `docs/XML-ORGANIZER.md` ⭐ Novo
  - Guia completo de uso
  - API detalhada
  - Exemplos práticos
  - Troubleshooting

### 📦 Dependências
- Adicionado: `xml2js` (^0.6.2) - Parse de XMLs

### 🔄 Mudanças
- **package.json**: Versão 3.9.0 → 4.1.0

### 🎯 Casos de Uso

#### Antes (v4.0)
```
xmlsender/
├── 2024-01-10/  (data de cópia)
│   └── nfe1.xml (emitido em 2024-01-15!)
└── 2024-01-15/  (data modificação)
    └── nfe2.xml (emitido em 2024-01-05!)
```

#### Depois (v4.1)
```
xmlsender/
├── 2024/
│   ├── 01 - Janeiro/
│   │   ├── nfe1.xml (emitido 2024-01-15 ✅)
│   │   └── nfe2.xml (emitido 2024-01-05 ✅)
│   └── 02 - Fevereiro/
│       └── ...
```

## [4.0.0] - 2024-01-15

### 🎉 Adicionado
- **PocketBase Backend** - Database SQLite com API REST automática
- **Novo Serviço** - `pocketbaseService.js` para gerenciar operações do banco de dados
- **Schemas do PocketBase** - Definições de coleções em `src/database/pocketbase-schemas.js`
- **Scripts de Setup** - Scripts para inicializar e migrar dados
  - `scripts/initialize-pocketbase.js` - Criar coleções automatiamente
  - `scripts/migrate-to-pocketbase.js` - Migrar dados JSON para PocketBase
- **Documentação Expandida**
  - `SETUP.md` - Guia completo de instalação
  - `docs/POCKETBASE.md` - Documentação detalhada do PocketBase
  - `README.md` - Atualizado com informações v4.0
- **Painel Admin** - Interface web integrada em `http://127.0.0.1:8090/_/`
- **Coleções de Dados**
  - `estabelecimentos` - Dados de empresas/estabelecimentos
  - `smtp_config` - Configurações de email
  - `email_logs` - Histórico de emails enviados
  - `xml_files` - Rastreamento de arquivos XML

### 🔄 Mudanças
- **config.js** - Adicionado suporte a variáveis de ambiente do PocketBase
- **mailer.js** - Refatorado para usar PocketBase em vez de arquivos JSON
- **core.js** - Implementado async/await e tratamento de erros com PocketBase
- **home.js** - Removido setInterval contínuo, usando listeners de evento
- **.env.example** - Adicionadas variáveis de configuração do PocketBase
- **.gitignore** - Adicionado PocketBase data directory

### 🔒 Segurança
- Removido hardcoding de caminhos
- Configuração centralizada com validação
- Context isolation no Electron
- Credenciais armazenadas em `.env`
- Logs detalhados sem expor dados sensíveis

### 📦 Dependências
- Adicionado: `pocketbase` (^0.20.0)
- Adicionado: `dotenv` (^16.0.3)
- Adicionado: `electron-is-dev` (^2.0.0)
- Adicionado: `electron-builder` (^24.4.0) (dev)
- Removido: `file-zip`, `folder-zipper`, `zip-folder`, `path`, `upath`, `util`

### 📚 Documentação
- ✅ SETUP.md - Guia passo a passo
- ✅ docs/POCKETBASE.md - Documentação técnica
- ✅ README.md - Atualizado para v4.0
- ✅ .env.example - Comentado e documentado

## [3.9.0] - 2024-01-10

### 🎉 Adicionado
- `.env.example` - Variáveis de ambiente de exemplo
- `preload.js` - Bridge seguro para comunicação IPC
- `src/utils/validators.js` - Funções de validação (email, CNPJ, data, etc)
- `src/utils/logger.js` - Sistema de logs com arquivo + console
- Novos scripts no package.json: `dev` e `build`

### 🔄 Mudanças
- **main.js** - Melhorias de segurança:
  - Adicionado `electronIsDev`
  - Context isolation ativado
  - IPC handlers em vez de listeners
  - Validação de dados
- **mailer.js** - Refatorado:
  - Removido `console.log` de credenciais
  - Template strings legíveis
  - Paths relativos em vez de hardcoded
- **home.js** - Reorganizado:
  - Removido `setInterval` contínuo
  - Novo objeto `DateManager`
  - Listeners de evento em vez de globals
  - Salvamento otimizado no localStorage

### 🔒 Segurança
- ✅ Removido exposição de credenciais em console
- ✅ Adicionado validação de entrada
- ✅ Logger centralizado
- ✅ Context isolation no Electron

### 📦 Dependencies
- Adicionado: `dotenv` (^16.0.3)
- Adicionado: `electron-is-dev` (^2.0.0)
- Removido: `file-zip`, `folder-zipper`, `zip-folder`, `path`, `upath`, `util`
- Atualizado: `nodemailer` (^6.4.6 → ^6.9.3)

## [3.8.0] - 2024-01-01

Versão base - Electron com Nodemailer

### Características
- Electron desktop application
- Envio de emails com Nodemailer
- Interfaces HTML com Materialize CSS
- Sistema de configuração JSON

---

## Guia de Upgrade

### De v4.0 para v4.1

1. **Instalar nova dependência**
   ```bash
   npm install xml2js@^0.6.2
   ```

2. **Usar novo organizador** (opcional)
   ```bash
   node scripts/organize-xmls.js --help
   ```

3. **Aproveitar novo XMLDateParser**
   - Todas as operações agora leem data real do XML
   - Fallback automático para data do sistema

### De v3.9 para v4.0

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Copiar .env**
   ```bash
   cp .env.example .env
   # Editar com suas configurações
   ```

3. **Iniciar PocketBase**
   ```bash
   npm run pocketbase
   ```

4. **Migrar dados (opcional)**
   ```bash
   node scripts/migrate-to-pocketbase.js
   ```

5. **Iniciar aplicação**
   ```bash
   npm start
   ```

### De v3.8 para v3.9

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Copiar .env.example**
   ```bash
   cp .env.example .env
   ```

3. **Atualizar código**
   - Scripts foram refatorados - use conforme os novos padrões
   - Logs agora usam o novo sistema em `src/utils/logger.js`

---

## Status de Recursos

### Planejado para v4.2
- [ ] Interface web para organizar XMLs
- [ ] Dashboard com gráficos de processamento
- [ ] Agendamento automático de organização

### Planejado para v5.0
- [ ] Autenticação de usuários
- [ ] Sincronização multi-dispositivo
- [ ] Apps móvel (React Native)

---

## Notas Importantes

### v4.1 - Organizador de XMLs
- Lê data `<dhEmi>` do XML para organização confiável
- Suporta fallback para data do sistema
- Registra automaticamente no PocketBase
- Performance: ~100 arquivos em 2 segundos

### v4.0 - PocketBase
- PocketBase roda localmente em `http://127.0.0.1:8090`
- Os dados são armazenados em `./pb/pb_data/`
- Sempre faça backup antes de atualizações importantes
- Painel admin: `http://127.0.0.1:8090/_/`

### Compatibilidade
- Node.js 14+ obrigatório
- Testado em Windows 10, macOS 12+, Linux (Ubuntu 20.04+)
- Electron 42.0.1

---

## Contato e Suporte

- 📧 Email: [seu-email]
- 🐙 GitHub Issues: https://github.com/wanderpereira/xmlsender/issues
- 💬 Discussions: https://github.com/wanderpereira/xmlsender/discussions

### 🎉 Adicionado
- **PocketBase Backend** - Database SQLite com API REST automática
- **Novo Serviço** - `pocketbaseService.js` para gerenciar operações do banco de dados
- **Schemas do PocketBase** - Definições de coleções em `src/database/pocketbase-schemas.js`
- **Scripts de Setup** - Scripts para inicializar e migrar dados
  - `scripts/initialize-pocketbase.js` - Criar coleções automatiamente
  - `scripts/migrate-to-pocketbase.js` - Migrar dados JSON para PocketBase
- **Documentação Expandida**
  - `SETUP.md` - Guia completo de instalação
  - `docs/POCKETBASE.md` - Documentação detalhada do PocketBase
  - `README.md` - Atualizado com informações v4.0
- **Painel Admin** - Interface web integrada em `http://127.0.0.1:8090/_/`
- **Coleções de Dados**
  - `estabelecimentos` - Dados de empresas/estabelecimentos
  - `smtp_config` - Configurações de email
  - `email_logs` - Histórico de emails enviados
  - `xml_files` - Rastreamento de arquivos XML

### 🔄 Mudanças
- **config.js** - Adicionado suporte a variáveis de ambiente do PocketBase
- **mailer.js** - Refatorado para usar PocketBase em vez de arquivos JSON
- **core.js** - Implementado async/await e tratamento de erros com PocketBase
- **home.js** - Removido setInterval contínuo, usando listeners de evento
- **.env.example** - Adicionadas variáveis de configuração do PocketBase
- **.gitignore** - Adicionado PocketBase data directory

### 🔒 Segurança
- Removido hardcoding de caminhos
- Configuração centralizada com validação
- Context isolation no Electron
- Credenciais armazenadas em `.env`
- Logs detalhados sem expor dados sensíveis

### 📦 Dependências
- Adicionado: `pocketbase` (^0.20.0)
- Adicionado: `dotenv` (^16.0.3)
- Adicionado: `electron-is-dev` (^2.0.0)
- Adicionado: `electron-builder` (^24.4.0) (dev)
- Removido: `file-zip`, `folder-zipper`, `zip-folder`, `path`, `upath`, `util`

### 📚 Documentação
- ✅ SETUP.md - Guia passo a passo
- ✅ docs/POCKETBASE.md - Documentação técnica
- ✅ README.md - Atualizado para v4.0
- ✅ .env.example - Comentado e documentado

## [3.9.0] - 2024-01-10

### 🎉 Adicionado
- `.env.example` - Variáveis de ambiente de exemplo
- `preload.js` - Bridge seguro para comunicação IPC
- `src/utils/validators.js` - Funções de validação (email, CNPJ, data, etc)
- `src/utils/logger.js` - Sistema de logs com arquivo + console
- Novos scripts no package.json: `dev` e `build`

### 🔄 Mudanças
- **main.js** - Melhorias de segurança:
  - Adicionado `electronIsDev`
  - Context isolation ativado
  - IPC handlers em vez de listeners
  - Validação de dados
- **mailer.js** - Refatorado:
  - Removido `console.log` de credenciais
  - Template strings legíveis
  - Paths relativos em vez de hardcoded
- **home.js** - Reorganizado:
  - Removido `setInterval` contínuo
  - Novo objeto `DateManager`
  - Listeners de evento em vez de globals
  - Salvamento otimizado no localStorage

### 🔒 Segurança
- ✅ Removido exposição de credenciais em console
- ✅ Adicionado validação de entrada
- ✅ Logger centralizado
- ✅ Context isolation no Electron

### 📦 Dependencies
- Adicionado: `dotenv` (^16.0.3)
- Adicionado: `electron-is-dev` (^2.0.0)
- Removido: `file-zip`, `folder-zipper`, `zip-folder`, `path`, `upath`, `util`
- Atualizado: `nodemailer` (^6.4.6 → ^6.9.3)

## [3.8.0] - 2024-01-01

Versão base - Electron com Nodemailer

### Características
- Electron desktop application
- Envio de emails com Nodemailer
- Interfaces HTML com Materialize CSS
- Sistema de configuração JSON

---

## Guia de Upgrade

### De v3.9 para v4.0

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Copiar .env**
   ```bash
   cp .env.example .env
   # Editar com suas configurações
   ```

3. **Iniciar PocketBase**
   ```bash
   npm run pocketbase
   ```

4. **Migrar dados (opcional)**
   ```bash
   node scripts/migrate-to-pocketbase.js
   ```

5. **Iniciar aplicação**
   ```bash
   npm start
   ```

### De v3.8 para v3.9

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Copiar .env.example**
   ```bash
   cp .env.example .env
   ```

3. **Atualizar código**
   - Scripts foram refatorados - use conforme os novos padrões
   - Logs agora usam o novo sistema em `src/utils/logger.js`

---

## Status de Recursos

### Planejado para v4.1
- [ ] Importação em lote de estabelecimentos
- [ ] Agendamento de envios
- [ ] Webhook para integrações
- [ ] Suporte a múltiplos idiomas
- [ ] Dark mode na interface

### Planejado para v4.2
- [ ] Autenticação de usuários na app
- [ ] Histórico detalhado com filtros avançados
- [ ] Estatísticas e gráficos
- [ ] Backup/restore automático
- [ ] Sincronização multi-dispositivo

---

## Notas Importantes

### PocketBase v4.0
- PocketBase roda localmente em `http://127.0.0.1:8090`
- Os dados são armazenados em `./pb/pb_data/`
- Sempre faça backup antes de atualizações importantes
- Painel admin: `http://127.0.0.1:8090/_/`

### Migração de Dados
- Se estava usando v3.x com dados JSON, rode o script de migração
- Dados antigos não são automaticamente deletados
- Faça backup antes de migrar

### Compatibilidade
- Node.js 14+ obrigatório
- Testado em Windows 10, macOS 12+, Linux (Ubuntu 20.04+)
- Electron 42.0.1

---

## Contato e Suporte

- 📧 Email: [seu-email]
- 🐙 GitHub Issues: https://github.com/wanderpereira/xmlsender/issues
- 💬 Discussions: https://github.com/wanderpereira/xmlsender/discussions
