"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Barbershop_1 = require("./entities/Barbershop");
const Barber_1 = require("./entities/Barber");
const Service_1 = require("./entities/Service");
const Appointment_1 = require("./entities/Appointment");
const Notification_1 = require("./entities/Notification");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// URL do Supabase — usa variável de ambiente ou fallback hardcoded
const DATABASE_URL = process.env.DATABASE_URL ||
    'postgresql://postgres.kmocrclrctgipgudthfd:9y0N0fiOnvVWOwVd@aws-1-sa-east-1.pooler.supabase.com:6543/postgres';
console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔍 DATABASE_URL from env:', !!process.env.DATABASE_URL);
console.log('🔍 Connecting to:', DATABASE_URL.split('@')[1]); // mostra só o host
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    synchronize: true,
    logging: false,
    entities: [User_1.User, Barbershop_1.Barbershop, Barber_1.Barber, Service_1.Service, Appointment_1.Appointment, Notification_1.Notification],
    migrations: [],
    subscribers: [],
    extra: {
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 15000,
    },
});
