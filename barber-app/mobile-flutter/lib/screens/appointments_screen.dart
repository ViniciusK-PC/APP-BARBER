import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../models/appointment.dart';
import '../services/api_service.dart';
import '../utils/theme.dart';

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> {
  List<Appointment> _appointments = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAppointments();
  }

  Future<void> _loadAppointments() async {
    setState(() => _isLoading = true);

    try {
      final data = await ApiService.getAppointments();
      setState(() {
        _appointments = data.map((json) => Appointment.fromJson(json)).toList();
        _appointments.sort((a, b) => b.dateTime.compareTo(a.dateTime));
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _cancelAppointment(int id) async {
    try {
      await ApiService.updateAppointmentStatus(id, 'cancelled');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Agendamento cancelado'),
          backgroundColor: AppTheme.success,
        ),
      );
      _loadAppointments();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao cancelar: ${e.toString()}'),
          backgroundColor: AppTheme.error,
        ),
      );
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending':
        return Colors.orange;
      case 'confirmed':
        return AppTheme.gold;
      case 'completed':
        return AppTheme.success;
      case 'cancelled':
        return AppTheme.error;
      default:
        return AppTheme.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('📅 Meus Agendamentos'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gold))
          : RefreshIndicator(
              onRefresh: _loadAppointments,
              color: AppTheme.gold,
              child: _appointments.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.calendar_today_outlined, size: 64, color: AppTheme.grey),
                          const SizedBox(height: 16),
                          Text(
                            'Nenhum agendamento',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Faça seu primeiro agendamento!',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          const SizedBox(height: 24),
                          ElevatedButton(
                            onPressed: () => context.go('/home'),
                            child: const Text('Ver Barbearias'),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _appointments.length,
                      itemBuilder: (context, index) {
                        final appointment = _appointments[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 16),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      appointment.barbershop?.name ?? 'Barbearia',
                                      style: Theme.of(context).textTheme.titleLarge,
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                      decoration: BoxDecoration(
                                        color: _getStatusColor(appointment.status).withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        appointment.statusText,
                                        style: TextStyle(
                                          color: _getStatusColor(appointment.status),
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  children: [
                                    const Icon(Icons.calendar_today, size: 16, color: AppTheme.gold),
                                    const SizedBox(width: 8),
                                    Text(
                                      DateFormat('dd/MM/yyyy - HH:mm').format(appointment.dateTime),
                                      style: Theme.of(context).textTheme.bodyMedium,
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    const Icon(Icons.person, size: 16, color: AppTheme.gold),
                                    const SizedBox(width: 8),
                                    Text(
                                      appointment.barber?.name ?? 'Barbeiro',
                                      style: Theme.of(context).textTheme.bodyMedium,
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    const Icon(Icons.cut, size: 16, color: AppTheme.gold),
                                    const SizedBox(width: 8),
                                    Text(
                                      appointment.service?.name ?? 'Serviço',
                                      style: Theme.of(context).textTheme.bodyMedium,
                                    ),
                                    const Spacer(),
                                    Text(
                                      appointment.service?.formattedPrice ?? '',
                                      style: const TextStyle(
                                        color: AppTheme.gold,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                                if (appointment.isPending || appointment.isConfirmed) ...[
                                  const SizedBox(height: 12),
                                  SizedBox(
                                    width: double.infinity,
                                    child: OutlinedButton(
                                      onPressed: () => _cancelAppointment(appointment.id),
                                      style: OutlinedButton.styleFrom(
                                        foregroundColor: AppTheme.error,
                                        side: const BorderSide(color: AppTheme.error),
                                      ),
                                      child: const Text('Cancelar Agendamento'),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 1,
        onTap: (index) {
          switch (index) {
            case 0:
              context.go('/home');
              break;
            case 1:
              // Já está em agendamentos
              break;
            case 2:
              context.push('/profile');
              break;
          }
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Início',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today),
            label: 'Agendamentos',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Perfil',
          ),
        ],
      ),
    );
  }
}
