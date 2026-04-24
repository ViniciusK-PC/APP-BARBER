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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const data_source_1 = require("../data-source");
const Appointment_1 = require("../entities/Appointment");
const notifications_1 = require("../utils/notifications");
const typeorm_1 = require("typeorm");
class AppointmentController {
    constructor() {
        this.notificationService = new notifications_1.NotificationService();
    }
    get appointmentRepository() {
        return data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
    }
    async create(req, res) {
        try {
            const { barberId, serviceId, date, time, notes } = req.body;
            const clientId = req.user?.id;
            if (!clientId) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }
            // Verificar se já existe agendamento no mesmo horário
            const existingAppointment = await this.appointmentRepository.findOne({
                where: {
                    barberId,
                    date,
                    time,
                    status: (0, typeorm_1.Between)(Appointment_1.AppointmentStatus.PENDING, Appointment_1.AppointmentStatus.CONFIRMED),
                },
            });
            if (existingAppointment) {
                return res.status(400).json({ error: 'Horário já reservado' });
            }
            const appointment = this.appointmentRepository.create({
                clientId,
                barberId,
                serviceId,
                date,
                time,
                notes,
                status: Appointment_1.AppointmentStatus.PENDING,
            });
            await this.appointmentRepository.save(appointment);
            // Enviar notificação
            await this.notificationService.sendAppointmentConfirmation(clientId, {
                date,
                time,
            });
            return res.status(201).json(appointment);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar agendamento' });
        }
    }
    async list(req, res) {
        try {
            const userId = req.user?.id;
            const { status, date } = req.query;
            const where = {};
            if (req.user?.role === 'client') {
                where.clientId = userId;
            }
            if (status) {
                where.status = status;
            }
            if (date) {
                where.date = date;
            }
            const appointments = await this.appointmentRepository.find({
                where,
                relations: ['client', 'barber', 'service'],
                order: { date: 'ASC', time: 'ASC' },
            });
            return res.json(appointments);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao listar agendamentos' });
        }
    }
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const appointment = await this.appointmentRepository.findOne({
                where: { id },
                relations: ['client'],
            });
            if (!appointment) {
                return res.status(404).json({ error: 'Agendamento não encontrado' });
            }
            appointment.status = status;
            await this.appointmentRepository.save(appointment);
            // Enviar notificação baseada no status
            if (status === Appointment_1.AppointmentStatus.CANCELLED) {
                await this.notificationService.sendAppointmentCancellation(appointment.clientId, { date: appointment.date, time: appointment.time });
            }
            return res.json(appointment);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao atualizar agendamento' });
        }
    }
    async listAll(req, res) {
        try {
            const { status, date, limit } = req.query;
            const where = {};
            if (status)
                where.status = status;
            if (date)
                where.date = date;
            const appointments = await this.appointmentRepository.find({
                where,
                relations: ['client', 'barber', 'service'],
                order: { date: 'DESC', time: 'ASC' },
                take: limit ? parseInt(limit) : undefined,
            });
            return res.json(appointments);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao listar agendamentos' });
        }
    }
    async getStats(req, res) {
        try {
            const total = await this.appointmentRepository.count();
            const pending = await this.appointmentRepository.count({ where: { status: Appointment_1.AppointmentStatus.PENDING } });
            const confirmed = await this.appointmentRepository.count({ where: { status: Appointment_1.AppointmentStatus.CONFIRMED } });
            const completed = await this.appointmentRepository.count({ where: { status: Appointment_1.AppointmentStatus.COMPLETED } });
            const cancelled = await this.appointmentRepository.count({ where: { status: Appointment_1.AppointmentStatus.CANCELLED } });
            const { Barber } = await Promise.resolve().then(() => __importStar(require('../entities/Barber')));
            const { Service } = await Promise.resolve().then(() => __importStar(require('../entities/Service')));
            const { User } = await Promise.resolve().then(() => __importStar(require('../entities/User')));
            const totalBarbers = await data_source_1.AppDataSource.getRepository(Barber).count({ where: { isActive: true } });
            const totalServices = await data_source_1.AppDataSource.getRepository(Service).count({ where: { isActive: true } });
            const totalClients = await data_source_1.AppDataSource.getRepository(User).count({ where: { role: 'client' } });
            return res.json({
                totalAppointments: total,
                pendingAppointments: pending,
                confirmedAppointments: confirmed,
                completedAppointments: completed,
                cancelledAppointments: cancelled,
                totalBarbers,
                totalServices,
                totalClients,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
        }
    }
    async getAvailableSlots(req, res) {
        try {
            const { barberId, date } = req.query;
            if (!barberId || !date) {
                return res.status(400).json({ error: 'barberId e date são obrigatórios' });
            }
            const appointments = await this.appointmentRepository.find({
                where: {
                    barberId: barberId,
                    date: date,
                    status: (0, typeorm_1.Between)(Appointment_1.AppointmentStatus.PENDING, Appointment_1.AppointmentStatus.CONFIRMED),
                },
            });
            const bookedSlots = appointments.map((apt) => apt.time);
            // Gerar slots disponíveis (exemplo: 9h às 18h, intervalos de 30min)
            const allSlots = [];
            for (let hour = 9; hour < 18; hour++) {
                allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
                allSlots.push(`${hour.toString().padStart(2, '0')}:30`);
            }
            const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));
            return res.json({ availableSlots });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar horários' });
        }
    }
}
exports.AppointmentController = AppointmentController;
