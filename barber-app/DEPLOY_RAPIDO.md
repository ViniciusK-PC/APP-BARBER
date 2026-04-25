# 🚀 Deploy Rápido no Render

## 📋 Checklist Rápido

- [ ] Código no GitHub
- [ ] Conta no Render
- [ ] Supabase configurado

---

## ⚡ 3 Passos Rápidos

### 1️⃣ GitHub (5 minutos)

```bash
cd barber-app
git init
git add .
git commit -m "Deploy inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/barber-app-api.git
git push -u origin main
```

### 2️⃣ Render (2 minutos)

1. Acesse: https://render.com
2. Login com GitHub
3. **New +** → **Web Service**
4. Conecte: `barber-app-api`
5. Configure:
   - **Root Directory:** `barber-app`
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -Dserver.port=$PORT -jar target/barber-app-1.0.0.jar`

### 3️⃣ Variáveis de Ambiente

Adicione no Render:

```
DATABASE_URL=jdbc:postgresql://aws-1-sa-east-1.pooler.supabase.com:6543/postgres
DATABASE_USERNAME=postgres.kmocrclrctgipgudthfd
DATABASE_PASSWORD=9y0N0fiOnvVWOwVd
JWT_SECRET=barber-app-secret-key-production-2024
JAVA_VERSION=21
```

**Clique em:** Create Web Service

---

## ✅ Pronto!

Aguarde 5-10 minutos e sua API estará no ar!

**URL:** `https://barber-app-api.onrender.com/api`

**Swagger:** `https://barber-app-api.onrender.com/api/swagger-ui.html`

---

## 📱 Atualizar Flutter

```dart
// mobile-flutter/lib/services/api_service.dart
static const String baseUrl = 'https://barber-app-api.onrender.com/api';
```

---

**Guia completo:** `barber-app/DEPLOY_RENDER.md`
