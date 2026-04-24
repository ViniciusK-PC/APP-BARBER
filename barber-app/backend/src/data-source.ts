import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Barbershop } from './entities/Barbershop';
import { Barber } from './entities/Barber';
import { Service } from './entities/Service';
import { Appointment } from './entities/Appointment';
import { Notification } from './entities/Notification';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// URL do Supabase — usa variável de ambiente ou fallback hardcoded
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres.kmocrclrctgipgudthfd:9y0N0fiOnvVWOwVd@aws-1-sa-east-1.pooler.supabase.com:6543/postgres';

console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔍 DATABASE_URL from env:', !!process.env.DATABASE_URL);
console.log('🔍 Connecting to:', DATABASE_URL.split('@')[1]); // mostra só o host

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: true,
  logging: false,
  entities: [User, Barbershop, Barber, Service, Appointment, Notification],
  migrations: [],
  subscribers: [],
  extra: {
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
  },
});
