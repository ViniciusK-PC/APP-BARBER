import 'barber.dart';
import 'service.dart';
import 'barbershop.dart';

class Appointment {
  final String id;
  final String date;   // formato: 'YYYY-MM-DD'
  final String time;   // formato: 'HH:MM'
  final String status;
  final String clientId;
  final String barberId;
  final String serviceId;
  final Barber? barber;
  final Service? service;
  final Barbershop? barbershop;

  Appointment({
    required this.id,
    required this.date,
    required this.time,
    required this.status,
    required this.clientId,
    required this.barberId,
    required this.serviceId,
    this.barber,
    this.service,
    this.barbershop,
  });

  // Combina date + time em DateTime para exibição
  DateTime get dateTime {
    try {
      return DateTime.parse('${date}T$time:00');
    } catch (_) {
      return DateTime.now();
    }
  }

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['id'].toString(),
      date: json['date'] ?? '',
      time: json['time'] ?? '',
      status: json['status'] ?? 'pending',
      clientId: json['clientId']?.toString() ?? '',
      barberId: json['barberId']?.toString() ?? '',
      serviceId: json['serviceId']?.toString() ?? '',
      barber: json['barber'] != null ? Barber.fromJson(json['barber']) : null,
      service: json['service'] != null ? Service.fromJson(json['service']) : null,
      barbershop: json['barbershop'] != null ? Barbershop.fromJson(json['barbershop']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date': date,
      'time': time,
      'status': status,
      'clientId': clientId,
      'barberId': barberId,
      'serviceId': serviceId,
    };
  }

  String get statusText {
    switch (status) {
      case 'pending':   return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default:          return status;
    }
  }

  bool get isPending   => status == 'pending';
  bool get isConfirmed => status == 'confirmed';
  bool get isCompleted => status == 'completed';
  bool get isCancelled => status == 'cancelled';
}
