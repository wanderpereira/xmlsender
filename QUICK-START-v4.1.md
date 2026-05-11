# 🚀 Guia Rápido - Organizador de XMLs (v4.1.0)

> 5 minutos para começar a organizar XMLs por data

## ⚡ Início Rápido (2 minutos)

### 1️⃣ Instalar Dependência
```bash
npm install
# Já inclui xml2js ^0.6.2 no package.json
```

### 2️⃣ Preparar Diretório
```bash
# Coloque seus XMLs aqui
mkdir -p xmls
cp seus_arquivos_xml/*.xml xmls/
```

### 3️⃣ Executar Organizador
```bash
# Copiar XMLs em pastas por mês (padrão)
node scripts/organize-xmls.js

# Resultado em: ./xmls_organized/
```

## 📂 Estrutura de Saída

### Padrão: por Mês
```bash
node scripts/organize-xmls.js
```
Resultado:
```
xmls_organized/
├── 2024/
│   ├── 01 - Janeiro/
│   │   ├── nfe1.xml
│   │   └── nfe2.xml
│   ├── 02 - Fevereiro/
│   │   └── nfe3.xml
│   └── ...
└── 2023/
    └── 12 - Dezembro/
        └── nfe4.xml
```

### Alternativa: por Dia
```bash
node scripts/organize-xmls.js --period day
```
Resultado:
```
xmls_organized/
├── 2024/
│   ├── 01 - Janeiro/
│   │   ├── 15 - Domingo/
│   │   │   └── nfe1.xml
│   │   ├── 16 - Segunda/
│   │   │   └── nfe2.xml
│   │   └── ...
```

### Alternativa: por Semana
```bash
node scripts/organize-xmls.js --period week
```

### Alternativa: por Ano
```bash
node scripts/organize-xmls.js --period year
```

## 🔧 Opções Principais

### ✅ Copiar (padrão)
```bash
# Mantém originais, cria cópias organizadas
node scripts/organize-xmls.js
```

### ✂️ Mover
```bash
# Move originais para nova estrutura
node scripts/organize-xmls.js --move
```

### 📍 Caminhos Personalizados
```bash
# Origem → Destino customizado
node scripts/organize-xmls.js \
  --source /mnt/fiscal/xmls \
  --dest /backup/xmls_fiscal
```

### 💾 Com PocketBase (opcional)
```bash
# Registra informações no banco de dados
node scripts/organize-xmls.js --pocketbase
```

## 📊 Resultado do Script

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
  • nfe2.xml → 2024/02 - Fevereiro
  • ...

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

ℹ️  Relatório salvo em: ./xmls_organized/relatorio.json
```

## 🎯 Casos de Uso Comuns

### Caso 1: Organizar NFe da empresa
```bash
# Simples, sem PocketBase
node scripts/organize-xmls.js \
  --source ./nfe_janeiro \
  --dest ./nfe_organizado
```

### Caso 2: Reorganizar arquivos permanentemente
```bash
# Move files, não copia
node scripts/organize-xmls.js --move --pocketbase
```

### Caso 3: Múltiplos diretórios (script de lote)
```bash
#!/bin/bash
for cliente in ./clientes/*/xmls; do
  node scripts/organize-xmls.js \
    --source "$cliente" \
    --dest "./processado/$(basename $(dirname $cliente))" \
    --period month
done
```

### Caso 4: Agendado automaticamente (Cron - Linux)
```bash
# Editar: crontab -e
0 2 * * * cd /home/user/xmlsender && node scripts/organize-xmls.js --pocketbase >> cron.log
```

### Caso 5: Agendado automaticamente (Cron - macOS)
```bash
# Mesmo que Linux, coloque em: ~/Library/LaunchAgents/
# Ou use: crontab -e
```

## 🔍 O que Acontece Nos Bastidores?

### 1. Leitura de Arquivo
O script lê cada XML e procura a tag `<dhEmi>`:

```xml
<nfeProc>
  <NFe>
    <infNFe>
      <ide>
        <dhEmi>2024-01-15T14:30:00-03:00</dhEmi>
        ↑ Esta data é usada para organizar!
```

### 2. Extração de Data
```
Arquivo: nfe_12345.xml
Tag encontrada: 2024-01-15T14:30:00-03:00
Data extraída: 2024-01-15 (15 de Janeiro de 2024)
Pasta destino: 2024/01 - Janeiro/
```

### 3. Cópia ou Movimentação
```
COPIAR: ./xmls/nfe_12345.xml → ./xmls_organized/2024/01 - Janeiro/nfe_12345.xml
        Original mantém-se intacto

OU

MOVER: ./xmls/nfe_12345.xml → ./xmls_organized/2024/01 - Janeiro/nfe_12345.xml
       Original é removido
```

## 🛠️ Troubleshooting Rápido

### ❌ "Cannot find module 'xml2js'"
```bash
npm install xml2js@^0.6.2
```

### ❌ "xmls directory not found"
```bash
# Criar diretório
mkdir -p xmls
# Copiar arquivos
cp /caminho/seus/*.xml xmls/
```

### ❌ "0 arquivo(s) organizado(s)"
- Verificar se XMLs estão realmente em `./xmls`
- Verificar se possuem tag `<dhEmi>`
- Usar: `node scripts/organize-xmls.js -h` para ver opções

### ⚠️ Todos os arquivos ficaram com erro?
- Talvez não seja XML válido
- Verificar se começa com `<?xml` ou `<`
- Testar um arquivo manualmente:
  ```bash
  head -n 5 xmls/seu_arquivo.xml
  ```

## 📝 Relatório JSON

Após execução, verifique `./xmls_organized/relatorio.json`:

```bash
cat xmls_organized/relatorio.json | python -m json.tool
```

Exemplo de relatório:
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
      "mdfe": 2
    },
    "byMonth": {
      "2024/01 - Janeiro": 75,
      "2024/02 - Fevereiro": 52
    }
  },
  "successRate": 98.7
}
```

## 🎓 Exemplos Avançados

### Organizar com log detalhado
```bash
node scripts/organize-xmls.js --period month 2>&1 | tee resultado.log
```

### Organizar e contar resultados
```bash
node scripts/organize-xmls.js && \
find ./xmls_organized -name "*.xml" -type f | wc -l
```

### Verificar tipos de arquivos organizados
```bash
find ./xmls_organized -name "*.xml" -type f | \
  xargs grep -h "<nfeProc\|<cteProc\|<mdfProc" | \
  grep -o "<[a-z]*Proc" | sort | uniq -c
```

## 📚 Próximos Passos

1. **Básico**: `node scripts/organize-xmls.js`
2. **Com PocketBase**: Veja [docs/POCKETBASE.md](../docs/POCKETBASE.md)
3. **Documentação completa**: Veja [docs/XML-ORGANIZER.md](../docs/XML-ORGANIZER.md)
4. **Programação**: Veja [src/utils/xmlDateParser.js](../src/utils/xmlDateParser.js)

## 🔗 Referências Rápidas

- **Scripts**: Ver [SCRIPTS.md](../SCRIPTS.md)
- **API**: Ver [docs/XML-ORGANIZER.md](../docs/XML-ORGANIZER.md)
- **PocketBase**: Ver [docs/POCKETBASE.md](../docs/POCKETBASE.md)
- **Changelog**: Ver [docs/CHANGELOG.md](../docs/CHANGELOG.md)

---

✅ Pronto! Agora execute: `node scripts/organize-xmls.js`
