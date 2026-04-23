import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/barbershop.dart';
import '../services/api_service.dart';
import '../utils/theme.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Barbershop> _barbershops = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadBarbershops();
  }

  Future<void> _loadBarbershops() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final data = await ApiService.getBarbershops();
      setState(() {
        _barbershops = data.map((json) => Barbershop.fromJson(json)).toList();
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('💈 Barbearias'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => context.push('/profile'),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gold))
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, size: 64, color: AppTheme.error),
                      const SizedBox(height: 16),
                      Text('Erro ao carregar barbearias', style: Theme.of(context).textTheme.titleLarge),
                      const SizedBox(height: 8),
                      Text(_error!, style: Theme.of(context).textTheme.bodySmall),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadBarbershops,
                        child: const Text('Tentar Novamente'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadBarbershops,
                  color: AppTheme.gold,
                  child: _barbershops.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.store_outlined, size: 64, color: AppTheme.grey),
                              const SizedBox(height: 16),
                              Text(
                                'Nenhuma barbearia encontrada',
                                style: Theme.of(context).textTheme.titleLarge,
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: _barbershops.length,
                          itemBuilder: (context, index) {
                            final barbershop = _barbershops[index];
                            return _BarbershopCard(barbershop: barbershop);
                          },
                        ),
                ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        onTap: (index) {
          switch (index) {
            case 0:
              // Já está na home
              break;
            case 1:
              context.push('/appointments');
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

class _BarbershopCard extends StatelessWidget {
  final Barbershop barbershop;

  const _BarbershopCard({required this.barbershop});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () => context.push('/barbershop/${barbershop.id}'),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: AppTheme.secondary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Center(
                      child: Text('💈', style: TextStyle(fontSize: 32)),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          barbershop.name,
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.location_on, size: 16, color: AppTheme.grey),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                barbershop.address,
                                style: Theme.of(context).textTheme.bodySmall,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.arrow_forward_ios, size: 16, color: AppTheme.gold),
                ],
              ),
              if (barbershop.description != null) ...[
                const SizedBox(height: 12),
                Text(
                  barbershop.description!,
                  style: Theme.of(context).textTheme.bodyMedium,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(Icons.access_time, size: 16, color: AppTheme.gold),
                  const SizedBox(width: 4),
                  Text(
                    barbershop.openingHours,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const Spacer(),
                  if (barbershop.phone != null) ...[
                    const Icon(Icons.phone, size: 16, color: AppTheme.gold),
                    const SizedBox(width: 4),
                    Text(
                      barbershop.phone!,
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
