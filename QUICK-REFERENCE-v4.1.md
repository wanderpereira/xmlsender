# 📋 Referência Rápida v4.1.0

## ⚡ Comando Mais Básico

```bash
node scripts/organize-xmls.js
```

Resultado: XMLs organizados em `xmls_organized/` por mês.

---

## 📚 Todos os Comandos

| Comando | Resultado |
|---------|-----------|
| `node scripts/organize-xmls.js` | Copiar, por mês (padrão) |
| `--move` | Mover em vez de copiar |
| `--period month` | Agrupar por mês (padrão) |
| `--period day` | Agrupar por dia |
| `--period week` | Agrupar por semana |
| `--period year` | Agrupar por ano |
| `--source /path` | Usar origem customizada |
| `--dest /path` | Usar destino customizado |
| `--pocketbase` | Registrar no PocketBase |
| `--help` ou `-h` | Mostrar ajuda |

---

## 🎯 Exemplos Rápidos

### Organizar (padrão)
```bash
node scripts/organize-xmls.js
```

### Por dia
```bash
node scripts/organize-xmls.js -p day
```

### Por semana
```bash
node scripts/organize-xmls.js -p week
```

### Mover (não copiar)
```bash
node scripts/organize-xmls.js -m
```

### Mover + PocketBase
```bash
node scripts/organize-xmls.js -m --pb
```

### Origem e destino custom
```bash
node scripts/organize-xmls.js -s /mnt/fiscal -d /backup/xmls
```

### Combinar: dia + mover + PocketBase
```bash
node scripts/organize-xmls.js -p day -m --pb
```

### Com log salvo
```bash
node scripts/organize-xmls.js > log.txt 2>&1
```

---

## 📁 Estruturas de Saída

### Por Mês (padrão)
```
2024/01 - Janeiro/
2024/02 - Fevereiro/
2023/12 - Dezembro/
```

### Por Dia
```
2024/01 - Janeiro/01 - Domingo/
2024/01 - Janeiro/02 - Segunda/
2024/01 - Janeiro/03 - Terça/
```

### Por Semana
```
2024/Semana 01/
2024/Semana 02/
2024/Semana 53/
```

### Por Ano
```
2024/
2023/
2022/
```

---

## 🔍 Verificar Resultado

```bash
# Listar pasta resultado
ls xmls_organized/

# Contar arquivos
find xmls_organized -name "*.xml" | wc -l

# Ver estrutura
tree xmls_organized/

# Ver relatório
cat xmls_organized/relatorio.json | python -m json.tool
```

---

## 🐛 Erros Comuns

| Erro | Solução |
|------|---------|
| Cannot find module 'xml2js' | `npm install xml2js` |
| Directory not found | `mkdir -p xmls` |
| 0 arquivos organizados | Verificar se XMLs estão em `./xmls` |
| Arquivo não movido | Verificar permissões de arquivo |

---

## 📊 O Script Faz:

1. ✅ Lê cada arquivo XML
2. ✅ Procura tag `<dhEmi>` (data emissão)
3. ✅ Extrai data (ex: 2024-01-15)
4. ✅ Cria pasta destino (ex: 2024/01 - Janeiro/)
5. ✅ Copia ou move arquivo
6. ✅ Gera relatório JSON

---

## 📝 Arquivos Novos

| Arquivo | Propósito |
|---------|-----------|
| `src/utils/xmlDateParser.js` | Extrair datas XML |
| `src/controllers/xmlOrganizer.js` | Organizar arquivos |
| `scripts/organize-xmls.js` | CLI principal |
| `docs/XML-ORGANIZER.md` | Documentação detalhada |
| `SCRIPTS.md` | Referência de scripts |
| `QUICK-START-v4.1.md` | Guia rápido |
| `README-v4.1.md` | Resumo v4.1 |

---

## 🔗 Consultar

| Preciso saber... | Ver arquivo |
|------------------|-------------|
| Como usar organize-xmls.js | [SCRIPTS.md](SCRIPTS.md) |
| API detalhada | [docs/XML-ORGANIZER.md](docs/XML-ORGANIZER.md) |
| Guia rápido | [QUICK-START-v4.1.md](QUICK-START-v4.1.md) |
| Histórico versões | [docs/CHANGELOG.md](docs/CHANGELOG.md) |
| PocketBase setup | [docs/POCKETBASE.md](docs/POCKETBASE.md) |

---

## ✨ Próximas Versões

- **v4.2**: Interface web
- **v5.0**: Aplicativo móvel
- **v6.0**: Sincronização cloud

---

## 🆘 Suporte

```bash
# Ver ajuda
node scripts/organize-xmls.js --help

# Ver logs detalhados
npm start  # (abre aplicação com logs)

# Checar instalação
npm list   # (mostra dependências)
```

---

**Lembrete**: A v4.1.0 é retrocompatível com v4.0.0 e v3.9.0!
