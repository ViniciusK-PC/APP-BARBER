import 'package:flutter/material.dart';
import '../../models/service.dart';
import '../../services/api_service.dart';
import '../../utils/theme.dart';

class AdminServicesScreen extends StatefulWidget {
  const AdminServicesScreen({super.key});

  @override
  State<AdminServicesScreen> createState() => _AdminServicesScreenState();
}

class _AdminServicesScreenState extends State<AdminServicesScreen> {
  List<Service> _services = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadServices();
  }

  Future<void> _loadServices() async {
    setState(() => _isLoading = true);

    try {
      final data = await ApiService.getServices();
      setState(() {
        _services = data.map((json) => Service.fromJson(json)).toList();
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
        title: const Text('✂️ Gerenciar Serviços'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gold))
          : RefreshIndicator(
              onRefresh: _loadServices,
              color: AppTheme.gold,
              child: _services.isEmpty
                  ? const Center(child: Text('Nenhum serviço cadastrado'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _services.length,
                      itemBuilder: (context, index) {
                        final service = _services[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: service.active ? AppTheme.gold : AppTheme.grey,
                              child: Icon(
                                Icons.cut,
                                color: service.active ? AppTheme.background : AppTheme.white,
                              ),
                            ),
                            title: Text(service.name),
                            subtitle: Text('${service.formattedDuration} • ${service.description ?? ""}'),
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
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: (service.active ? AppTheme.success : AppTheme.error).withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    service.active ? 'Ativo' : 'Inativo',
                                    style: TextStyle(
                                      color: service.active ? AppTheme.success : AppTheme.error,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 10,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Funcionalidade em desenvolvimento')),
          );
        },
        backgroundColor: AppTheme.gold,
        child: const Icon(Icons.add, color: AppTheme.background),
      ),
    );
  }
}
