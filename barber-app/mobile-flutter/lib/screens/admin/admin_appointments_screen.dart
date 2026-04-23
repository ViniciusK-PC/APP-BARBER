import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/appointment.dart';
import '../../services/api_service.dart';
import '../../utils/theme.dart';

class AdminAppointmentsScreen extends StatefulWidget {
  const AdminAppointmentsScreen({super.key});

  @override
  State<AdminAppointmentsScreen> createState() => _AdminAppointmentsScreenState();
}

class _AdminAppointmentsScreenState extends State<AdminAppointmentsScreen> {
  List<Appointment> _appointments = [];
  List<Appointment> _filteredAppointments = [];
  bool _isLoading = true;
  String _selectedFilter = 'all';

  @override
  void initState() {
    super.initState();
    _loadAppointments();
  }

  Future<void> _loadAppointments() async {
    setState(() => _isLoading = true);

    try {
      final data = await ApiService.getAllAppointments();
      setState(() {
        _appointments = data.map((json) => Appointment.fromJson(json)).toList();
        _appointments.sort((a, b) => b.dateTime.compareTo(a.dateTime));
        _filterAppointments();
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  void _filterAppointments() {
    setState(() {
      if (_selectedFilter == 'all') {
        _filteredAppointments = _appointments;
      } else {
        _filteredAppointments = _appointments
            .where((a) => a.status == _selectedFilter)
            .toList();
      }
    });
  }

  Future<void> _updateStatus(int id, String status) async {
    try {
      await ApiService.updateAppointmentStatus(id, status);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Status atualizado'),
          backgroundColor: AppTheme.success,
        ),
      );
      _loadAppointments();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro: ${e.toString()}'),
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
        title: const Text('📅 Gerenciar Agendamentos'),
      ),
      body: Column(
        children: [
          // Filtros
          Container(
            padding: const EdgeInsets.all(16),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _FilterChip(
                    label: 'Todos',
                    isSelected: _selectedFilter == 'all',
                    onTap: () {
                      setState(() => _selectedFilter = 'all');
                      _filterAppointments();
                    },
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'Pendentes',
                    isSelected: _selectedFilter == 'pending',
                    onTap: () {
                      setState(() => _selectedFilter = 'pending');
                      _filterAppointments();
                    },
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'Confirmados',
                    isSelected: _selectedFilter == 'confirmed',
                    onTap: () {
                      setState(() => _selectedFilter = 'confirmed');
                      _filterAppointments();
                    },
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'Concluídos',
                    isSelected: _selectedFilter == 'completed',
                    onTap: () {
                      setState(() => _selectedFilter = 'completed');
                      _filterAppointments();
                    },
                  ),
                ],
              ),
            ),
          ),

          // Lista
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.gold))
                : RefreshIndicator(
                    onRefresh: _loadAppointments,
                    color: AppTheme.gold,
                    child: _filteredAppointments.isEmpty
                        ? const Center(child: Text('Nenhum agendamento'))
                        : ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: _filteredAppointments.length,
                            itemBuilder: (context, index) {
                              final appointment = _filteredAppointments[index];
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
                                            DateFormat('dd/MM/yyyy - HH:mm').format(appointment.dateTime),
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
                                      Text('Barbeiro: ${appointment.barber?.name ?? "N/A"}'),
                                      Text('Serviço: ${appointment.service?.name ?? "N/A"}'),
                                      Text('Preço: ${appointment.service?.formattedPrice ?? "N/A"}'),
                                      const SizedBox(height: 12),
                                      Row(
                                        children: [
                                          if (appointment.isPending) ...[
                                            Expanded(
                                              child: ElevatedButton(
                                                onPressed: () => _updateStatus(appointment.id, 'confirmed'),
                                                child: const Text('Confirmar'),
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                          ],
                                          if (appointment.isConfirmed) ...[
                                            Expanded(
                                              child: ElevatedButton(
                                                onPressed: () => _updateStatus(appointment.id, 'completed'),
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: AppTheme.success,
                                                ),
                                                child: const Text('Concluir'),
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                          ],
                                          if (!appointment.isCancelled && !appointment.isCompleted)
                                            Expanded(
                                              child: OutlinedButton(
                                                onPressed: () => _updateStatus(appointment.id, 'cancelled'),
                                                style: OutlinedButton.styleFrom(
                                                  foregroundColor: AppTheme.error,
                                                  side: const BorderSide(color: AppTheme.error),
                                                ),
                                                child: const Text('Cancelar'),
                                              ),
                                            ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.gold : AppTheme.cardColor,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? AppTheme.background : AppTheme.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
