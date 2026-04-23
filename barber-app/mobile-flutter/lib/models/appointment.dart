import 'barber.dart';
import 'service.dart';
import 'barbershop.dart';

class Appointment {
  final int id;
  final DateTime dateTime;
  final String status;
  final int userId;
  final int barberId;
  final int serviceId;
  final Barber? barber;
  final Service? service;
  final Barbershop? barbershop;

  Appointment({
    required this.id,
    required this.dateTime,
    required this.status,
    required this.userId,
    required this.barberId,
    required this.serviceId,
    this.barber,
    this.service,
    this.barbershop,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['id'],
      dateTime: DateTime.parse(json['dateTime']),
      status: json['status'],
      userId: json['userId'],
      barberId: json['barberId'],
      serviceId: json['serviceId'],
      barber: json['barber'] != null ? Barber.fromJson(json['barber']) : null,
      service: json['service'] != null ? Service.fromJson(json['service']) : null,
      barbershop: json['barbershop'] != null ? Barbershop.fromJson(json['barbershop']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'dateTime': dateTime.toIso8601String(),
      'status': status,
      'userId': userId,
      'barberId': barberId,
      'serviceId': serviceId,
    };
  }

  String get statusText {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }

  bool get isPending => status == 'pending';
  bool get isConfirmed => status == 'confirmed';
  bool get isCompleted => status == 'completed';
  bool get isCancelled => status == 'cancelled';
}
