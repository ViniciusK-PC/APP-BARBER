# 🚀 Deploy no Render - Barber App API (Docker)

## 📋 Pré-requisitos

1. ✅ Conta no GitHub
2. ✅ Conta no Render (https://render.com)
3. ✅ Código no GitHub

---

## 🔧 PASSO 1: Preparar o Repositório GitHub

### 1️⃣ Criar repositório no GitHub

1. Acesse: https://github.com/new
2. Nome: `barber-app-api`
3. Descrição: `API REST para aplicativo de barbearia`
4. Público ou Privado (sua escolha)
5. Clique em **Create repository**

### 2️⃣ Fazer push do código

Abra o terminal na pasta do projeto e execute:

```bash
cd barber-app
git init
git add .
git commit -m "Initial commit - Barber App API"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/barber-app-api.git
git push -u origin main
```

**Substitua `SEU_USUARIO` pelo seu usuário do GitHub!**

---

## 🐳 PASSO 2: Deploy no Render com Docker

### 1️⃣ Criar conta no Render

1. Acesse: https://render.com
2. Clique em **Get Started**
3. Faça login com GitHub

### 2️⃣ Criar novo Web Service

1. No Dashboard do Render, clique em **New +**
2. Escolha **Web Service**
3. Conecte seu repositório GitHub: `barber-app-api`
4. Clique em **Connect**

### 3️⃣ Configurar o Web Service

**Configurações básicas:**

| Campo | Valor |
|-------|-------|
| **Name** | `barber-app-api` |
| **Region** | `Oregon (US West)` ou mais próximo |
| **Branch** | `main` |
| **Root Directory** | `barber-app` |
| **Environment** | **Docker** ⭐ |

**IMPORTANTE:** Selecione **Docker** no campo Environment!

**Instance Type:**
- Escolha: **Free** (para teste)
- Ou: **Starter** ($7/mês - recomendado para produção)

### 4️⃣ Configurar Variáveis de Ambiente

Na seção **Environment Variables**, adicione:

```
DATABASE_URL=jdbc:postgresql://aws-1-sa-east-1.pooler.supabase.com:6543/postgres
DATABASE_USERNAME=postgres.kmocrclrctgipgudthfd
DATABASE_PASSWORD=9y0N0fiOnvVWOwVd
JWT_SECRET=barber-app-secret-key-production-2024-render
JWT_EXPIRATION=86400000
```

### 5️⃣ Deploy

1. Clique em **Create Web Service**
2. Aguarde o build (5-10 minutos)
3. O Render vai:
   - Detectar o `Dockerfile`
   - Fazer build da imagem Docker
   - Iniciar o container
4. Quando aparecer **Live**, está pronto! 🎉

---

## 🔗 PASSO 3: Testar a API

Sua API estará disponível em:
```
https://barber-app-api.onrender.com/api
```

### Testar endpoints:

**Swagger UI:**
```
https://barber-app-api.onrender.com/api/swagger-ui.html
```

**Listar barbearias:**
```
https://barber-app-api.onrender.com/api/barbershops
```

**Login:**
```bash
curl -X POST https://barber-app-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@barberapp.com",
    "password": "admin123"
  }'
```

---

## 📱 PASSO 4: Atualizar Flutter

Atualize a URL no Flutter:

**Arquivo:** `mobile-flutter/lib/services/api_service.dart`

```dart
static const String baseUrl = 'https://barber-app-api.onrender.com/api';
```

---

## 🔄 PASSO 5: Atualizações Futuras

Sempre que fizer alterações:

```bash
cd barber-app
git add .
git commit -m "Descrição da alteração"
git push origin main
```

O Render vai fazer deploy automático! 🚀

---

## 🐳 Sobre o Docker

### Vantagens:
✅ Funciona em qualquer ambiente
✅ Build consistente
✅ Isolamento completo
✅ Fácil de escalar

### O que o Dockerfile faz:
1. **Stage 1 (Build):**
   - Usa Maven + Java 21
   - Compila o projeto
   - Gera o JAR

2. **Stage 2 (Runtime):**
   - Usa apenas JRE (mais leve)
   - Copia o JAR compilado
   - Configura porta dinâmica
   - Inicia a aplicação

### Tamanho da imagem:
- **Build:** ~800 MB (temporário)
- **Final:** ~200 MB (otimizado)

---

## ⚙️ Configurações Avançadas

### Auto-Deploy

✅ Já está ativado por padrão!
- Cada push no GitHub = deploy automático

### Custom Domain

1. No Render, vá em **Settings**
2. Clique em **Custom Domain**
3. Adicione seu domínio: `api.seudominio.com`
4. Configure DNS conforme instruções

### Health Check

O Render verifica automaticamente:
```
GET /api/barbershops
```

Se retornar 200, a API está saudável!

---

## 🐛 Troubleshooting

### ❌ Build falhou

**Solução:**
1. Verifique os logs no Render
2. Certifique-se que `Dockerfile` está na pasta `barber-app`
3. Verifique se `pom.xml` está correto

### ❌ API não inicia

**Solução:**
1. Verifique variáveis de ambiente
2. Verifique conexão com Supabase
3. Veja os logs: **Logs** no menu do Render

### ❌ Erro de conexão com banco

**Solução:**
1. Verifique se o Supabase está acessível
2. Confirme as credenciais
3. Teste a conexão no Supabase Dashboard

### ❌ Porta incorreta

**Solução:**
O Render usa a variável `$PORT` automaticamente.
O Dockerfile já está configurado para isso!

---

## 💰 Custos

### Free Tier (Grátis)
- ✅ 750 horas/mês
- ⚠️ API "dorme" após 15 min de inatividade
- ⚠️ Primeiro request pode demorar 30s (cold start)

### Starter ($7/mês)
- ✅ Sempre ativo
- ✅ Sem cold start
- ✅ Melhor performance
- ✅ Recomendado para produção

---

## 📊 Monitoramento

No Dashboard do Render você pode ver:
- ✅ Status da API
- ✅ Logs em tempo real
- ✅ Uso de recursos
- ✅ Histórico de deploys
- ✅ Métricas do container

---

## 🎉 Pronto!

Sua API está no ar com Docker! 🐳🚀

**URL da API:** `https://barber-app-api.onrender.com/api`

**Próximos passos:**
1. ✅ Testar todos os endpoints
2. ✅ Atualizar Flutter com nova URL
3. ✅ Testar app mobile com API em produção
4. ✅ Configurar domínio customizado (opcional)

---

**Dúvidas?** Consulte: https://render.com/docs/docker

