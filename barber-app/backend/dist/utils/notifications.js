"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const data_source_1 = require("../data-source");
const Notification_1 = require("../entities/Notification");
class NotificationService {
    constructor() {
        this.notificationRepository = data_source_1.AppDataSource.getRepository(Notification_1.Notification);
    }
    async createNotification(userId, title, message, type) {
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
    async sendAppointmentConfirmation(userId, appointmentDetails) {
        return this.createNotification(userId, 'Agendamento Confirmado', `Seu agendamento para ${appointmentDetails.date} às ${appointmentDetails.time} foi confirmado!`, 'appointment');
    }
    async sendAppointmentReminder(userId, appointmentDetails) {
        return this.createNotification(userId, 'Lembrete de Agendamento', `Você tem um agendamento amanhã às ${appointmentDetails.time}`, 'reminder');
    }
    async sendAppointmentCancellation(userId, appointmentDetails) {
        return this.createNotification(userId, 'Agendamento Cancelado', `Seu agendamento para ${appointmentDetails.date} às ${appointmentDetails.time} foi cancelado.`, 'cancellation');
    }
    // TODO: Implementar integração com Firebase Cloud Messaging
    async sendPushNotification(userId, title, body) {
        // Implementar FCM aqui
        console.log('Push notification:', { userId, title, body });
    }
}
exports.NotificationService = NotificationService;
