# 🏗️ Arquitetura - Barber App API

## 📐 Clean Architecture

Este projeto segue os princípios da **Clean Architecture** (Arquitetura Limpa), garantindo:

- ✅ Separação de responsabilidades
- ✅ Independência de frameworks
- ✅ Testabilidade
- ✅ Manutenibilidade
- ✅ Escalabilidade

## 🎯 Camadas da Aplicação

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                          │
│                   (Controllers)                          │
│  - Recebe requisições HTTP                              │
│  - Valida entrada                                       │
│  - Retorna respostas                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION                           │
│                (Services / Use Cases)                    │
│  - Lógica de aplicação                                  │
│  - Orquestra fluxo de dados                            │
│  - Transforma DTOs                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                      DOMAIN                              │
│                    (Entities)                            │
│  - Regras de negócio                                    │
│  - Entidades do domínio                                 │
│  - Lógica independente                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE                          │
│         (Repositories, Security, Config)                 │
│  - Implementações técnicas                              │
│  - Acesso a dados (JPA)                                 │
│  - Segurança (JWT)                                      │
│  - Configurações                                        │
└─────────────────────────────────────────────────────────┘
```

## 📁 Estrutura de Pastas

```
src/main/java/com/barber/
│
├── domain/                          # Camada de Domínio
│   └── entity/                      # Entidades do negócio
│       ├── User.java
│       ├── Barbershop.java
│       ├── Barber.java
│       ├── Service.java
│       └── Appointment.java
│
├── application/                     # Camada de Aplicação
│   ├── dto/                         # Data Transfer Objects
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── AuthResponse.java
│   │   ├── CreateAppointmentRequest.java
│   │   ├── AppointmentResponse.java
│   │   └── ...
│   │
│   └── service/                     # Casos de Uso
│       ├── AuthService.java
│       ├── BarbershopService.java
│       ├── BarberService.java
│       ├── ServiceService.java
│       └── AppointmentService.java
│
├── infrastructure/                  # Camada de Infraestrutura
│   ├── repository/                  # Repositórios JPA
│   │   ├── UserRepository.java
│   │   ├── BarbershopRepository.java
│   │   ├── BarberRepository.java
│   │   ├── ServiceRepository.java
│   │   └── AppointmentRepository.java
│   │
│   ├── security/                    # Segurança e JWT
│   │   ├── JwtUtil.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── CustomUserDetailsService.java
│   │   └── SecurityConfig.java
│   │
│   ├── config/                      # Configurações
│   │   └── OpenApiConfig.java
│   │
│   └── exception/                   # Tratamento de erros
│       └── GlobalExceptionHandler.java
│
├── presentation/                    # Camada de Apresentação
│   └── controller/                  # Controllers REST
│       ├── AuthController.java
│       ├── BarbershopController.java
│       ├── BarberController.java
│       ├── ServiceController.java
│       └── AppointmentController.java
│
└── BarberApplication.java           # Classe principal
```

## 🔄 Fluxo de Dados

### Exemplo: Criar Agendamento

```
1. CLIENT (Flutter App)
   │
   ├─> POST /api/appointments
   │   Headers: Authorization: Bearer {token}
   │   Body: { barberId, serviceId, date, time }
   │
   ▼
2. PRESENTATION (AppointmentController)
   │
   ├─> Valida JWT
   ├─> Valida dados (@Valid)
   ├─> Chama AppointmentService
   │
   ▼
3. APPLICATION (AppointmentService)
   │
   ├─> Obtém ID do usuário autenticado
   ├─> Cria entidade Appointment
   ├─> Chama AppointmentRepository
   │
   ▼
4. INFRASTRUCTURE (AppointmentRepository)
   │
   ├─> Persiste no banco (Supabase)
   ├─> Retorna entidade salva
   │
   ▼
5. APPLICATION (AppointmentService)
   │
   ├─> Converte para AppointmentResponse (DTO)
   ├─> Retorna para Controller
   │
   ▼
6. PRESENTATION (AppointmentController)
   │
   ├─> Retorna HTTP 201 Created
   └─> Body: AppointmentResponse JSON
```

## 🔐 Segurança

### Autenticação JWT

```
┌──────────────┐
│   Cliente    │
└──────┬───────┘
       │ 1. POST /auth/login
       │    { email, password }
       ▼
┌──────────────────┐
│ AuthController   │
└──────┬───────────┘
       │ 2. Valida credenciais
       ▼
┌──────────────────┐
│  AuthService     │
└──────┬───────────┘
       │ 3. Gera JWT Token
       ▼
┌──────────────────┐
│    JwtUtil       │
└──────┬───────────┘
       │ 4. Retorna token
       ▼
┌──────────────┐
│   Cliente    │ Armazena token
└──────┬───────┘
       │ 5. Requisições futuras
       │    Header: Authorization: Bearer {token}
       ▼
┌──────────────────────┐
│ JwtAuthFilter        │ Valida token em cada request
└──────────────────────┘
```

### Controle de Acesso

- **Público**: Barbearias, Barbeiros, Serviços, Auth
- **Autenticado**: Agendamentos (próprios)
- **Admin**: Estatísticas, Todos os agendamentos

## 🗄️ Modelo de Dados

```
┌─────────────┐
│    Users    │
└──────┬──────┘
       │ 1:N
       ▼
┌──────────────┐
│ Appointments │
└──────┬───────┘
       │ N:1
       ▼
┌─────────────┐       ┌──────────────┐
│   Barbers   │◄──────│ Barbershops  │
└──────┬──────┘  N:1  └──────────────┘
       │ 1:N              │ 1:N
       ▼                  ▼
┌──────────────┐    ┌──────────────┐
│ Appointments │    │   Services   │
└──────┬───────┘    └──────┬───────┘
       │ N:1               │ N:1
       └───────────────────┘
```

## 🎨 Padrões Utilizados

### Design Patterns

1. **Repository Pattern**
   - Abstração do acesso a dados
   - `UserRepository`, `AppointmentRepository`, etc.

2. **DTO Pattern**
   - Transferência de dados entre camadas
   - `LoginRequest`, `AuthResponse`, etc.

3. **Service Layer Pattern**
   - Lógica de negócio centralizada
   - `AuthService`, `AppointmentService`, etc.

4. **Dependency Injection**
   - Inversão de controle via Spring
   - `@RequiredArgsConstructor` (Lombok)

5. **Builder Pattern**
   - Construção de objetos complexos
   - `@Builder` (Lombok)

## 🧪 Testabilidade

A arquitetura permite testes em cada camada:

- **Unit Tests**: Services isolados
- **Integration Tests**: Controllers + Services
- **Repository Tests**: Acesso a dados

## 📊 Benefícios da Arquitetura

✅ **Manutenibilidade**: Código organizado e fácil de entender
✅ **Escalabilidade**: Fácil adicionar novas features
✅ **Testabilidade**: Camadas independentes
✅ **Flexibilidade**: Trocar implementações sem afetar outras camadas
✅ **Reusabilidade**: Componentes podem ser reutilizados

## 🚀 Evolução Futura

Possíveis melhorias:

- [ ] Adicionar cache (Redis)
- [ ] Implementar eventos (Event Sourcing)
- [ ] Adicionar mensageria (RabbitMQ/Kafka)
- [ ] Implementar CQRS
- [ ] Adicionar observabilidade (Prometheus/Grafana)

---

**Arquitetura profissional e escalável! 🏗️**
