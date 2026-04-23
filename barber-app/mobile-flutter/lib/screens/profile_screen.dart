import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../utils/theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('👤 Perfil'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const SizedBox(height: 20),
            
            // Avatar
            CircleAvatar(
              radius: 60,
              backgroundColor: AppTheme.gold,
              child: Text(
                user?.name.substring(0, 1).toUpperCase() ?? '?',
                style: const TextStyle(
                  fontSize: 48,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.background,
                ),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Nome
            Text(
              user?.name ?? 'Usuário',
              style: Theme.of(context).textTheme.displaySmall,
            ),
            
            const SizedBox(height: 8),
            
            // Email
            Text(
              user?.email ?? '',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppTheme.grey,
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Informações
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.email, color: AppTheme.gold),
                    title: const Text('Email'),
                    subtitle: Text(user?.email ?? ''),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.phone, color: AppTheme.gold),
                    title: const Text('Telefone'),
                    subtitle: Text(user?.phone ?? 'Não informado'),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.calendar_today, color: AppTheme.gold),
                    title: const Text('Membro desde'),
                    subtitle: Text(
                      user?.createdAt != null
                          ? '${user!.createdAt.day}/${user.createdAt.month}/${user.createdAt.year}'
                          : 'Não disponível',
                    ),
                  ),
                  if (authProvider.isAdmin) ...[
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(Icons.admin_panel_settings, color: AppTheme.gold),
                      title: const Text('Tipo de Conta'),
                      subtitle: const Text('Administrador'),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.gold.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'ADMIN',
                          style: TextStyle(
                            color: AppTheme.gold,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Painel Admin
            if (authProvider.isAdmin) ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () => context.go('/admin/dashboard'),
                  icon: const Icon(Icons.dashboard),
                  label: const Text('Painel Administrativo'),
                ),
              ),
              const SizedBox(height: 16),
            ],
            
            // Botão Sair
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () async {
                  await authProvider.logout();
                  if (context.mounted) {
                    context.go('/login');
                  }
                },
                icon: const Icon(Icons.logout),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppTheme.error,
                  side: const BorderSide(color: AppTheme.error),
                ),
                label: const Text('Sair'),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 2,
        onTap: (index) {
          switch (index) {
            case 0:
              context.go('/home');
              break;
            case 1:
              context.push('/appointments');
              break;
            case 2:
              // Já está no perfil
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
