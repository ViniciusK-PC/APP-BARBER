import express, { Request, Response, NextFunction } from 'express';
import { AppDataSource } from './data-source';
import routes from './routes';

// Carregar dotenv apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 3000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Deve ser o PRIMEIRO middleware — antes de tudo
app.use((req: Request, res: Response, next: NextFunction) => {
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
// Disponível ANTES do banco conectar
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Diagnóstico detalhado
app.get('/debug', (_req: Request, res: Response) => {
  res.json({
    status: 'server_running',
    node_env: process.env.NODE_ENV,
    has_database_url: !!process.env.DATABASE_URL,
    has_jwt_secret: !!process.env.JWT_SECRET,
    db_connected: AppDataSource.isInitialized,
    timestamp: new Date().toISOString(),
  });
});

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api', routes);

// ─── LOGGING DE REQUISIÇÕES ───────────────────────────────────────────────────
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// ─── 404 HANDLER ──────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
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
AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Database connected successfully');

    if (process.env.AUTO_SEED === 'true') {
      const { seedDatabase } = await import('./utils/seed');
      await seedDatabase();
    }
  })
  .catch((error) => {
    console.error('❌ Error connecting to database:', error);
    // NÃO faz process.exit — servidor continua rodando
  });
