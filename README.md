# Barbe

Plataforma full-stack para gestão de barbearias, com painel administrativo e área do cliente.

## Módulos implementados

- Autenticação com perfis de administrador, profissional e cliente
- Dashboard gerencial
- Agenda semanal e prevenção de conflito de horários
- Clientes, profissionais, serviços, produtos e estoque
- Fluxo financeiro
- Personalização da identidade da barbearia
- Área do cliente com agendamento, loja, chat e perfil
- Base de dados para comandas, pagamentos, comissões, cupons e fidelidade
- Navegação preparada para todos os módulos administrativos mapeados

## Executar

Requer Node.js 22 ou superior.

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3333/api

### Landing page pública

Existe um segundo frontend independente em `landing/`.

```bash
npm run dev:landing
```

- Landing page: http://localhost:5174

Para gerar a versão de produção:

```bash
npm run build:landing
```

Para simular produção:

```bash
npm run build
npm start
```

## Acessos de demonstração

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@barbe.local | Admin@123 |
| Profissional | profissional@barbe.local | Admin@123 |
| Cliente | cliente@barbe.local | Admin@123 |

Troque as credenciais e defina `JWT_SECRET` no ambiente antes de publicar.

## Banco de dados

O SQLite é criado automaticamente em `server/data/barbe.db` e recebe dados demonstrativos na primeira execução.

## Validação

```bash
npm run check
npm test
npm run build
```
