# 📡 API Endpoints - Barber App

Base URL: `http://localhost:8080/api`

## 🔐 Autenticação

### POST /auth/register
Registrar novo usuário

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "phone": "(11) 98888-8888"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 98888-8888",
    "role": "client",
    "createdAt": "2026-04-25T10:00:00"
  }
}
```

---

### POST /auth/login
Fazer login

**Request:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 98888-8888",
    "role": "client",
    "createdAt": "2026-04-25T10:00:00"
  }
}
```

---

## 🏪 Barbearias

### GET /barbershops
Listar todas as barbearias

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Barbearia Clássica",
    "address": "Rua das Flores, 123 - Centro",
    "phone": "(11) 3333-4444",
    "description": "A melhor barbearia da região",
    "openTime": "09:00",
    "closeTime": "19:00",
    "isActive": true
  }
]
```

---

### GET /barbershops/{id}
Buscar barbearia por ID

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Barbearia Clássica",
  "address": "Rua das Flores, 123 - Centro",
  "phone": "(11) 3333-4444",
  "description": "A melhor barbearia da região",
  "openTime": "09:00",
  "closeTime": "19:00",
  "isActive": true
}
```

---

## 💈 Barbeiros

### GET /barbers
Listar barbeiros (opcionalmente filtrar por barbearia)

**Query Params:**
- `barbershopId` (opcional): UUID da barbearia

**Exemplos:**
- `/barbers` - Todos os barbeiros
- `/barbers?barbershopId=uuid` - Barbeiros de uma barbearia específica

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Carlos Mendes",
    "specialty": "Cortes clássicos",
    "phone": "(11) 91111-1111",
    "email": "carlos@barber.com",
    "isActive": true,
    "barbershopId": "uuid"
  }
]
```

---

## ✂️ Serviços

### GET /services
Listar serviços (opcionalmente filtrar por barbearia)

**Query Params:**
- `barbershopId` (opcional): UUID da barbearia

**Exemplos:**
- `/services` - Todos os serviços
- `/services?barbershopId=uuid` - Serviços de uma barbearia específica

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Corte Simples",
    "description": "Corte de cabelo tradicional",
    "price": 35.00,
    "duration": 30,
    "isActive": true,
    "barbershopId": "uuid"
  }
]
```

---

## 📅 Agendamentos

### GET /appointments
Listar meus agendamentos

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "date": "2026-05-01",
    "time": "14:00",
    "status": "pending",
    "clientId": "uuid",
    "barberId": "uuid",
    "serviceId": "uuid",
    "barber": {
      "id": "uuid",
      "name": "Carlos Mendes",
      "specialty": "Cortes clássicos"
    },
    "service": {
      "id": "uuid",
      "name": "Corte Simples",
      "price": 35.00,
      "duration": 30
    },
    "barbershop": {
      "id": "uuid",
      "name": "Barbearia Clássica",
      "address": "Rua das Flores, 123"
    }
  }
]
```

---

### POST /appointments
Criar novo agendamento

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "barberId": "uuid",
  "serviceId": "uuid",
  "date": "2026-05-01",
  "time": "14:00",
  "notes": "Observações opcionais"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "date": "2026-05-01",
  "time": "14:00",
  "status": "pending",
  "clientId": "uuid",
  "barberId": "uuid",
  "serviceId": "uuid",
  "barber": {
    "id": "uuid",
    "name": "Carlos Mendes",
    "specialty": "Cortes clássicos"
  },
  "service": {
    "id": "uuid",
    "name": "Corte Simples",
    "price": 35.00,
    "duration": 30
  },
  "barbershop": {
    "id": "uuid",
    "name": "Barbearia Clássica",
    "address": "Rua das Flores, 123"
  }
}
```

---

### PUT /appointments/{id}/status
Atualizar status do agendamento

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "status": "confirmed"
}
```

**Status válidos:**
- `pending` - Pendente
- `confirmed` - Confirmado
- `completed` - Concluído
- `cancelled` - Cancelado

**Response (200):**
```
(sem corpo)
```

---

## 👑 Admin (Apenas Administradores)

### GET /appointments/admin/stats
Obter estatísticas de agendamentos

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "totalAppointments": 150,
  "pendingAppointments": 25,
  "confirmedAppointments": 50,
  "completedAppointments": 60,
  "cancelledAppointments": 15
}
```

---

### GET /appointments/admin/all
Listar todos os agendamentos (últimos 30 dias)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "date": "2026-05-01",
    "time": "14:00",
    "status": "confirmed",
    "clientId": "uuid",
    "barberId": "uuid",
    "serviceId": "uuid",
    "barber": {
      "id": "uuid",
      "name": "Carlos Mendes",
      "specialty": "Cortes clássicos"
    },
    "service": {
      "id": "uuid",
      "name": "Corte Simples",
      "price": 35.00,
      "duration": 30
    },
    "barbershop": {
      "id": "uuid",
      "name": "Barbearia Clássica",
      "address": "Rua das Flores, 123"
    }
  }
]
```

---

## ❌ Códigos de Erro

### 400 Bad Request
Dados inválidos ou faltando campos obrigatórios

```json
{
  "email": "Email é obrigatório",
  "password": "Senha deve ter no mínimo 6 caracteres"
}
```

### 401 Unauthorized
Token inválido ou expirado

```json
{
  "error": "Email ou senha inválidos"
}
```

### 403 Forbidden
Sem permissão para acessar o recurso

```json
{
  "error": "Acesso negado"
}
```

### 404 Not Found
Recurso não encontrado

```json
{
  "error": "Barbearia não encontrada"
}
```

### 500 Internal Server Error
Erro interno do servidor

```json
{
  "error": "Erro interno do servidor",
  "message": "Detalhes do erro"
}
```

---

## 🔑 Autenticação JWT

Após login/registro, use o token em todas as requisições autenticadas:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token expira em:** 24 horas

---

## 📊 Resumo de Endpoints

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | /auth/register | ❌ | Registrar usuário |
| POST | /auth/login | ❌ | Fazer login |
| GET | /barbershops | ❌ | Listar barbearias |
| GET | /barbershops/{id} | ❌ | Buscar barbearia |
| GET | /barbers | ❌ | Listar barbeiros |
| GET | /services | ❌ | Listar serviços |
| GET | /appointments | ✅ | Meus agendamentos |
| POST | /appointments | ✅ | Criar agendamento |
| PUT | /appointments/{id}/status | ✅ | Atualizar status |
| GET | /appointments/admin/stats | 👑 | Estatísticas (Admin) |
| GET | /appointments/admin/all | 👑 | Todos agendamentos (Admin) |

**Legenda:**
- ❌ Público
- ✅ Autenticado
- 👑 Admin

---

**Documentação completa disponível em:** `http://localhost:8080/api/swagger-ui.html`
