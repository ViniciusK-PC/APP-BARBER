import 'package:go_router/go_router.dart';
import '../screens/login_screen.dart';
import '../screens/register_screen.dart';
import '../screens/home_screen.dart';
import '../screens/barbershop_detail_screen.dart';
import '../screens/booking_screen.dart';
import '../screens/appointments_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/admin/admin_dashboard_screen.dart';
import '../screens/admin/admin_appointments_screen.dart';
import '../screens/admin/admin_barbers_screen.dart';
import '../screens/admin/admin_services_screen.dart';

class AppRouter {
  static final router = GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/barbershop/:id',
        builder: (context, state) {
          final id = int.parse(state.pathParameters['id']!);
          return BarbershopDetailScreen(barbershopId: id);
        },
      ),
      GoRoute(
        path: '/booking',
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>;
          return BookingScreen(
            barbershopId: extra['barbershopId'],
            barbershopName: extra['barbershopName'],
          );
        },
      ),
      GoRoute(
        path: '/appointments',
        builder: (context, state) => const AppointmentsScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      
      // Admin routes
      GoRoute(
        path: '/admin/dashboard',
        builder: (context, state) => const AdminDashboardScreen(),
      ),
      GoRoute(
        path: '/admin/appointments',
        builder: (context, state) => const AdminAppointmentsScreen(),
      ),
      GoRoute(
        path: '/admin/barbers',
        builder: (context, state) => const AdminBarbersScreen(),
      ),
      GoRoute(
        path: '/admin/services',
        builder: (context, state) => const AdminServicesScreen(),
      ),
    ],
  );
}
