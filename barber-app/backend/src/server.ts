import express, { Request, Response } from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import routes from './routes';

// Carregar dotenv apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares CORS - deve vir ANTES de tudo
app.use((req: Request, res: Response, next: any) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Responde imediatamente ao preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: false,
  preflightContinue: false,
  optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Database connected successfully');

    // Auto seed em produção se não houver dados
    if (process.env.AUTO_SEED === 'true') {
      const { seedDatabase } = await import('./utils/seed');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('❌ Error connecting to database:', error);
    process.exit(1);
  });
