import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // URL do backend no Render (produção)
  static const String baseUrl = 'https://app-barber-jina.onrender.com/api';
  
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  static Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }

  static Future<Map<String, String>> getHeaders({bool requiresAuth = false}) async {
    final headers = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      final token = await getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  // Auth
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: await getHeaders(),
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Falha no login: ${response.body}');
    }
  }

  static Future<Map<String, dynamic>> register(String name, String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: await getHeaders(),
      body: jsonEncode({'name': name, 'email': email, 'password': password}),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Falha no cadastro: ${response.body}');
    }
  }

  // Barbershops
  static Future<List<dynamic>> getBarbershops() async {
    final response = await http.get(
      Uri.parse('$baseUrl/barbershops'),
      headers: await getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Falha ao carregar barbearias');
    }
  }

  static Future<Map<String, dynamic>> getBarbershop(int id) async {
    final response = await http.get(
      Uri.parse('$baseUrl/barbershops/$id'),
      headers: await getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Falha ao carregar barbearia');
    }
  }

  // Barbers
  static Future<List<dynamic>> getBarbers() async {
    final response = await http.get(
      Uri.parse('$baseUrl/barbers'),
      headers: await getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Falha ao carregar barbeiros');
    }
  }

  // Services
  static Future<List<dynamic>> getServices() async {
    final response = await http.get(
      Uri.parse('$baseUrl/services'),
      headers: await getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Falha ao carregar serviços');
    }
  }

  // Appointments
  static Future<List<dynamic>> getAppointments() async {
    final response = await http.get(
      Uri.parse('$baseUrl/appointments'),
      headers: await getHeaders(requiresAuth: true),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Falha ao carregar agendamentos');
    }
  }

  static Future<Map<String, dynamic>> createAppointment({
    required int barberId,
    required int serviceId,
    required DateTime dateTime,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/appointments'),
      headers: await getHeaders(requiresAuth: true),
      body: jsonEncode({
        'barberId': barberId,
        'serviceId': serviceId,
        'dateTime': dateTime.toIso8601String(),
      }),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Falha ao criar agendamento: ${response.body}');
    }
  }

  static Future<void> updateAppointmentStatus(int id, String status) async {
    final response = await http.put(
      Uri.parse('$baseUrl/appointments/$id/status'),
      headers: await getHeaders(requiresAuth: true),
      body: jsonEncode({'status': status}),
    );

    if (response.statusCode != 200) {
      throw Exception('Falha ao atualizar status');
    }
  }

  // Admin
  static Future<Map<String, dynamic>> getAdminStats() async {
    final response = await http.get(
      Uri.parse('$baseUrl/appointments/admin/stats'),
      headers: await getHeaders(requiresAuth: true),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Falha ao carregar estatísticas');
    }
  }

  static Future<List<dynamic>> getAllAppointments() async {
    final response = await http.get(
      Uri.parse('$baseUrl/appointments/admin/all'),
      headers: await getHeaders(requiresAuth: true),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Falha ao carregar todos os agendamentos');
    }
  }
}
