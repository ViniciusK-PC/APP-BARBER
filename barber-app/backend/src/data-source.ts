import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Barbershop } from './entities/Barbershop';
import { Barber } from './entities/Barber';
import { Service } from './entities/Service';
import { Appointment } from './entities/Appointment';
import { Notification } from './entities/Notification';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'barber_app',
  synchronize: process.env.NODE_ENV === 'development',
  logging: false,
  entities: [User, Barbershop, Barber, Service, Appointment, Notification],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
  extra: {
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
});
