# 🗄️ Integração PocketBase - Documentação

Este documento descreve como usar PocketBase no XML Sender v4.0+

## O que é PocketBase?

PocketBase é um backend open-source em Go que oferece:
- **Database SQLite** - Rápido e leve
- **API REST** - Gerada automaticamente
- **Autenticação** - Sistema de login integrado
- **Painel Admin** - Interface web intuitiva
- **Real-time** - Suporte a WebSockets (opcional)
- **File storage** - Armazenamento de arquivos

## Arquitetura

```
┌─────────────────────┐
│  Electron App       │ (Interface gráfica)
└──────────┬──────────┘
           │ HTTP
┌─────────────────────┐
│  PocketBase Server  │ (Backend)
│  ├── REST API       │
│  ├── SQLite DB      │
│  └── Admin Panel    │
└─────────────────────┘
```

## Estrutura de Dados

### Coleção: `estabelecimentos`
Armazena dados dos estabelecimentos/empresas.

```javascript
{
  id: "abc123...",
  razao_social: "Empresa XYZ",
  cnpj: "12.345.678/0001-90",
  email: "contato@empresa.com",
  telefone: "(11) 98765-4321",
  contador_email: "contador@empresa.com",
  contato_responsavel: "João Silva",
  ativo: true,
  observacoes: "Notas sobre a empresa",
  created: "2024-01-15T10:30:00.000Z",
  updated: "2024-01-15T10:30:00.000Z"
}
```

### Coleção: `smtp_config`
Configurações de email para cada estabelecimento.

```javascript
{
  id: "def456...",
  estabelecimento: "abc123...", // Relação com estabelecimentos
  servico: "gmail",
  email_usuario: "seu-email@gmail.com",
  senha_app: "xxxx xxxx xxxx xxxx",
  host_smtp: "smtp.gmail.com",
  porta_smtp: 587,
  usar_tls: true,
  testado: true,
  ativo: true,
  created: "2024-01-15T10:30:00.000Z",
  updated: "2024-01-15T10:30:00.000Z"
}
```

### Coleção: `email_logs`
Histórico de emails enviados.

```javascript
{
  id: "ghi789...",
  estabelecimento: "abc123...",
  destinatario: "contador@empresa.com",
  assunto: "[Empresa XYZ] Arquivos Fiscais - 2024-01",
  arquivo: "2024-01.zip",
  status: "enviado", // enviado | erro | pendente
  data_envio: "2024-01-15T14:45:00.000Z",
  erro_mensagem: null,
  created: "2024-01-15T14:45:00.000Z",
  updated: "2024-01-15T14:45:00.000Z"
}
```

### Coleção: `xml_files`
Rastreamento de arquivos XML processados.

```javascript
{
  id: "jkl012...",
  estabelecimento: "abc123...",
  nome_arquivo: "NF123456789.xml",
  tipo: "nfe", // nfe | cte | mdfe | nfse
  data_criacao: "2024-01-15T10:00:00.000Z",
  processado: true,
  data_processamento: "2024-01-15T14:00:00.000Z",
  created: "2024-01-15T10:00:00.000Z",
  updated: "2024-01-15T14:00:00.000Z"
}
```

## Usando o Serviço PocketBase

### Conectar ao PocketBase

```javascript
const pocketbaseService = require('../services/pocketbaseService');

// Conectar
await pocketbaseService.connect();

// Autenticar como admin
await pocketbaseService.authenticateAdmin(
  process.env.POCKETBASE_ADMIN_EMAIL,
  process.env.POCKETBASE_ADMIN_PASSWORD
);
```

### Operações de Estabelecimento

```javascript
// Criar
const est = await pocketbaseService.saveEstabelecimento({
  razao_social: "Minha Empresa",
  cnpj: "12.345.678/0001-90",
  email: "contato@empresa.com",
  contador_email: "contador@empresa.com"
});

// Obter por ID
const estabelecimento = await pocketbaseService.getEstabelecimento('abc123...');

// Listar todos
const lista = await pocketbaseService.listEstabelecimentos();
```

### Configuração SMTP

```javascript
// Salvar configuração
const config = await pocketbaseService.saveSmtpConfig({
  estabelecimento: 'abc123...',
  servico: 'gmail',
  email_usuario: 'seu-email@gmail.com',
  senha_app: 'xxxx xxxx xxxx xxxx',
  usar_tls: true,
  ativo: true
});

// Obter configuração
const smtp = await pocketbaseService.getSmtpConfig();
```

### Registrar Emails

```javascript
// Registrar envio
const log = await pocketbaseService.logEmailSent({
  estabelecimento: 'abc123...',
  destinatario: 'contador@empresa.com',
  assunto: '[Empresa] Arquivos Fiscais',
  arquivo: '2024-01.zip',
  status: 'enviado'
});

// Obter histórico
const historico = await pocketbaseService.getEmailHistory({
  estabelecimento: 'abc123...',
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```

### Estatísticas

```javascript
const stats = await pocketbaseService.getStatistics();
console.log(stats);
// {
//   totalEstabelecimentos: 5,
//   totalEmails: 150,
//   emailsEnviados: 145,
//   emailsErro: 5,
//   totalXmls: 1250
// }
```

## Painel Admin

Acesse em: `http://127.0.0.1:8090/_/`

### Funcionalidades
- ✅ Gerenciar coleções
- ✅ Visualizar registros
- ✅ Adicionar/editar/deletar dados
- ✅ Configurar permissões
- ✅ Backups
- ✅ Importar/exportar dados

## API REST

PocketBase gera automaticamente uma API REST. Exemplos:

```bash
# Listar estabelecimentos
curl http://127.0.0.1:8090/api/collections/estabelecimentos/records

# Criar estabelecimento
curl -X POST http://127.0.0.1:8090/api/collections/estabelecimentos/records \
  -H "Content-Type: application/json" \
  -d '{"razao_social":"Empresa","cnpj":"12.345.678/0001-90",...}'

# Obter um registro
curl http://127.0.0.1:8090/api/collections/estabelecimentos/records/abc123

# Atualizar
curl -X PATCH http://127.0.0.1:8090/api/collections/estabelecimentos/records/abc123 \
  -H "Content-Type: application/json" \
  -d '{"ativo":false}'

# Deletar
curl -X DELETE http://127.0.0.1:8090/api/collections/estabelecimentos/records/abc123
```

## Segurança

### Credenciais Admin
- Mude a senha padrão no painel
- Use `.env` para armazenar credenciais
- Nunca commite `.env` no Git

### Permissões de Coleção
Configure no painel admin para:
- Quem pode criar
- Quem pode atualizar
- Quem pode deletar
- Quem pode listar

### SSL/TLS em Produção
```bash
# Usar certificado
pocketbase serve --http=0.0.0.0:443 --https=cert.pem --https_key=key.pem
```

## Backup e Restauração

### Backup manual
```bash
cp -r pb/pb_data pb/pb_data.backup
```

### Backup automático (script)
```bash
# scripts/backup-pocketbase.sh
#!/bin/bash
BACKUP_DIR="./backups/pocketbase"
mkdir -p $BACKUP_DIR
cp -r pb/pb_data $BACKUP_DIR/pb_data_$(date +%Y%m%d_%H%M%S)
```

### Restaurar
```bash
cp -r pb/pb_data.backup pb/pb_data
```

## Troubleshooting

### Erro: "Failed to connect"
```bash
# Verificar se PocketBase está rodando
ps aux | grep pocketbase

# Verificar porta
lsof -i :8090
```

### Erro: "Admin authentication failed"
- Verificar credenciais em `.env`
- Resetar admin password no painel

### Erro: "Collection not found"
- Verificar se coleção foi criada no painel
- Rodar script de inicialização: `node scripts/initialize-pocketbase.js`

### Banco de dados corrompido
```bash
# Fazer backup do antigo
mv pb/pb_data pb/pb_data.corrupted

# Recriar
pocketbase serve --dir ./pb
```

## Performance

### Indexação
Configure índices no painel para campos frequentemente consultados:
- `estabelecimento` em email_logs
- `cnpj` em estabelecimentos

### Queries com Filtro
```javascript
// PocketBase suporta filtros avançados
const records = await pb.collection('email_logs').getFullList({
  filter: 'status="enviado" && data_envio>="2024-01-01"',
  sort: '-data_envio',
  pageSize: 50
});
```

## Recursos Adicionais

- [PocketBase Documentação Oficial](https://pocketbase.io/)
- [SDKs em outras linguagens](https://pocketbase.io/docs/sdk-setup/)
- [GitHub PocketBase](https://github.com/pocketbase/pocketbase)
- [Comunidade Discuss](https://github.com/pocketbase/pocketbase/discussions)
