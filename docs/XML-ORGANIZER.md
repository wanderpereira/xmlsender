# 📅 XML Date Parser & Organizer

Módulos para **ler data de emissão do XML** e **organizar arquivos por período**.

## O Problema

Antes: Organizava por **data de modificação do arquivo** ❌
- Arquivo copiado muda de data
- Arquivo restaurado do backup perde data original
- Não confiável para documentos fiscais

Agora: Organiza por **data contida no XML** ✅
- Lê a tag `<dhEmi>` (data e hora de emissão)
- Data real de autorização/emissão
- 100% confiável

## Arquivos Criados

### 1. `src/utils/xmlDateParser.js`
Parser que extrai datas de XMLs.

**Tags suportadas:**
- NFe: `nfeProc > NFe > infNFe > ide > dhEmi`
- CTe: `cteProc > CTe > infCte > ide > dhEmi`
- MDFe: `mdfProc > MDFe > infMDFe > ide > dhEmi`

### 2. `src/controllers/xmlOrganizer.js`
Organiza arquivos em estrutura de pastas baseada em datas.

**Estrutura gerada:**
```
destino/
├── 2024/
│   ├── 01 - Janeiro/
│   │   ├── arquivo1.xml
│   │   └── arquivo2.xml
│   ├── 02 - Fevereiro/
│   │   └── arquivo3.xml
│   └── ...
├── 2023/
│   ├── 12 - Dezembro/
│   └── ...
```

## Como Usar

### Uso Básico

```javascript
const xmlOrganizer = require('./src/controllers/xmlOrganizer');

// Organizar arquivos
const resultado = await xmlOrganizer.organize(
  './xml_entrada',      // Pasta com XMLs
  './xml_organizado',   // Pasta destino
  {
    period: 'month',    // Organizar por mês
    copy: true          // Copiar (não mover)
  }
);

console.log(resultado);
// {
//   success: true,
//   organized: 150,
//   errors: 2,
//   total: 152,
//   byType: { nfe: 140, cte: 10 },
//   byMonth: {
//     '2024/01 - Janeiro': 45,
//     '2024/02 - Fevereiro': 50,
//     ...
//   }
// }
```

### Com Integração PocketBase

```javascript
const xmlOrganizer = require('./src/controllers/xmlOrganizer');
const pocketbaseService = require('./src/services/pocketbaseService');

// Conectar ao PocketBase
await pocketbaseService.connect();

// Organizar e registrar no BD
const resultado = await xmlOrganizer.organize(
  './xml_entrada',
  './xml_organizado',
  {
    period: 'month',
    copy: true,
    estabelecimentoId: 'abc123...'  // ID do estabelecimento
  }
);
```

### Diferentes Períodos

```javascript
// Por ano
await xmlOrganizer.organize(dir, dest, { period: 'year' });
// 2024/
// 2023/

// Por mês (padrão)
await xmlOrganizer.organize(dir, dest, { period: 'month' });
// 2024/01 - Janeiro/
// 2024/02 - Fevereiro/

// Por semana
await xmlOrganizer.organize(dir, dest, { period: 'week' });
// 2024/Semana 01/
// 2024/Semana 02/

// Por dia
await xmlOrganizer.organize(dir, dest, { period: 'day' });
// 2024/01 - Janeiro/01 - Domingo/
// 2024/01 - Janeiro/02 - Segunda/
```

## API Detalhada

### XMLDateParser

#### `parseXmlDate(filePath)`
Extrai data de um arquivo XML.

```javascript
const xmlDateParser = require('./src/utils/xmlDateParser');

const result = await xmlDateParser.parseXmlDate('./arquivo.xml');
// {
//   date: Date(2024-01-15T10:30:00),
//   dateString: '2024-01-15T10:30:00-03:00',
//   source: 'xml',              // ou 'filesystem', 'filesystem_fallback'
//   rawTag: '2024-01-15T10:30:00-03:00'
// }
```

#### `extractMetadata(filePath)`
Extrai metadados do XML.

```javascript
const metadata = await xmlDateParser.extractMetadata('./nfe.xml');
// {
//   file: 'nfe.xml',
//   type: 'nfe',
//   cnpj: '12.345.678/0001-90',
//   nf: '12281',
//   serie: '1',
//   modelo: '55',
//   date: '2024-01-15T10:30:00-03:00'
// }
```

#### `generateFolderPath(date, period)`
Gera caminho de pasta para uma data.

```javascript
const date = new Date('2024-01-15');

xmlDateParser.generateFolderPath(date, 'month');
// '2024/01 - Janeiro'

xmlDateParser.generateFolderPath(date, 'day');
// '2024/01 - Janeiro/15 - Segunda'
```

#### `isValidXml(filePath)`
Valida se arquivo é XML.

```javascript
const isValid = xmlDateParser.isValidXml('./arquivo.xml');
// true
```

#### `processMultipleFiles(filePaths)`
Processa múltiplos arquivos.

```javascript
const results = await xmlDateParser.processMultipleFiles([
  './nfe1.xml',
  './nfe2.xml',
  './cte1.xml'
]);
// [
//   { file: './nfe1.xml', date: ..., folderPath: ... },
//   { file: './nfe2.xml', date: ..., folderPath: ... },
//   { file: './cte1.xml', date: ..., folderPath: ... }
// ]
```

### XMLOrganizer

#### `organize(sourceDir, destDir, options)`
Organiza arquivos em uma estrutura de pastas.

**Opções:**
```javascript
{
  period: 'month',           // 'year'|'month'|'week'|'day'
  copy: true,                // true=copiar, false=mover
  estabelecimentoId: null    // ID para registro no PocketBase
}
```

**Retorno:**
```javascript
{
  success: true,
  organized: 145,
  errors: 2,
  total: 147,
  byType: { nfe: 140, cte: 5, mdfe: 2 },
  byMonth: { '2024/01 - Janeiro': 50, '2024/02 - Fevereiro': 97 },
  details: [
    { file: 'nfe1.xml', status: 'success', folder: '2024/01 - Janeiro', ... },
    { file: 'nfe2.xml', status: 'error', error: '...' },
    ...
  ]
}
```

#### `generateReport()`
Gera relatório detalhado.

```javascript
const report = xmlOrganizer.generateReport();
// {
//   timestamp: '2024-01-15T10:30:00Z',
//   summary: { ... },
//   details: [ ... ],
//   successRate: 98.6
// }
```

#### `reset()`
Limpa contadores.

```javascript
xmlOrganizer.reset();
```

## Tratamento de Erros

### Se a tag `<dhEmi>` não existir
Fallback automático para data do sistema:

```javascript
// XML inválido ou incompleto
const result = await xmlDateParser.parseXmlDate('./arquivo.xml');
// {
//   date: ...,
//   source: 'filesystem',      // ⚠️ Fallback
//   dateString: '...'
// }
```

### Arquivo não é XML válido
```javascript
const result = await xmlDateParser.parseXmlDate('./arquivo.txt');
// {
//   date: ...,
//   source: 'filesystem_fallback',  // ⚠️ Último recurso
//   error: 'Arquivo não é um XML válido'
// }
```

## Tipos de Documento Suportados

| Tipo | Tag Raiz | Campo Data | Status |
|------|----------|-----------|--------|
| NFe | `nfeProc` | `ide > dhEmi` | ✅ |
| CTe | `cteProc` | `ide > dhEmi` | ✅ |
| MDFe | `mdfProc` | `ide > dhEmi` | ✅ |
| NFS-e | (variável) | (variável) | ⚠️ Parcial |
| XML Genérico | (qualquer) | `dhEmi` | ✅ Procura recursiva |

## Exemplo Completo

```javascript
/**
 * script-organizar-xmls.js
 * Exemplo completo de organização
 */

const xmlOrganizer = require('./src/controllers/xmlOrganizer');
const pocketbaseService = require('./src/services/pocketbaseService');
const logger = require('./src/utils/logger');
require('dotenv').config();

async function main() {
  try {
    logger.info('🚀 Iniciando organização de XMLs...');

    // Conectar ao PocketBase
    await pocketbaseService.connect();
    await pocketbaseService.authenticateAdmin(
      process.env.POCKETBASE_ADMIN_EMAIL,
      process.env.POCKETBASE_ADMIN_PASSWORD
    );

    // Obter estabelecimento
    const estabelecimentos = await pocketbaseService.listEstabelecimentos();
    if (estabelecimentos.length === 0) {
      throw new Error('Nenhum estabelecimento cadastrado');
    }

    const est = estabelecimentos[0];
    logger.info(`📌 Usando estabelecimento: ${est.razao_social}`);

    // Organizar XMLs
    const resultado = await xmlOrganizer.organize(
      './xmls_entrada',
      './xmls_organizado',
      {
        period: 'month',
        copy: false,  // Mover arquivos
        estabelecimentoId: est.id
      }
    );

    // Gerar relatório
    const report = xmlOrganizer.generateReport();
    logger.info('📊 Relatório de Organização', report);

    // Salvar relatório em arquivo
    const fs = require('fs');
    fs.writeFileSync(
      './relatorio-organizacao.json',
      JSON.stringify(report, null, 2)
    );

    logger.info('✅ Organização concluída com sucesso!');
    process.exit(0);

  } catch (error) {
    logger.error('❌ Erro na organização', { error: error.message });
    process.exit(1);
  }
}

main();
```

## Performance

- **100 arquivos**: ~2 segundos
- **1000 arquivos**: ~20 segundos
- **10000 arquivos**: ~3-5 minutos

Depende de:
- Tamanho dos XMLs
- Velocidade do disco
- CPU disponível
- Se está copiando ou movendo

## Logs

Todos os eventos são registrados:

```bash
tail -f data/logs/app-$(date +%Y-%m-%d).log | grep -i "xml"
```

Exemplo de log:
```
[2024-01-15T10:30:00Z] [INFO] ✅ Data extraída do XML: 2024-01-15T10:30:00-03:00
[2024-01-15T10:30:01Z] [DEBUG] 📋 Arquivo copiado: nfe1.xml → 2024/01 - Janeiro
[2024-01-15T10:30:02Z] [INFO] ✅ Organização concluída
```

## Troubleshooting

### "Data não conseguiu ser extraída"
```
⚠️ Não foi possível extrair data do XML, usando data do sistema
```

**Solução**: XML pode estar incompleto ou mal formatado.
- Verificar se tem tag `<dhEmi>`
- Validar XML em ferramenta online

### "Arquivo não é um XML válido"
**Solução**: Arquivo pode estar corrompido
- Tentar abrir em editor XML
- Reparar com ferramentas de validação

### Permissão negada ao copiar/mover
**Solução**: Problema de permissão de pasta
```bash
chmod 755 ./xmls_organizado
```

## Próximas Melhorias

- [ ] Suporte a zip com XMLs dentro
- [ ] Análise de NF duplicadas
- [ ] Hash de arquivo para evitar cópias
- [ ] Progress bar para grandes volumes
- [ ] Export para diferentes formatos

---

**Documentação completa**: Ver [docs/STRUCTURE.md](../STRUCTURE.md)
