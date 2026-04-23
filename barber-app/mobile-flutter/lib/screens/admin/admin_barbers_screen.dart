import 'package:flutter/material.dart';
import '../../models/barber.dart';
import '../../services/api_service.dart';
import '../../utils/theme.dart';

class AdminBarbersScreen extends StatefulWidget {
  const AdminBarbersScreen({super.key});

  @override
  State<AdminBarbersScreen> createState() => _AdminBarbersScreenState();
}

class _AdminBarbersScreenState extends State<AdminBarbersScreen> {
  List<Barber> _barbers = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadBarbers();
  }

  Future<void> _loadBarbers() async {
    setState(() => _isLoading = true);

    try {
      final data = await ApiService.getBarbers();
      setState(() {
        _barbers = data.map((json) => Barber.fromJson(json)).toList();
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
        title: const Text('👨‍💼 Gerenciar Barbeiros'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gold))
          : RefreshIndicator(
              onRefresh: _loadBarbers,
              color: AppTheme.gold,
              child: _barbers.isEmpty
                  ? const Center(child: Text('Nenhum barbeiro cadastrado'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _barbers.length,
                      itemBuilder: (context, index) {
                        final barber = _barbers[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: barber.active ? AppTheme.gold : AppTheme.grey,
                              child: Icon(
                                Icons.person,
                                color: barber.active ? AppTheme.background : AppTheme.white,
                              ),
                            ),
                            title: Text(barber.name),
                            subtitle: Text(barber.specialty ?? 'Barbeiro'),
                            trailing: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: (barber.active ? AppTheme.success : AppTheme.error).withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                barber.active ? 'Ativo' : 'Inativo',
                                style: TextStyle(
                                  color: barber.active ? AppTheme.success : AppTheme.error,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
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
