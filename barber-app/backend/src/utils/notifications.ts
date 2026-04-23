import { AppDataSource } from '../data-source';
import { Notification } from '../entities/Notification';

export class NotificationService {
  private notificationRepository = AppDataSource.getRepository(Notification);

  async createNotification(
    userId: string,
    title: string,
    message: string,
    type?: string
  ) {
    const notification = this.notificationRepository.create({
      userId,
      title,
      message,
      type,
    });

    await this.notificationRepository.save(notification);

    // TODO: Implementar envio de push notification via Firebase
    // this.sendPushNotification(userId, title, message);

    return notification;
  }

  async sendAppointmentConfirmation(userId: string, appointmentDetails: any) {
    return this.createNotification(
      userId,
      'Agendamento Confirmado',
      `Seu agendamento para ${appointmentDetails.date} às ${appointmentDetails.time} foi confirmado!`,
      'appointment'
    );
  }

  async sendAppointmentReminder(userId: string, appointmentDetails: any) {
    return this.createNotification(
      userId,
      'Lembrete de Agendamento',
      `Você tem um agendamento amanhã às ${appointmentDetails.time}`,
      'reminder'
    );
  }

  async sendAppointmentCancellation(userId: string, appointmentDetails: any) {
    return this.createNotification(
      userId,
      'Agendamento Cancelado',
      `Seu agendamento para ${appointmentDetails.date} às ${appointmentDetails.time} foi cancelado.`,
      'cancellation'
    );
  }

  // TODO: Implementar integração com Firebase Cloud Messaging
  private async sendPushNotification(userId: string, title: string, body: string) {
    // Implementar FCM aqui
    console.log('Push notification:', { userId, title, body });
  }
}
