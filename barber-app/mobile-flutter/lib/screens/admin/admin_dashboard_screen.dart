import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../services/api_service.dart';
import '../../utils/theme.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  Map<String, dynamic>? _stats;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    setState(() => _isLoading = true);

    try {
      final stats = await ApiService.getAdminStats();
      setState(() {
        _stats = stats;
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
        title: const Text('📊 Dashboard Admin'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => context.push('/profile'),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gold))
          : RefreshIndicator(
              onRefresh: _loadStats,
              color: AppTheme.gold,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '👋 Bem-vindo, Jonas!',
                      style: Theme.of(context).textTheme.displaySmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Gerencie sua barbearia',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppTheme.grey,
                      ),
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // Estatísticas
                    Text('📈 Estatísticas', style: Theme.of(context).textTheme.headlineMedium),
                    const SizedBox(height: 16),
                    
                    GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      mainAxisSpacing: 16,
                      crossAxisSpacing: 16,
                      childAspectRatio: 1.5,
                      children: [
                        _StatCard(
                          icon: Icons.calendar_today,
                          title: 'Total',
                          value: _stats?['totalAppointments']?.toString() ?? '0',
                          color: AppTheme.gold,
                        ),
                        _StatCard(
                          icon: Icons.pending,
                          title: 'Pendentes',
                          value: _stats?['pendingAppointments']?.toString() ?? '0',
                          color: Colors.orange,
                        ),
                        _StatCard(
                          icon: Icons.check_circle,
                          title: 'Confirmados',
                          value: _stats?['confirmedAppointments']?.toString() ?? '0',
                          color: AppTheme.success,
                        ),
                        _StatCard(
                          icon: Icons.done_all,
                          title: 'Concluídos',
                          value: _stats?['completedAppointments']?.toString() ?? '0',
                          color: Colors.blue,
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // Menu de Gerenciamento
                    Text('⚙️ Gerenciamento', style: Theme.of(context).textTheme.headlineMedium),
                    const SizedBox(height: 16),
                    
                    _MenuCard(
                      icon: Icons.calendar_today,
                      title: 'Agendamentos',
                      subtitle: 'Gerenciar todos os agendamentos',
                      onTap: () => context.push('/admin/appointments'),
                    ),
                    const SizedBox(height: 12),
                    _MenuCard(
                      icon: Icons.people,
                      title: 'Barbeiros',
                      subtitle: 'Adicionar e gerenciar barbeiros',
                      onTap: () => context.push('/admin/barbers'),
                    ),
                    const SizedBox(height: 12),
                    _MenuCard(
                      icon: Icons.cut,
                      title: 'Serviços',
                      subtitle: 'Gerenciar serviços e preços',
                      onTap: () => context.push('/admin/services'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final Color color;

  const _StatCard({
    required this.icon,
    required this.title,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(context).textTheme.displaySmall?.copyWith(color: color),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _MenuCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _MenuCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: AppTheme.gold.withOpacity(0.2),
          child: Icon(icon, color: AppTheme.gold),
        ),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: AppTheme.gold),
        onTap: onTap,
      ),
    );
  }
}
