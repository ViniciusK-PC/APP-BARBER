# Barber App API 💈

API REST profissional para aplicativo de barbearia desenvolvida com **Spring Boot 3** e **Clean Architecture**.

## 🚀 Tecnologias

- **Java 21** (LTS)
- **Spring Boot 3.2.5**
- **Spring Security** + JWT
- **Spring Data JPA**
- **PostgreSQL** (Supabase)
- **Maven**
- **Swagger/OpenAPI** (Documentação)
- **Lombok**

## 🏗️ Arquitetura

Projeto estruturado seguindo **Clean Architecture**:

```
barber-app/
├── domain/              # Entidades e regras de negócio
│   └── entity/
├── application/         # Casos de uso e DTOs
│   ├── dto/
│   └── service/
├── infrastructure/      # Implementações técnicas
│   ├── repository/
│   ├── security/
│   ├── config/
│   └── exception/
└── presentation/        # Controllers REST
    └── controller/
```

## 📋 Funcionalidades

### Autenticação
- ✅ Registro de usuários
- ✅ Login com JWT
- ✅ Controle de acesso (Admin/Client)

### Barbearias
- ✅ Listar barbearias
- ✅ Buscar barbearia por ID

### Barbeiros
- ✅ Listar barbeiros
- ✅ Filtrar por barbearia

### Serviços
- ✅ Listar serviços
- ✅ Filtrar por barbearia

### Agendamentos
- ✅ Criar agendamento
- ✅ Listar meus agendamentos
- ✅ Atualizar status
- ✅ Estatísticas (Admin)
- ✅ Listar todos (Admin)

## 🔧 Configuração

### Pré-requisitos
- Java 21
- Maven 3.8+
- PostgreSQL (Supabase configurado)

### Variáveis de Ambiente

Configuradas em `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://aws-1-sa-east-1.pooler.supabase.com:6543/postgres
    username: postgres.kmocrclrctgipgudthfd
    password: 9y0N0fiOnvVWOwVd

jwt:
  secret: barber-app-secret-key-change-in-production-2024
  expiration: 86400000 # 24 horas
```

## 🚀 Como Executar

### 1. Clonar o repositório
```bash
cd barber-app
```

### 2. Instalar dependências
```bash
mvn clean install
```

### 3. Executar a aplicação
```bash
mvn spring-boot:run
```

A API estará disponível em: `http://localhost:8080/api`

## 📚 Documentação da API

Acesse o Swagger UI após iniciar a aplicação:

```
http://localhost:8080/api/swagger-ui.html
```

## 🔐 Endpoints Principais

### Autenticação (Público)
```
POST /api/auth/register  - Registrar usuário
POST /api/auth/login     - Fazer login
```

### Barbearias (Público)
```
GET  /api/barbershops     - Listar barbearias
GET  /api/barbershops/:id - Buscar por ID
```

### Barbeiros (Público)
```
GET  /api/barbers?barbershopId=xxx - Listar barbeiros
```

### Serviços (Público)
```
GET  /api/services?barbershopId=xxx - Listar serviços
```

### Agendamentos (Autenticado)
```
GET  /api/appointments              - Meus agendamentos
POST /api/appointments              - Criar agendamento
PUT  /api/appointments/:id/status   - Atualizar status
```

### Admin (Apenas Admin)
```
GET  /api/appointments/admin/stats  - Estatísticas
GET  /api/appointments/admin/all    - Todos os agendamentos
```

## 🔑 Autenticação JWT

Após login/registro, use o token JWT no header:

```
Authorization: Bearer {seu-token-jwt}
```

## 📦 Build para Produção

```bash
mvn clean package -DskipTests
```

O JAR será gerado em: `target/barber-app-1.0.0.jar`

## 🧪 Testes

```bash
mvn test
```

## 📝 Estrutura do Banco de Dados

### Tabelas Principais:
- `users` - Usuários (clientes e admins)
- `barbershops` - Barbearias
- `barbers` - Barbeiros
- `services` - Serviços oferecidos
- `appointments` - Agendamentos

## 🤝 Integração com Flutter

Esta API foi desenvolvida para integrar com o app Flutter mobile localizado em `../mobile-flutter`.

Os endpoints seguem exatamente o contrato esperado pelo app Flutter.

## 📄 Licença

Este projeto é privado e proprietário.

---

Desenvolvido com ☕ e Java 21
