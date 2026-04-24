import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Appointment, AppointmentStatus } from '../entities/Appointment';
import { AuthRequest } from '../middlewares/auth';
import { NotificationService } from '../utils/notifications';
import { Between } from 'typeorm';

export class AppointmentController {
  private get appointmentRepository() {
    return AppDataSource.getRepository(Appointment);
  }
  private notificationService = new NotificationService();

  async create(req: AuthRequest, res: Response) {
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
          status: Between(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED),
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
        status: AppointmentStatus.PENDING,
      });

      await this.appointmentRepository.save(appointment);

      // Enviar notificação
      await this.notificationService.sendAppointmentConfirmation(clientId, {
        date,
        time,
      });

      return res.status(201).json(appointment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
  }

  async list(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { status, date } = req.query;

      const where: any = {};

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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar agendamentos' });
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
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
      if (status === AppointmentStatus.CANCELLED) {
        await this.notificationService.sendAppointmentCancellation(
          appointment.clientId,
          { date: appointment.date, time: appointment.time }
        );
      }

      return res.json(appointment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar agendamento' });
    }
  }

  async listAll(req: AuthRequest, res: Response) {
    try {
      const { status, date, limit } = req.query;
      const where: any = {};

      if (status) where.status = status;
      if (date) where.date = date;

      const appointments = await this.appointmentRepository.find({
        where,
        relations: ['client', 'barber', 'service'],
        order: { date: 'DESC', time: 'ASC' },
        take: limit ? parseInt(limit as string) : undefined,
      });

      return res.json(appointments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar agendamentos' });
    }
  }

  async getStats(req: AuthRequest, res: Response) {
    try {
      const total = await this.appointmentRepository.count();
      const pending = await this.appointmentRepository.count({ where: { status: AppointmentStatus.PENDING } });
      const confirmed = await this.appointmentRepository.count({ where: { status: AppointmentStatus.CONFIRMED } });
      const completed = await this.appointmentRepository.count({ where: { status: AppointmentStatus.COMPLETED } });
      const cancelled = await this.appointmentRepository.count({ where: { status: AppointmentStatus.CANCELLED } });

      const { Barber } = await import('../entities/Barber');
      const { Service } = await import('../entities/Service');
      const { User } = await import('../entities/User');

      const totalBarbers = await AppDataSource.getRepository(Barber).count({ where: { isActive: true } });
      const totalServices = await AppDataSource.getRepository(Service).count({ where: { isActive: true } });
      const totalClients = await AppDataSource.getRepository(User).count({ where: { role: 'client' as any } });

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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  }

  async getAvailableSlots(req: AuthRequest, res: Response) {
    try {
      const { barberId, date } = req.query;

      if (!barberId || !date) {
        return res.status(400).json({ error: 'barberId e date são obrigatórios' });
      }

      const appointments = await this.appointmentRepository.find({
        where: {
          barberId: barberId as string,
          date: date as string,
          status: Between(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED),
        },
      });

      const bookedSlots = appointments.map((apt) => apt.time);

      // Gerar slots disponíveis (exemplo: 9h às 18h, intervalos de 30min)
      const allSlots = [];
      for (let hour = 9; hour < 18; hour++) {
        allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        allSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      }

      const availableSlots = allSlots.filter(
        (slot) => !bookedSlots.includes(slot)
      );

      return res.json({ availableSlots });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar horários' });
    }
  }
}
