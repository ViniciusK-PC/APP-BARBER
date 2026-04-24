import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/barbershop.dart';
import '../models/barber.dart';
import '../models/service.dart';
import '../services/api_service.dart';
import '../utils/theme.dart';

class BarbershopDetailScreen extends StatefulWidget {
  final String barbershopId;

  const BarbershopDetailScreen({super.key, required this.barbershopId});

  @override
  State<BarbershopDetailScreen> createState() => _BarbershopDetailScreenState();
}

class _BarbershopDetailScreenState extends State<BarbershopDetailScreen> {
  Barbershop? _barbershop;
  List<Barber> _barbers = [];
  List<Service> _services = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    try {
      final barbershopData = await ApiService.getBarbershop(widget.barbershopId);
      final barbersData = await ApiService.getBarbers(barbershopId: widget.barbershopId);
      final servicesData = await ApiService.getServices(barbershopId: widget.barbershopId);

      setState(() {
        _barbershop = Barbershop.fromJson(barbershopData);
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_barbershop?.name ?? 'Barbearia'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gold))
          : SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: const BoxDecoration(
                      color: AppTheme.secondary,
                    ),
                    child: Column(
                      children: [
                        const Text('💈', style: TextStyle(fontSize: 64)),
                        const SizedBox(height: 16),
                        Text(
                          _barbershop!.name,
                          style: Theme.of(context).textTheme.displaySmall,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.location_on, size: 16, color: AppTheme.grey),
                            const SizedBox(width: 4),
                            Text(_barbershop!.address, style: Theme.of(context).textTheme.bodySmall),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Barbeiros
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('👨‍💼 Barbeiros', style: Theme.of(context).textTheme.headlineMedium),
                        const SizedBox(height: 12),
                        ..._barbers.map((barber) => Card(
                              margin: const EdgeInsets.only(bottom: 8),
                              child: ListTile(
                                leading: const CircleAvatar(
                                  backgroundColor: AppTheme.gold,
                                  child: Icon(Icons.person, color: AppTheme.background),
                                ),
                                title: Text(barber.name),
                                subtitle: Text(barber.specialty ?? 'Barbeiro'),
                              ),
                            )),
                      ],
                    ),
                  ),

                  // Serviços
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('✂️ Serviços', style: Theme.of(context).textTheme.headlineMedium),
                        const SizedBox(height: 12),
                        ..._services.map((service) => Card(
                              margin: const EdgeInsets.only(bottom: 8),
                              child: ListTile(
                                title: Text(service.name),
                                subtitle: Text(service.description ?? ''),
                                trailing: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      service.formattedPrice,
                                      style: const TextStyle(
                                        color: AppTheme.gold,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                    Text(
                                      service.formattedDuration,
                                      style: Theme.of(context).textTheme.bodySmall,
                                    ),
                                  ],
                                ),
                              ),
                            )),
                      ],
                    ),
                  ),

                  const SizedBox(height: 80),
                ],
              ),
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          context.push('/booking', extra: {
            'barbershopId': widget.barbershopId,
            'barbershopName': _barbershop?.name ?? '',
          });
        },
        backgroundColor: AppTheme.gold,
        foregroundColor: AppTheme.background,
        icon: const Icon(Icons.calendar_today),
        label: const Text('Agendar'),
      ),
    );
  }
}
