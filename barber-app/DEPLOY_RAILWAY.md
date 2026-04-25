# 🚂 Deploy no Railway - Barber App API

## 🎯 Por que Railway?

✅ **Suporta Java nativamente** (sem Docker!)
✅ **Mais fácil que Render**
✅ **Deploy automático**
✅ **$5 grátis todo mês**
✅ **Sem cold start**

---

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Código no GitHub (já está!)
- ✅ Supabase configurado (já está!)

---

## 🚀 PASSO 1: Criar Conta no Railway

### 1️⃣ Acessar Railway

1. Acesse: https://railway.app
2. Clique em **Login**
3. Escolha **Login with GitHub**
4. Autorize o Railway

### 2️⃣ Verificar Conta

1. Você ganha **$5 de crédito grátis todo mês**
2. Suficiente para hospedar sua API!

---

## 🚂 PASSO 2: Criar Novo Projeto

### 1️⃣ Criar Projeto

1. No Dashboard, clique em **New Project**
2. Escolha **Deploy from GitHub repo**
3. Se aparecer "Configure GitHub App":
   - Clique em **Configure GitHub App**
   - Autorize o Railway
   - Selecione **All repositories** ou apenas `barber-app-api`
   - Clique em **Install & Authorize**

### 2️⃣ Selecionar Repositório

1. Encontre: `barber-app-api`
2. Clique no repositório

### 3️⃣ Configurar Deploy

Railway vai detectar automaticamente que é um projeto Maven!

**Configurações automáticas:**
- ✅ Detecta Java
- ✅ Detecta Maven
- ✅ Configura build automaticamente

---

## ⚙️ PASSO 3: Configurar Variáveis de Ambiente

### 1️⃣ Adicionar Variáveis

1. No projeto, clique na aba **Variables**
2. Clique em **+ New Variable**
3. Adicione cada variável:

```
DATABASE_URL
jdbc:postgresql://aws-1-sa-east-1.pooler.supabase.com:6543/postgres

DATABASE_USERNAME
postgres.kmocrclrctgipgudthfd

DATABASE_PASSWORD
9y0N0fiOnvVWOwVd

JWT_SECRET
barber-app-secret-key-production-2024-railway

JWT_EXPIRATION
86400000

MAVEN_OPTS
-Xmx512m

PORT
8080
```

### 2️⃣ Configurar Root Directory

Se o Railway não detectar automaticamente:

1. Vá em **Settings**
2. Em **Root Directory**, coloque: `barber-app`
3. Clique em **Save**

---

## 🔧 PASSO 4: Configurar Build

### 1️⃣ Verificar Configurações

1. Clique em **Settings**
2. Role até **Build**
3. Verifique:

**Build Command:**
```
mvn clean package -DskipTests
```

**Start Command:**
```
java -Dserver.port=$PORT -jar target/barber-app-1.0.0.jar
```

Se não estiver configurado, adicione manualmente.

### 2️⃣ Configurar Java Version

Em **Settings** → **Environment**:

Adicione variável:
```
JAVA_VERSION
21
```

---

## 🚀 PASSO 5: Deploy

### 1️⃣ Iniciar Deploy

1. O Railway vai iniciar o deploy automaticamente
2. Ou clique em **Deploy** (botão no topo)

### 2️⃣ Acompanhar Build

1. Clique em **Deployments**
2. Clique no deploy em andamento
3. Veja os logs em tempo real

**Você verá:**
```
Building...
Downloading dependencies...
Compiling...
Building JAR...
Starting application...
Started BarberApplication in X.XXX seconds
```

### 3️⃣ Aguardar

- ⏱️ Tempo: 3-5 minutos
- ✅ Quando aparecer "Success", está pronto!

---

## 🌐 PASSO 6: Obter URL da API

### 1️⃣ Gerar Domínio Público

1. Vá em **Settings**
2. Role até **Networking**
3. Clique em **Generate Domain**
4. Railway vai gerar uma URL tipo:
   ```
   https://barber-app-api-production.up.railway.app
   ```

### 2️⃣ Sua API está em:

```
https://SEU-DOMINIO.up.railway.app/api
```

---

## ✅ PASSO 7: Testar a API

### 1️⃣ Testar no Navegador

**Swagger UI:**
```
https://SEU-DOMINIO.up.railway.app/api/swagger-ui.html
```

**Listar Barbearias:**
```
https://SEU-DOMINIO.up.railway.app/api/barbershops
```

### 2️⃣ Testar Login

```bash
curl -X POST https://SEU-DOMINIO.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@barberapp.com",
    "password": "admin123"
  }'
```

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

---

## 📱 PASSO 8: Atualizar Flutter

### 1️⃣ Abrir api_service.dart

```
mobile-flutter/lib/services/api_service.dart
```

### 2️⃣ Atualizar URL

```dart
static const String baseUrl = 'https://SEU-DOMINIO.up.railway.app/api';
```

### 3️⃣ Testar

```bash
cd mobile-flutter
flutter run
```

---

## 🔄 Atualizações Futuras

### Deploy Automático

✅ **Já está configurado!**

Sempre que você fizer push no GitHub:
```bash
cd barber-app
git add .
git commit -m "Atualização"
git push origin main
```

O Railway faz deploy automático! 🚀

---

## 💰 Custos

### Créditos Grátis

- **$5/mês grátis** para sempre
- Suficiente para:
  - 1 API pequena/média
  - ~500 horas de execução
  - Tráfego moderado

### Uso Estimado

Para o Barber App:
- **~$3-4/mês** (dentro do grátis!)
- Se ultrapassar, paga apenas o excedente

### Monitorar Uso

1. No Railway, clique em **Usage**
2. Veja quanto já usou do crédito
3. Recebe alertas se estiver acabando

---

## 📊 Monitoramento

### Logs em Tempo Real

1. Clique em **Deployments**
2. Clique no deploy ativo
3. Veja logs do Spring Boot

### Métricas

1. Clique em **Metrics**
2. Veja:
   - CPU
   - Memória
   - Network

### Restart

Se precisar reiniciar:
1. Clique nos 3 pontinhos
2. **Restart**

---

## 🔧 Configurações Avançadas

### Custom Domain

1. Vá em **Settings** → **Networking**
2. Clique em **Custom Domain**
3. Adicione: `api.seudominio.com`
4. Configure DNS:
   - Tipo: `CNAME`
   - Nome: `api`
   - Valor: `SEU-DOMINIO.up.railway.app`

### HTTPS

✅ **Já está configurado!**
- SSL automático
- Renovação automática

### Variáveis de Ambiente

Para adicionar/editar:
1. Clique em **Variables**
2. Adicione ou edite
3. Deploy automático após salvar

---

## 🐛 Troubleshooting

### ❌ Build Falhou

**Erro:** `Build failed`

**Soluções:**
1. Verifique os logs
2. Certifique-se que `pom.xml` está correto
3. Verifique Root Directory: `barber-app`
4. Verifique Java Version: `21`

### ❌ API Não Inicia

**Erro:** `Application failed to start`

**Soluções:**
1. Verifique variáveis de ambiente (todas as 7)
2. Verifique conexão com Supabase
3. Veja os logs para erro específico

### ❌ Erro de Porta

**Erro:** `Port already in use`

**Solução:**
Certifique-se que tem a variável `PORT=8080`

### ❌ Erro de Memória

**Erro:** `Out of memory`

**Solução:**
Adicione variável:
```
MAVEN_OPTS=-Xmx512m
```

### ❌ Créditos Acabaram

**Solução:**
1. Adicione cartão de crédito
2. Ou otimize uso
3. Ou use outro serviço

---

## 🆚 Railway vs Render

| Recurso | Railway | Render |
|---------|---------|--------|
| **Java Nativo** | ✅ Sim | ❌ Não |
| **Docker** | Opcional | Obrigatório |
| **Setup** | Mais fácil | Mais complexo |
| **Free Tier** | $5/mês | 750h/mês |
| **Cold Start** | ❌ Não | ✅ Sim (Free) |
| **Deploy** | Automático | Automático |
| **Logs** | ✅ Excelente | ✅ Bom |

**Railway é melhor para Java!** ⭐

---

## 📋 Checklist Final

- [ ] Conta no Railway criada
- [ ] Projeto criado
- [ ] Repositório conectado
- [ ] 7 variáveis de ambiente adicionadas
- [ ] Root Directory configurado: `barber-app`
- [ ] Build Command configurado
- [ ] Start Command configurado
- [ ] Deploy realizado com sucesso
- [ ] Domínio gerado
- [ ] API testada (Swagger)
- [ ] Login testado
- [ ] Flutter atualizado
- [ ] App mobile testado

---

## 🎉 Conclusão

Sua API está no ar no Railway! 🚂🚀

**Vantagens:**
- ✅ Sem Docker
- ✅ Java nativo
- ✅ Mais fácil
- ✅ Mais rápido
- ✅ $5 grátis/mês

**URLs Importantes:**
- **Dashboard:** https://railway.app/dashboard
- **API:** `https://SEU-DOMINIO.up.railway.app/api`
- **Swagger:** `https://SEU-DOMINIO.up.railway.app/api/swagger-ui.html`

---

## 📞 Suporte

**Documentação:**
- Railway: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

**Problemas?**
- Verifique os logs
- Consulte Troubleshooting
- Pergunte no Discord do Railway

---

**Parabéns! Deploy no Railway concluído! 🎉🚂**
