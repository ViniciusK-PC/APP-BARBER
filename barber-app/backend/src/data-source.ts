import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Barbershop } from './entities/Barbershop';
import { Barber } from './entities/Barber';
import { Service } from './entities/Service';
import { Appointment } from './entities/Appointment';
import { Notification } from './entities/Notification';

// Carregar dotenv apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Parse DATABASE_URL
let dbConfig: any = {};

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres.kmocrclrctgipgudthfd:9y0N0fiOnvVWOwVd@aws-1-sa-east-1.pooler.supabase.com:6543/postgres';

console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('🔍 NODE_ENV:', process.env.NODE_ENV);

try {
  const url = new URL(databaseUrl);
  dbConfig = {
    host: url.hostname,
    port: parseInt(url.port || '5432'),
    username: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  };
  console.log('✅ Using DATABASE_URL:', url.hostname);
} catch (e) {
  console.error('❌ Invalid DATABASE_URL:', e);
  process.exit(1);
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...dbConfig,
  synchronize: true,
  logging: false,
  ssl: { rejectUnauthorized: false },
  entities: [User, Barbershop, Barber, Service, Appointment, Notification],
  migrations: [],
  subscribers: [],
  extra: {
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },
});
