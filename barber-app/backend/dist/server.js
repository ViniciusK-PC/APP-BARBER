"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
const routes_1 = __importDefault(require("./routes"));
// Carregar dotenv apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// ─── CORS ─────────────────────────────────────────────────────────────────────
// Deve ser o PRIMEIRO middleware — antes de tudo
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');
    // Responde imediatamente ao preflight
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }
    next();
});
// ─── BODY PARSERS ─────────────────────────────────────────────────────────────
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
// Disponível ANTES do banco conectar
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Diagnóstico detalhado
app.get('/debug', (_req, res) => {
    res.json({
        status: 'server_running',
        node_env: process.env.NODE_ENV,
        has_database_url: !!process.env.DATABASE_URL,
        has_jwt_secret: !!process.env.JWT_SECRET,
        db_connected: data_source_1.AppDataSource.isInitialized,
        timestamp: new Date().toISOString(),
    });
});
// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api', routes_1.default);
// ─── LOGGING DE REQUISIÇÕES ───────────────────────────────────────────────────
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});
// ─── 404 HANDLER ──────────────────────────────────────────────────────────────
// DEVE SER O ÚLTIMO MIDDLEWARE (antes do app.listen)
app.use((req, res) => {
    console.log(`❌ 404 - ${req.method} ${req.path}`);
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
});
// ─── START SERVER ─────────────────────────────────────────────────────────────
// Sobe o servidor PRIMEIRO, depois conecta ao banco
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
// Conecta ao banco após o servidor já estar ouvindo
data_source_1.AppDataSource.initialize()
    .then(async () => {
    console.log('✅ Database connected successfully');
    if (process.env.AUTO_SEED === 'true') {
        const { seedDatabase } = await Promise.resolve().then(() => __importStar(require('./utils/seed')));
        await seedDatabase();
    }
})
    .catch((error) => {
    console.error('❌ Error connecting to database:', error);
    // NÃO faz process.exit — servidor continua rodando
});
