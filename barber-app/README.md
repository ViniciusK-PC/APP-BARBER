# 💈 Barber App

Sistema de agendamento para barbearias.

---

## 🚀 COMO USAR:

### 1️⃣ Criar Banco de Dados (Primeira vez)
```
CRIAR-BANCO.bat
```
Digite a senha do PostgreSQL: **5833**

### 2️⃣ Iniciar Aplicação
```
INICIAR-SIMPLES.bat
```
- Inicia backend (porta 3000)
- Inicia mobile em modo LAN
- Aguarde o QR code aparecer (1-2 minutos)

### 3️⃣ Abrir no Celular
- Instale **Expo Go** no celular (SDK 54+)
- Conecte na **mesma rede Wi-Fi** que o PC
- Escaneie o **QR code**

---

## 🔧 Scripts Disponíveis:

| Script | Descrição |
|--------|-----------|
| `CRIAR-BANCO.bat` | Cria banco de dados PostgreSQL |
| `INICIAR-SIMPLES.bat` | Inicia backend + mobile (RECOMENDADO) |
| `INICIAR-MANUAL.bat` | Inicia apenas mobile manualmente |
| `LIMPAR-TUDO.bat` | Limpa cache e reinstala dependências |

---

## ⚙️ Configurações:

- **IP Local:** 10.0.0.100
- **Backend:** http://localhost:3000
- **PostgreSQL:** localhost:5432
- **Banco:** barber_app
- **Senha:** 5833

---

## 🐛 Problemas Comuns:

### ❌ Erro de ngrok/tunnel
```
LIMPAR-TUDO.bat
```
Depois execute: `INICIAR-SIMPLES.bat`

### ❌ QR code não aparece
1. Feche todas as janelas
2. Execute: `INICIAR-MANUAL.bat`
3. Aguarde 2-3 minutos

### ❌ Celular não conecta
- Verifique se está na mesma rede Wi-Fi
- IP configurado: 10.0.0.100
- Edite `mobile/src/services/api.ts` se necessário

### ❌ Banco de dados não existe
```
CRIAR-BANCO.bat
```

---

## 📊 Dados de Teste:

Após iniciar, execute:
```bash
cd backend
npm run seed
```

**Login:**
- Admin: admin@barber.com / admin123
- Cliente: cliente@teste.com / 123456

---

## 📱 Requisitos:

- ✅ PostgreSQL 18
- ✅ Node.js 18+
- ✅ Expo Go no celular (SDK 54+)
- ✅ Mesma rede Wi-Fi

---

## 🔧 Tecnologias:

**Backend:**
- Node.js + TypeScript
- Express + PostgreSQL
- TypeORM + JWT

**Mobile:**
- React Native + Expo
- TypeScript + React Navigation
- Axios + AsyncStorage

---

**Versões:**
- Expo SDK: 55
- React: 18.3.1
- React Native: 0.76.5

**Licença:** MIT
