import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Barbershop } from './entities/Barbershop';
import { Barber } from './entities/Barber';
import { Service } from './entities/Service';
import { Appointment } from './entities/Appointment';
import { Notification } from './entities/Notification';

// Log para debug
console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('🔍 NODE_ENV:', process.env.NODE_ENV);

// Parse DATABASE_URL
let dbConfig: any = {};
if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  dbConfig = {
    host: url.hostname,
    port: parseInt(url.port || '5432'),
    username: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  };
  console.log('✅ Using DATABASE_URL:', url.hostname);
} else {
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'barber_app',
  };
  console.log('⚠️ Using fallback config:', dbConfig.host);
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
