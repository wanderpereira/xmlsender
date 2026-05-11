# 🔧 Scripts - XML Sender

Utilitários de linha de comando para gerenciar XML Sender.

## 📑 Scripts Disponíveis

### 1. `organize-xmls.js` ⭐ NOVO - Organizar XMLs por Data

Organiza arquivos XML em estrutura de pastas baseada na data de emissão (tag `<dhEmi>`).

#### Uso Básico
```bash
node scripts/organize-xmls.js
```

#### Opções
```
-s, --source <dir>     Diretório de origem (padrão: ./xmls)
-d, --dest <dir>       Diretório de destino (padrão: ./xmls_organized)
-p, --period <period>  Período: year|month|week|day (padrão: month)
-m, --move             Mover arquivos em vez de copiar
--pb, --pocketbase     Registrar no PocketBase
-h, --help             Mostrar ajuda
```

#### Exemplos

**1. Organizar por mês (padrão)**
```bash
node scripts/organize-xmls.js
# Resultado:
# xmls_organized/
# ├── 2024/
# │   ├── 01 - Janeiro/
# │   │   └── nfe1.xml
# │   ├── 02 - Fevereiro/
# │   │   └── nfe2.xml
```

**2. Organizar por dia**
```bash
node scripts/organize-xmls.js --period day
# Resultado:
# xmls_organized/
# ├── 2024/
# │   ├── 01 - Janeiro/
# │   │   ├── 01 - Domingo/
# │   │   │   └── nfe1.xml
# │   │   └── 02 - Segunda/
# │   │       └── nfe2.xml
```

**3. Mover (não copiar) para outro diretório**
```bash
node scripts/organize-xmls.js \
  --source ./downloads/xmls \
  --dest /mnt/storage/xmls_fiscal \
  --move
```

**4. Registrar no PocketBase**
```bash
node scripts/organize-xmls.js \
  --source ./xmls \
  --dest ./organized \
  --pocketbase
```

**5. Combinação: Por semana, movendo, com PocketBase**
```bash
node scripts/organize-xmls.js \
  -p week \
  -m \
  --pocketbase
```

#### Saída do Script

```
══════════════════════════════════════════════════════════════
🚀 Organizador de XMLs - v4.1.0
══════════════════════════════════════════════════════════════

📁 Origem:      ./xmls
📁 Destino:     ./xmls_organized
📅 Período:     month
📋 Ação:        Copiar

ℹ️  Contando arquivos...
ℹ️  150 arquivo(s) XML encontrado(s)

Amostra de datas encontradas:
  • nfe1.xml → 2024/01 - Janeiro
  • nfe2.xml → 2024/01 - Janeiro
  • cte1.xml → 2024/02 - Fevereiro
  • nfe3.xml → 2023/12 - Dezembro
  • mdfe1.xml → 2024/01 - Janeiro

ℹ️  Iniciando organização...

══════════════════════════════════════════════════════════════
📊 Resultados
══════════════════════════════════════════════════════════════

✅ 148 arquivo(s) organizado(s) com sucesso
⚠️  2 arquivo(s) com erro

Resumo por tipo:
  • NFE: 140
  • CTE: 5
  • MDFE: 2
  • OUTROS: 1

Resumo por período:
  • 2024/01 - Janeiro: 75
  • 2024/02 - Fevereiro: 52
  • 2023/12 - Dezembro: 21

Estatísticas:
  Taxa de sucesso: 98.7%

Erros encontrados:
  • arquivo_corrompido.xml: Arquivo não é um XML válido
  • arquivo_vazio.xml: Arquivo vazio

ℹ️  Relatório salvo em: ./xmls_organized/relatorio.json

══════════════════════════════════════════════════════════════
✅ Processo Concluído!
══════════════════════════════════════════════════════════════

ℹ️  Arquivos organizados em: ./xmls_organized
```

#### Relatório Gerado

Um arquivo `relatorio.json` é salvo no diretório de destino:

```json
{
  "timestamp": "2024-01-16T10:30:00Z",
  "summary": {
    "organized": 148,
    "errors": 2,
    "total": 150,
    "byType": {
      "nfe": 140,
      "cte": 5,
      "mdfe": 2,
      "outro": 1
    },
    "byMonth": {
      "2024/01 - Janeiro": 75,
      "2024/02 - Fevereiro": 52,
      "2023/12 - Dezembro": 21
    }
  },
  "details": [...],
  "successRate": 98.7
}
```

---

### 2. `initialize-pocketbase.js` - Setup Banco de Dados

Cria as coleções necessárias no PocketBase automaticamente.

#### Uso
```bash
node scripts/initialize-pocketbase.js
```

**Pré-requisitos:**
- PocketBase rodando em `http://127.0.0.1:8090`
- Variáveis de ambiente configuradas em `.env`

**Resultado:**
```
ℹ️  Conectando ao PocketBase...
✅ Autenticado com sucesso
📦 Criando coleções...
✅ Coleção 'estabelecimentos' criada com sucesso
✅ Coleção 'smtp_config' criada com sucesso
✅ Coleção 'email_logs' criada com sucesso
✅ Coleção 'xml_files' criada com sucesso
🎉 Inicialização concluída!
```

---

### 3. `migrate-to-pocketbase.js` - Migrar Dados v3→v4

Migra dados antigos (JSON) para PocketBase.

#### Uso
```bash
node scripts/migrate-to-pocketbase.js
```

**Pré-requisitos:**
- PocketBase rodando
- Arquivos JSON em `src/database/package-*.json`

**Resultado:**
```
ℹ️  Conectando ao PocketBase...
✅ Autenticado com sucesso
📦 Migrando dados de estabelecimentos...
✅ Estabelecimento migrado com ID: abc123...
📧 Migrando configurações SMTP...
✅ Configuração SMTP migrada com ID: def456...
🎉 Migração concluída com sucesso!
⚠️  Importante: Agora use o painel admin do PocketBase para gerenciar dados
```

---

### 4. `verify-setup.js` - Verificar Configuração

Verifica se tudo está configurado corretamente.

#### Uso
```bash
node scripts/verify-setup.js
```

**Resultado (sucesso):**
```
✅ main.js
✅ package.json
✅ preload.js
✅ .env.example
✅ .gitignore
...
🎉 Tudo está configurado corretamente!

Próximos passos:
1. Inicie PocketBase:      npm run pocketbase
2. Em outro terminal:      npm start
3. Acesse painel admin:    http://127.0.0.1:8090/_/
```

**Resultado (com erros):**
```
❌ Erro: src/services/pocketbaseService.js - NÃO ENCONTRADO
❌ Erro: node_modules não encontrado

Execute: npm install
```

---

## 🚀 Workflow Típico

### Primeiro Uso

```bash
# 1. Instalar dependências
npm install

# 2. Copiar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# 3. Verificar setup
node scripts/verify-setup.js

# 4. Iniciar PocketBase (terminal 1)
npm run pocketbase

# 5. Inicializar banco de dados
node scripts/initialize-pocketbase.js

# 6. Iniciar aplicação (terminal 2)
npm start
```

### Processar XMLs

```bash
# Terminal 1: PocketBase
npm run pocketbase

# Terminal 2: Organizar XMLs
node scripts/organize-xmls.js \
  --source ./xmls_entrada \
  --dest ./xmls_organizado \
  --pocketbase \
  --period month

# Terminal 3: Enviar emails
npm start
```

### Migrar de Versão Anterior

```bash
# Se vinha de v3.x
npm install
cp .env.example .env
# Editar .env
npm run pocketbase
node scripts/migrate-to-pocketbase.js
npm start
```

---

## 📊 Casos de Uso Avançados

### Organizar por Período Mensal com Relatório

```bash
node scripts/organize-xmls.js \
  --source /mnt/fiscal/xmls \
  --dest ./xml_organizado \
  --period month \
  --pocketbase > organizacao_$(date +%Y%m%d).log
```

### Batch Processing (múltiplos diretórios)

```bash
#!/bin/bash
for dir in /mnt/fiscal/*/xmls; do
  node scripts/organize-xmls.js \
    --source "$dir" \
    --dest "./processed/$(basename $(dirname $dir))" \
    --period month \
    --pocketbase
done
```

### Agendado via Cron (Linux)

```bash
# Organizar XMLs todo dia às 2 da manhã
0 2 * * * cd /home/user/xmlsender && node scripts/organize-xmls.js --pocketbase >> cron.log
```

### Agendado via Task Scheduler (Windows)

```powershell
# Criar tarefa agendada
$action = New-ScheduledTaskAction -Execute "node" -Argument "scripts/organize-xmls.js --pocketbase" -WorkingDirectory "C:\xmlsender"
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "XML Organizer" -Description "Organiza XMLs diariamente"
```

---

## 🛠️ Troubleshooting

### Erro: "Cannot find module 'xml2js'"
```bash
npm install xml2js@^0.6.2
```

### Erro: "ENOENT: no such file or directory"
- Verificar se caminho de origem existe
- Usar caminhos absolutos

### Erro: "PocketBase not responding"
```bash
# Verificar se está rodando
lsof -i :8090

# Ou iniciar manualmente
npm run pocketbase
```

### Arquivo não organizado (erro silencioso)
```bash
# Verificar logs
tail -f data/logs/app-$(date +%Y-%m-%d).log
```

---

## 📝 Melhorias Futuras

- [ ] Interface web para organização
- [ ] Agendamento automático
- [ ] Sincronização com cloud
- [ ] Integração com sistemas ERP

---

**Documentação completa**: Ver [docs/](../docs/)
