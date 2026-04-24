import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../models/barber.dart';
import '../models/service.dart';
import '../services/api_service.dart';
import '../utils/theme.dart';

class BookingScreen extends StatefulWidget {
  final String barbershopId;
  final String barbershopName;

  const BookingScreen({
    super.key,
    required this.barbershopId,
    required this.barbershopName,
  });

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  List<Barber> _barbers = [];
  List<Service> _services = [];
  Barber? _selectedBarber;
  Service? _selectedService;
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  TimeOfDay _selectedTime = const TimeOfDay(hour: 9, minute: 0);
  bool _isLoading = true;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final barbersData = await ApiService.getBarbers(barbershopId: widget.barbershopId);
      final servicesData = await ApiService.getServices(barbershopId: widget.barbershopId);

      setState(() {
        _barbers = barbersData
            .map((json) => Barber.fromJson(json))
            .where((b) => b.isActive)
            .toList();
        _services = servicesData
            .map((json) => Service.fromJson(json))
            .where((s) => s.isActive)
            .toList();
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 90)),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.dark(
            primary: AppTheme.gold,
            surface: AppTheme.cardColor,
          ),
        ),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _selectedDate = picked);
  }

  Future<void> _selectTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _selectedTime,
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.dark(
            primary: AppTheme.gold,
            surface: AppTheme.cardColor,
          ),
        ),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _selectedTime = picked);
  }

  Future<void> _handleBooking() async {
    if (_selectedBarber == null || _selectedService == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Selecione um barbeiro e um serviço'),
          backgroundColor: AppTheme.error,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final dateTime = DateTime(
        _selectedDate.year,
        _selectedDate.month,
        _selectedDate.day,
        _selectedTime.hour,
        _selectedTime.minute,
      );

      await ApiService.createAppointment(
        barberId: _selectedBarber!.id,
        serviceId: _selectedService!.id,
        dateTime: dateTime,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Agendamento realizado com sucesso!'),
            backgroundColor: AppTheme.success,
          ),
        );
        context.go('/appointments');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erro ao agendar: ${e.toString()}'),
            backgroundColor: AppTheme.error,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.barbershopName)),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gold))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('📅 Novo Agendamento',
                      style: Theme.of(context).textTheme.displaySmall),
                  const SizedBox(height: 24),

                  // Barbeiro
                  Text('👨‍💼 Escolha o Barbeiro',
                      style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 12),
                  if (_barbers.isEmpty)
                    const Card(
                      child: ListTile(
                        title: Text('Nenhum barbeiro disponível'),
                      ),
                    )
                  else
                    ..._barbers.map((barber) => Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          color: _selectedBarber?.id == barber.id
                              ? AppTheme.gold.withOpacity(0.2)
                              : null,
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: _selectedBarber?.id == barber.id
                                  ? AppTheme.gold
                                  : AppTheme.secondary,
                              child: Icon(Icons.person,
                                  color: _selectedBarber?.id == barber.id
                                      ? AppTheme.background
                                      : AppTheme.white),
                            ),
                            title: Text(barber.name),
                            subtitle: Text(barber.specialty ?? 'Barbeiro'),
                            trailing: _selectedBarber?.id == barber.id
                                ? const Icon(Icons.check_circle,
                                    color: AppTheme.gold)
                                : null,
                            onTap: () =>
                                setState(() => _selectedBarber = barber),
                          ),
                        )),

                  const SizedBox(height: 24),

                  // Serviço
                  Text('✂️ Escolha o Serviço',
                      style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 12),
                  if (_services.isEmpty)
                    const Card(
                      child: ListTile(
                        title: Text('Nenhum serviço disponível'),
                      ),
                    )
                  else
                    ..._services.map((service) => Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          color: _selectedService?.id == service.id
                              ? AppTheme.gold.withOpacity(0.2)
                              : null,
                          child: ListTile(
                            title: Text(service.name),
                            subtitle: Text(
                                '${service.formattedDuration} • ${service.formattedPrice}'),
                            trailing: _selectedService?.id == service.id
                                ? const Icon(Icons.check_circle,
                                    color: AppTheme.gold)
                                : null,
                            onTap: () =>
                                setState(() => _selectedService = service),
                          ),
                        )),

                  const SizedBox(height: 24),

                  // Data e Hora
                  Text('🕐 Data e Hora',
                      style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: Card(
                          child: ListTile(
                            leading: const Icon(Icons.calendar_today,
                                color: AppTheme.gold),
                            title: Text(
                                DateFormat('dd/MM/yyyy').format(_selectedDate)),
                            onTap: _selectDate,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Card(
                          child: ListTile(
                            leading: const Icon(Icons.access_time,
                                color: AppTheme.gold),
                            title: Text(_selectedTime.format(context)),
                            onTap: _selectTime,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 32),

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isSubmitting ? null : _handleBooking,
                      child: _isSubmitting
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: AppTheme.background))
                          : const Text('Confirmar Agendamento'),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
