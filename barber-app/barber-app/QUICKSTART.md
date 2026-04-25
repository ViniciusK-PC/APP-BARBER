# 🚀 Guia de Início Rápido - Barber App API

## 📋 Pré-requisitos

- ✅ Java 21 instalado
- ✅ Maven 3.8+ instalado
- ✅ Supabase configurado

## 🔧 Passo a Passo

### 1️⃣ Configurar o Banco de Dados

Acesse o **Supabase SQL Editor** e execute o script:

```bash
barber-app/database/init.sql
```

Este script irá:
- Criar todas as tabelas necessárias
- Criar índices para performance
- Inserir dados de exemplo (barbearias, barbeiros, serviços)
- Criar usuários de teste

### 2️⃣ Verificar Configurações

Abra `src/main/resources/application.yml` e confirme:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://aws-1-sa-east-1.pooler.supabase.com:6543/postgres
    username: postgres.kmocrclrctgipgudthfd
    password: 9y0N0fiOnvVWOwVd
```

✅ **Já está configurado!**

### 3️⃣ Instalar Dependências

```bash
cd barber-app
mvn clean install
```

### 4️⃣ Executar a API

```bash
mvn spring-boot:run
```

Aguarde a mensagem:
```
Started BarberApplication in X.XXX seconds
```

### 5️⃣ Testar a API

A API estará rodando em: `http://localhost:8080/api`

#### Acessar Swagger (Documentação Interativa)
```
http://localhost:8080/api/swagger-ui.html
```

#### Testar Login

**Usuário Admin:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@barberapp.com",
    "password": "admin123"
  }'
```

**Usuário Cliente:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "cliente123"
  }'
```

Resposta esperada:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-aqui",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "client"
  }
}
```

#### Testar Endpoints Públicos

**Listar Barbearias:**
```bash
curl http://localhost:8080/api/barbershops
```

**Listar Barbeiros:**
```bash
curl http://localhost:8080/api/barbers
```

**Listar Serviços:**
```bash
curl http://localhost:8080/api/services
```

#### Testar Endpoints Autenticados

**Criar Agendamento:**
```bash
curl -X POST http://localhost:8080/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "barberId": "uuid-do-barbeiro",
    "serviceId": "uuid-do-servico",
    "date": "2026-05-01",
    "time": "14:00"
  }'
```

**Listar Meus Agendamentos:**
```bash
curl http://localhost:8080/api/appointments \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔐 Usuários de Teste

| Email | Senha | Role |
|-------|-------|------|
| admin@barberapp.com | admin123 | ADMIN |
| joao@email.com | cliente123 | CLIENT |

## 📚 Endpoints Disponíveis

### Autenticação (Público)
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login

### Barbearias (Público)
- `GET /api/barbershops` - Listar todas
- `GET /api/barbershops/{id}` - Buscar por ID

### Barbeiros (Público)
- `GET /api/barbers?barbershopId=xxx` - Listar (filtrar opcional)

### Serviços (Público)
- `GET /api/services?barbershopId=xxx` - Listar (filtrar opcional)

### Agendamentos (Autenticado)
- `GET /api/appointments` - Meus agendamentos
- `POST /api/appointments` - Criar agendamento
- `PUT /api/appointments/{id}/status` - Atualizar status

### Admin (Apenas Admin)
- `GET /api/appointments/admin/stats` - Estatísticas
- `GET /api/appointments/admin/all` - Todos os agendamentos

## 🐛 Troubleshooting

### Erro de conexão com banco
- Verifique se o Supabase está acessível
- Confirme as credenciais em `application.yml`

### Erro ao compilar
```bash
mvn clean install -U
```

### Porta 8080 já em uso
Altere em `application.yml`:
```yaml
server:
  port: 8081
```

## 🎯 Próximos Passos

1. ✅ Testar todos os endpoints no Swagger
2. ✅ Conectar o app Flutter mobile
3. ✅ Criar mais dados de teste se necessário
4. ✅ Configurar ambiente de produção

## 📞 Suporte

Dúvidas? Verifique:
- README.md principal
- Swagger UI para documentação completa
- Logs da aplicação

---

**Pronto! Sua API está rodando! 🚀💈**
