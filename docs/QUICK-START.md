# 🚀 Quick Start - PocketBase

Guia rápido para colocar PocketBase em funcionamento em 5 minutos!

## Passo 1: Preparar ambiente (1 min)

```bash
cd xmlsender
npm install
cp .env.example .env
```

Edite `.env`:
```env
POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=sua-senha-segura
```

## Passo 2: Iniciar PocketBase (1 min)

**Terminal 1:**
```bash
npm run pocketbase
```

Você verá algo como:
```
Server running at: http://127.0.0.1:8090
Admin dashboard: http://127.0.0.1:8090/_/
```

## Passo 3: Configurar banco de dados (1 min)

Abra no navegador: **http://127.0.0.1:8090/_/**

1. Faça login com as credenciais do `.env`
2. Clique em "New collection" e crie:
   - `estabelecimentos`
   - `smtp_config`
   - `email_logs`
   - `xml_files`

Ou rode o script (automático):
```bash
node scripts/initialize-pocketbase.js
```

## Passo 4: Adicionar dados de teste (1 min)

No painel admin, crie um estabelecimento:
- **razao_social**: Minha Empresa Teste
- **cnpj**: 12.345.678/0001-90
- **email**: empresa@example.com
- **contador_email**: contador@example.com

## Passo 5: Iniciar aplicação (1 min)

**Terminal 2:**
```bash
npm start
```

## ✅ Pronto!

Você agora tem:
- ✅ PocketBase rodando em http://127.0.0.1:8090
- ✅ Painel admin em http://127.0.0.1:8090/_/
- ✅ Aplicação Electron rodando
- ✅ Banco de dados pronto para uso

## 📝 Próximos Passos

1. **Configurar SMTP** - Adicione configurações de email no painel
2. **Adicionar estabelecimentos** - Cadastre suas empresas
3. **Enviar emails** - Use a aplicação para enviar arquivos

## 🔧 Troubleshooting Rápido

### Porta 8090 já está em uso?
```bash
lsof -i :8090
# Se ocupada, mude em .env:
POCKETBASE_URL=http://127.0.0.1:8091
```

### Erro de autenticação?
- Verifique `.env` - POCKETBASE_ADMIN_EMAIL e PASSWORD
- Resetar admin no painel

### PocketBase não inicia?
```bash
# Verificar Node.js
node --version  # deve ser 14+

# Tentar com novo diretório
pocketbase serve --dir ./pb_new
```

## 📚 Mais Recursos

- [SETUP.md](../SETUP.md) - Guia completo
- [docs/POCKETBASE.md](../docs/POCKETBASE.md) - Documentação técnica
- [PocketBase.io](https://pocketbase.io/) - Docs oficiais

## 💡 Dicas

**Verificar logs:**
```bash
tail -f data/logs/app-$(date +%Y-%m-%d).log
```

**Backup de dados:**
```bash
cp -r pb/pb_data pb/pb_data.backup
```

**Acessar API direto:**
```bash
curl http://127.0.0.1:8090/api/collections/estabelecimentos/records
```

---

**Dúvidas?** Abra uma issue no GitHub ou consulte a documentação completa!
