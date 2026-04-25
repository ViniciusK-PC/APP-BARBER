# 🚀 Guia Completo de Deploy - Barber App API

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Preparar Banco de Dados](#preparar-banco-de-dados)
3. [Preparar GitHub](#preparar-github)
4. [Deploy no Render](#deploy-no-render)
5. [Testar API](#testar-api)
6. [Atualizar Flutter](#atualizar-flutter)
7. [Troubleshooting](#troubleshooting)

---

## 📋 Pré-requisitos

### ✅ Você precisa ter:

1. **Conta no GitHub** (grátis)
   - Acesse: https://github.com/signup

2. **Conta no Render** (grátis)
   - Acesse: https://render.com/register

3. **Git instalado** no seu computador
   - Windows: https://git-scm.com/download/win
   - Ou use GitHub Desktop: https://desktop.github.com/

4. **Supabase configurado** (já está!)
   - ✅ Banco de dados criado
   - ✅ Credenciais disponíveis

---

## 🗄️ PASSO 1: Preparar Banco de Dados

### 1️⃣ Executar Script SQL no Supabase

1. Acesse: https://supabase.com
2. Faça login
3. Selecione seu projeto
4. No menu lateral, clique em **SQL Editor**
5. Clique em **New Query**
6. Copie todo o conteúdo do arquivo: `barber-app/database/init.sql`
7. Cole no editor
8. Clique em **Run** ou pressione `Ctrl + Enter`

**Resultado esperado:**
```
✅ Tabelas criadas
✅ Índices criados
✅ Dados de exemplo inseridos
```

### 2️⃣ Verificar Tabelas

No Supabase, vá em **Table Editor** e verifique se existem:
- ✅ users
- ✅ barbershops
- ✅ barbers
- ✅ services
- ✅ appointments

---

## 📦 PASSO 2: Preparar GitHub

### 1️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `barber-app-api`
   - **Description:** `API REST para aplicativo de barbearia com Spring Boot`
   - **Visibility:** Public ou Private (sua escolha)
   - ❌ **NÃO** marque "Add a README file"
   - ❌ **NÃO** adicione .gitignore
   - ❌ **NÃO** escolha licença
3. Clique em **Create repository**

### 2️⃣ Fazer Push do Código

**Opção A: Usando Terminal/CMD**

Abra o terminal na pasta raiz do projeto e execute:

```bash
# Entrar na pasta da API
cd barber-app

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit - Barber App API com Docker"

# Renomear branch para main
git branch -M main

# Adicionar repositório remoto (SUBSTITUA SEU_USUARIO!)
git remote add origin https://github.com/SEU_USUARIO/barber-app-api.git

# Fazer push
git push -u origin main
```

**⚠️ IMPORTANTE:** Substitua `SEU_USUARIO` pelo seu usuário do GitHub!

**Opção B: Usando GitHub Desktop**

1. Abra GitHub Desktop
2. File → Add Local Repository
3. Escolha a pasta `barber-app`
4. Commit to main
5. Publish repository

### 3️⃣ Verificar no GitHub

Acesse: `https://github.com/SEU_USUARIO/barber-app-api`

Você deve ver:
- ✅ Dockerfile
- ✅ pom.xml
- ✅ src/
- ✅ database/
- ✅ Todos os arquivos

---

## 🌐 PASSO 3: Deploy no Render

### 1️⃣ Criar Conta no Render

1. Acesse: https://render.com
2. Clique em **Get Started for Free**
3. Escolha **Sign up with GitHub**
4. Autorize o Render a acessar seus repositórios

### 2️⃣ Criar Web Service

1. No Dashboard do Render, clique em **New +** (canto superior direito)
2. Escolha **Web Service**
3. Na lista de repositórios, encontre: `barber-app-api`
4. Clique em **Connect**

### 3️⃣ Configurar o Web Service

Preencha os campos:

#### **Configurações Básicas:**

| Campo | Valor |
|-------|-------|
| **Name** | `barber-app-api` (ou outro nome único) |
| **Region** | `Oregon (US West)` (ou mais próximo de você) |
| **Branch** | `main` |
| **Root Directory** | `barber-app` ⚠️ IMPORTANTE! |
| **Environment** | **Docker** ⭐ SELECIONE DOCKER! |

#### **Instance Type:**

Escolha um plano:

- **Free** (Grátis)
  - ✅ Bom para testes
  - ⚠️ API "dorme" após 15 min sem uso
  - ⚠️ Cold start de ~30 segundos

- **Starter** ($7/mês) - Recomendado
  - ✅ Sempre ativa
  - ✅ Sem cold start
  - ✅ Melhor para produção

### 4️⃣ Configurar Variáveis de Ambiente

Role para baixo até **Environment Variables**

Clique em **Add Environment Variable** e adicione:

```
DATABASE_URL
jdbc:postgresql://aws-1-sa-east-1.pooler.supabase.com:6543/postgres

DATABASE_USERNAME
postgres.kmocrclrctgipgudthfd

DATABASE_PASSWORD
9y0N0fiOnvVWOwVd

JWT_SECRET
barber-app-secret-key-production-2024-render

JWT_EXPIRATION
86400000
```

**Como adicionar:**
1. Clique em **Add Environment Variable**
2. **Key:** `DATABASE_URL`
3. **Value:** `jdbc:postgresql://aws-1-sa-east-1.pooler.supabase.com:6543/postgres`
4. Repita para cada variável

### 5️⃣ Criar Web Service

1. Revise todas as configurações
2. Clique em **Create Web Service** (no final da página)

### 6️⃣ Aguardar Deploy

O Render vai:
1. ✅ Clonar seu repositório
2. ✅ Detectar o Dockerfile
3. ✅ Fazer build da imagem Docker (~5-8 minutos)
4. ✅ Iniciar o container
5. ✅ Sua API estará **Live**!

**Acompanhe os logs em tempo real:**
- Você verá o progresso do build
- Mensagens de compilação do Maven
- Inicialização do Spring Boot

**Quando ver:**
```
Started BarberApplication in X.XXX seconds
```
**Sua API está no ar! 🎉**

---

## ✅ PASSO 4: Testar a API

### 1️⃣ Obter URL da API

No Render, você verá a URL no topo:
```
https://barber-app-api.onrender.com
```

Sua API estará em:
```
https://barber-app-api.onrender.com/api
```

### 2️⃣ Testar no Navegador

**Swagger UI (Documentação Interativa):**
```
https://barber-app-api.onrender.com/api/swagger-ui.html
```

**Listar Barbearias:**
```
https://barber-app-api.onrender.com/api/barbershops
```

Deve retornar JSON com as barbearias!

### 3️⃣ Testar Login

**Usando cURL (Terminal):**

```bash
curl -X POST https://barber-app-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@barberapp.com",
    "password": "admin123"
  }'
```

**Usando Swagger:**
1. Acesse o Swagger UI
2. Vá em **auth-controller**
3. Clique em **POST /auth/login**
4. Clique em **Try it out**
5. Preencha:
```json
{
  "email": "admin@barberapp.com",
  "password": "admin123"
}
```
6. Clique em **Execute**

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Administrador",
    "email": "admin@barberapp.com",
    "role": "admin"
  }
}
```

### 4️⃣ Testar Outros Endpoints

**Listar Barbeiros:**
```
GET https://barber-app-api.onrender.com/api/barbers
```

**Listar Serviços:**
```
GET https://barber-app-api.onrender.com/api/services
```

**Criar Agendamento (precisa de token):**
```
POST https://barber-app-api.onrender.com/api/appointments
Header: Authorization: Bearer {seu-token}
```

---

## 📱 PASSO 5: Atualizar Flutter

### 1️⃣ Abrir Projeto Flutter

Abra o arquivo:
```
mobile-flutter/lib/services/api_service.dart
```

### 2️⃣ Atualizar URL Base

**Encontre a linha:**
```dart
static const String baseUrl = 'https://app-barber-jlna.onrender.com/api';
```

**Substitua por:**
```dart
static const String baseUrl = 'https://barber-app-api.onrender.com/api';
```

**⚠️ IMPORTANTE:** Use a URL que o Render gerou para você!

### 3️⃣ Salvar e Testar

1. Salve o arquivo
2. Execute o app Flutter:
```bash
cd mobile-flutter
flutter run
```

3. Teste:
   - ✅ Login
   - ✅ Listar barbearias
   - ✅ Criar agendamento
   - ✅ Ver meus agendamentos

---

## 🔄 PASSO 6: Atualizações Futuras

### Fazer Alterações na API

1. **Edite o código** localmente
2. **Commit e push:**

```bash
cd barber-app
git add .
git commit -m "Descrição da alteração"
git push origin main
```

3. **Deploy automático!**
   - O Render detecta o push
   - Faz build automaticamente
   - Atualiza a API
   - Sem downtime!

### Acompanhar Deploy

No Render:
1. Vá em **Events**
2. Veja o progresso do deploy
3. Quando aparecer **Live**, está atualizado!

---

## 🐛 Troubleshooting

### ❌ Build Falhou

**Erro:** `Failed to build`

**Soluções:**
1. Verifique os logs no Render
2. Certifique-se que o `Dockerfile` está na pasta `barber-app`
3. Verifique se o `pom.xml` está correto
4. Tente fazer build local:
```bash
cd barber-app
docker build -t barber-app .
```

### ❌ API Não Inicia

**Erro:** `Application failed to start`

**Soluções:**
1. Verifique as variáveis de ambiente no Render
2. Confirme que todas as 5 variáveis estão configuradas
3. Verifique os logs para ver o erro específico
4. Teste conexão com Supabase

### ❌ Erro de Conexão com Banco

**Erro:** `Connection refused` ou `Unable to connect`

**Soluções:**
1. Verifique se o Supabase está online
2. Confirme as credenciais do banco
3. Teste a conexão no Supabase Dashboard
4. Verifique se o IP do Render está permitido (Supabase permite todos por padrão)

### ❌ Cold Start Lento (Free Tier)

**Problema:** Primeiro request demora 30+ segundos

**Soluções:**
1. **Upgrade para Starter** ($7/mês) - API sempre ativa
2. **Ou:** Use um serviço de "keep-alive":
   - Cron-job.org
   - UptimeRobot
   - Ping a cada 10 minutos

### ❌ Erro 404 no Flutter

**Problema:** Flutter não encontra a API

**Soluções:**
1. Verifique se a URL está correta no `api_service.dart`
2. Certifique-se de incluir `/api` no final
3. Teste a URL no navegador primeiro
4. Verifique se a API está **Live** no Render

### ❌ Erro de CORS

**Problema:** `CORS policy blocked`

**Solução:**
A API já está configurada para aceitar todas as origens.
Se ainda tiver problema, verifique `SecurityConfig.java`

---

## 📊 Monitoramento

### No Dashboard do Render

Você pode ver:
- ✅ **Status:** Live, Building, Failed
- ✅ **Logs:** Em tempo real
- ✅ **Metrics:** CPU, Memória, Requests
- ✅ **Events:** Histórico de deploys

### Logs em Tempo Real

1. No Render, clique em **Logs**
2. Veja os logs do Spring Boot
3. Útil para debug

### Métricas

1. Clique em **Metrics**
2. Veja:
   - Requests por minuto
   - Tempo de resposta
   - Uso de memória
   - Uso de CPU

---

## ⚙️ Configurações Avançadas

### Custom Domain

**Adicionar seu próprio domínio:**

1. No Render, vá em **Settings**
2. Clique em **Custom Domain**
3. Adicione: `api.seudominio.com`
4. Configure DNS:
   - Tipo: `CNAME`
   - Nome: `api`
   - Valor: `barber-app-api.onrender.com`
5. Aguarde propagação (até 24h)

### HTTPS

✅ **Já está configurado!**
- Render fornece SSL grátis
- Renovação automática
- Seu domínio customizado também terá HTTPS

### Auto-Deploy

✅ **Já está ativado!**
- Cada push no GitHub = deploy automático
- Sem configuração adicional

### Health Checks

O Render verifica automaticamente:
```
GET /api/barbershops
```

Se retornar 200, a API está saudável!

---

## 💰 Custos

### Free Tier
- **Custo:** R$ 0,00
- **Horas:** 750h/mês
- **Limitações:**
  - API dorme após 15 min
  - Cold start de ~30s
  - 512 MB RAM

### Starter
- **Custo:** $7/mês (~R$ 35)
- **Vantagens:**
  - Sempre ativa
  - Sem cold start
  - 512 MB RAM
  - CPU dedicada

### Recomendação

- **Desenvolvimento/Testes:** Free
- **Produção:** Starter

---

## 🎉 Conclusão

Sua API está no ar! 🚀

**Checklist Final:**

- ✅ Banco de dados configurado (Supabase)
- ✅ Código no GitHub
- ✅ Deploy no Render
- ✅ API funcionando
- ✅ Flutter atualizado
- ✅ Testes realizados

**URLs Importantes:**

- **API:** `https://barber-app-api.onrender.com/api`
- **Swagger:** `https://barber-app-api.onrender.com/api/swagger-ui.html`
- **GitHub:** `https://github.com/SEU_USUARIO/barber-app-api`
- **Render:** `https://dashboard.render.com`

---

## 📞 Suporte

**Documentação:**
- Render: https://render.com/docs
- Spring Boot: https://spring.io/guides
- Docker: https://docs.docker.com

**Problemas?**
- Verifique os logs no Render
- Consulte a seção Troubleshooting
- Teste localmente com Docker

---

**Parabéns! Sua API está em produção! 🎉💈**
