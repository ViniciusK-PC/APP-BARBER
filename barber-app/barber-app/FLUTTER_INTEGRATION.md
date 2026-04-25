# 📱 Integração Flutter - Barber App

## 🔗 Como Conectar o Flutter com a API

### 1️⃣ Atualizar a URL Base no Flutter

Abra o arquivo: `mobile-flutter/lib/services/api_service.dart`

**Altere de:**
```dart
static const String baseUrl = 'https://app-barber-jlna.onrender.com/api';
```

**Para (desenvolvimento local):**
```dart
static const String baseUrl = 'http://localhost:8080/api';
```

**Ou para Android Emulator:**
```dart
static const String baseUrl = 'http://10.0.2.2:8080/api';
```

**Ou para dispositivo físico (use seu IP local):**
```dart
static const String baseUrl = 'http://192.168.1.XXX:8080/api';
```

---

## 🚀 Passo a Passo Completo

### 1. Iniciar a API Spring Boot

```bash
cd barber-app
mvn spring-boot:run
```

Aguarde a mensagem:
```
Started BarberApplication in X.XXX seconds
```

### 2. Verificar se a API está rodando

Abra no navegador:
```
http://localhost:8080/api/swagger-ui.html
```

### 3. Executar o Script SQL no Supabase

1. Acesse: https://supabase.com
2. Vá em SQL Editor
3. Cole o conteúdo de `barber-app/database/init.sql`
4. Execute

### 4. Atualizar o Flutter

Edite `mobile-flutter/lib/services/api_service.dart`:

```dart
static const String baseUrl = 'http://10.0.2.2:8080/api'; // Android Emulator
// ou
static const String baseUrl = 'http://localhost:8080/api'; // iOS Simulator
```

### 5. Executar o Flutter

```bash
cd mobile-flutter
flutter run
```

---

## 🧪 Testar a Integração

### Teste 1: Login
1. Abra o app Flutter
2. Vá para tela de Login
3. Use as credenciais:
   - Email: `joao@email.com`
   - Senha: `cliente123`
4. Deve fazer login com sucesso

### Teste 2: Listar Barbearias
1. Após login, vá para Home
2. Deve listar as 3 barbearias:
   - Barbearia Clássica
   - Modern Barber Shop
   - Barber Kings

### Teste 3: Ver Detalhes
1. Clique em uma barbearia
2. Deve mostrar:
   - Barbeiros
   - Serviços
   - Horários

### Teste 4: Criar Agendamento
1. Selecione um barbeiro
2. Selecione um serviço
3. Escolha data e hora
4. Confirme
5. Deve criar o agendamento

### Teste 5: Ver Meus Agendamentos
1. Vá para tela de Agendamentos
2. Deve listar seus agendamentos
3. Deve mostrar status (pending, confirmed, etc.)

---

## 🔧 Configurações de Rede

### Android Emulator
```dart
// 10.0.2.2 é o localhost da máquina host
static const String baseUrl = 'http://10.0.2.2:8080/api';
```

### iOS Simulator
```dart
// localhost funciona diretamente
static const String baseUrl = 'http://localhost:8080/api';
```

### Dispositivo Físico (mesma rede Wi-Fi)

1. Descubra seu IP local:

**Windows:**
```bash
ipconfig
# Procure por "IPv4 Address"
```

**Mac/Linux:**
```bash
ifconfig
# Procure por "inet"
```

2. Use o IP no Flutter:
```dart
static const String baseUrl = 'http://192.168.1.100:8080/api';
```

3. Certifique-se que o firewall permite conexões na porta 8080

---

## 🐛 Troubleshooting

### Erro: "Connection refused"

**Causa:** API não está rodando ou URL incorreta

**Solução:**
1. Verifique se a API está rodando: `http://localhost:8080/api/swagger-ui.html`
2. Use a URL correta para seu ambiente (emulator/simulator/device)

---

### Erro: "Network error" no Android

**Causa:** Android não permite HTTP por padrão (apenas HTTPS)

**Solução:** Adicione no `AndroidManifest.xml`:

```xml
<application
    android:usesCleartextTraffic="true"
    ...>
```

Arquivo: `mobile-flutter/android/app/src/main/AndroidManifest.xml`

---

### Erro: "Unauthorized" (401)

**Causa:** Token JWT inválido ou expirado

**Solução:**
1. Faça logout no app
2. Faça login novamente
3. Token será renovado

---

### Erro: "CORS policy"

**Causa:** Problema de CORS (não deve acontecer, já está configurado)

**Solução:** Verifique `SecurityConfig.java`:
```java
configuration.setAllowedOrigins(List.of("*"));
```

---

## 📊 Endpoints Usados pelo Flutter

### Autenticação
- ✅ `POST /auth/login` - Login
- ✅ `POST /auth/register` - Registro

### Barbearias
- ✅ `GET /barbershops` - Listar
- ✅ `GET /barbershops/{id}` - Detalhes

### Barbeiros
- ✅ `GET /barbers?barbershopId=xxx` - Listar por barbearia

### Serviços
- ✅ `GET /services?barbershopId=xxx` - Listar por barbearia

### Agendamentos
- ✅ `GET /appointments` - Meus agendamentos
- ✅ `POST /appointments` - Criar
- ✅ `PUT /appointments/{id}/status` - Atualizar status

### Admin (se usuário for admin)
- ✅ `GET /appointments/admin/stats` - Estatísticas
- ✅ `GET /appointments/admin/all` - Todos agendamentos

---

## 🔐 Fluxo de Autenticação

```
1. Usuário faz login no Flutter
   ↓
2. Flutter envia POST /auth/login
   ↓
3. API valida credenciais
   ↓
4. API retorna token JWT
   ↓
5. Flutter salva token (SharedPreferences)
   ↓
6. Flutter usa token em todas as requisições:
   Header: Authorization: Bearer {token}
```

---

## 📝 Formato de Dados

### Datas
- **Formato:** `YYYY-MM-DD`
- **Exemplo:** `2026-05-01`

### Horas
- **Formato:** `HH:MM`
- **Exemplo:** `14:00`

### Status de Agendamento
- `pending` - Pendente
- `confirmed` - Confirmado
- `completed` - Concluído
- `cancelled` - Cancelado

---

## 🎯 Checklist de Integração

- [ ] API Spring Boot rodando
- [ ] Banco de dados inicializado (init.sql)
- [ ] URL base atualizada no Flutter
- [ ] Permissão de HTTP no Android (se necessário)
- [ ] Teste de login funcionando
- [ ] Listagem de barbearias funcionando
- [ ] Criação de agendamento funcionando
- [ ] Listagem de agendamentos funcionando

---

## 🚀 Deploy em Produção

### Opção 1: Render.com (Recomendado)

1. Crie conta no Render.com
2. Conecte seu repositório GitHub
3. Configure:
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -jar target/barber-app-1.0.0.jar`
4. Adicione variáveis de ambiente
5. Deploy!

### Opção 2: Heroku

1. Crie conta no Heroku
2. Instale Heroku CLI
3. Execute:
```bash
heroku create barber-app-api
git push heroku main
```

### Opção 3: AWS/Azure/GCP

Use serviços como:
- AWS Elastic Beanstalk
- Azure App Service
- Google Cloud Run

### Após Deploy

Atualize o Flutter para usar a URL de produção:
```dart
static const String baseUrl = 'https://sua-api.render.com/api';
```

---

## 📱 Testando em Produção

1. Faça build do Flutter:
```bash
flutter build apk --release
```

2. Instale no dispositivo:
```bash
flutter install
```

3. Teste todas as funcionalidades

---

## 🎉 Pronto!

Sua API Spring Boot está integrada com o Flutter! 🚀💈

**Dúvidas?** Consulte:
- `README.md` - Visão geral
- `API_ENDPOINTS.md` - Documentação dos endpoints
- `QUICKSTART.md` - Guia rápido
- Swagger UI - Documentação interativa

---

**Boa sorte com seu app de barbearia! 💈✨**
