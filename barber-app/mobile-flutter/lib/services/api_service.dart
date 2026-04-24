import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
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
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (requiresAuth) {
      final token = await getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  // ─── AUTH ────────────────────────────────────────────────────────────────

  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final url = Uri.parse('$baseUrl/auth/login');
      print('🔍 Login URL: $url');
      print('📤 Login body: ${jsonEncode({'email': email, 'password': password})}');
      
      final response = await http.post(
        url,
        headers: await getHeaders(),
        body: jsonEncode({'email': email, 'password': password}),
      );
      
      print('📥 Response status: ${response.statusCode}');
      print('📥 Response body: ${response.body}');
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      
      try {
        final body = jsonDecode(response.body);
        throw Exception(body['error'] ?? 'Falha no login (${response.statusCode})');
      } catch (e) {
        throw Exception('Erro ao fazer login: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('❌ Login error: $e');
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> register(
      String name, String email, String password) async {
    try {
      final url = Uri.parse('$baseUrl/auth/register');
      print('🔍 Register URL: $url');
      
      final response = await http.post(
        url,
        headers: await getHeaders(),
        body: jsonEncode({'name': name, 'email': email, 'password': password}),
      );
      
      print('📥 Response status: ${response.statusCode}');
      print('📥 Response body: ${response.body}');
      
      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      }
      
      try {
        final body = jsonDecode(response.body);
        throw Exception(body['error'] ?? 'Falha no cadastro (${response.statusCode})');
      } catch (e) {
        throw Exception('Erro ao fazer cadastro: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('❌ Register error: $e');
      rethrow;
    }
  }

  // ─── BARBERSHOPS ─────────────────────────────────────────────────────────

  static Future<List<dynamic>> getBarbershops() async {
    final response = await http.get(
      Uri.parse('$baseUrl/barbershops'),
      headers: await getHeaders(),
    );
    if (response.statusCode == 200) return jsonDecode(response.body);
    throw Exception('Falha ao carregar barbearias');
  }

  static Future<Map<String, dynamic>> getBarbershop(String id) async {
    final response = await http.get(
      Uri.parse('$baseUrl/barbershops/$id'),
      headers: await getHeaders(),
    );
    if (response.statusCode == 200) return jsonDecode(response.body);
    throw Exception('Falha ao carregar barbearia');
  }

  // ─── BARBERS ─────────────────────────────────────────────────────────────

  static Future<List<dynamic>> getBarbers({String? barbershopId}) async {
    final uri = barbershopId != null
        ? Uri.parse('$baseUrl/barbers?barbershopId=$barbershopId')
        : Uri.parse('$baseUrl/barbers');
    final response = await http.get(uri, headers: await getHeaders());
    if (response.statusCode == 200) return jsonDecode(response.body);
    throw Exception('Falha ao carregar barbeiros');
  }

  // ─── SERVICES ────────────────────────────────────────────────────────────

  static Future<List<dynamic>> getServices({String? barbershopId}) async {
    final uri = barbershopId != null
        ? Uri.parse('$baseUrl/services?barbershopId=$barbershopId')
        : Uri.parse('$baseUrl/services');
    final response = await http.get(uri, headers: await getHeaders());
    if (response.statusCode == 200) return jsonDecode(response.body);
    throw Exception('Falha ao carregar serviços');
  }

  // ─── APPOINTMENTS ────────────────────────────────────────────────────────

  static Future<List<dynamic>> getAppointments() async {
    final response = await http.get(
      Uri.parse('$baseUrl/appointments'),
      headers: await getHeaders(requiresAuth: true),
    );
    if (response.statusCode == 200) return jsonDecode(response.body);
    throw Exception('Falha ao carregar agendamentos');
  }

  /// Backend espera: barberId, serviceId, date (YYYY-MM-DD), time (HH:MM)
  static Future<Map<String, dynamic>> createAppointment({
    required String barberId,
    required String serviceId,
    required DateTime dateTime,
    String? notes,
  }) async {
    final date =
        '${dateTime.year}-${dateTime.month.toString().padLeft(2, '0')}-${dateTime.day.toString().padLeft(2, '0')}';
    final time =
        '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';

    final response = await http.post(
      Uri.parse('$baseUrl/appointments'),
      headers: await getHeaders(requiresAuth: true),
      body: jsonEncode({
        'barberId': barberId,
        'serviceId': serviceId,
        'date': date,
        'time': time,
        if (notes != null) 'notes': notes,
      }),
    );
    if (response.statusCode == 201) return jsonDecode(response.body);
    final body = jsonDecode(response.body);
    throw Exception(body['error'] ?? 'Falha ao criar agendamento');
  }

  static Future<void> updateAppointmentStatus(String id, String status) async {
    final response = await http.put(
      Uri.parse('$baseUrl/appointments/$id/status'),
      headers: await getHeaders(requiresAuth: true),
      body: jsonEncode({'status': status}),
    );
    if (response.statusCode != 200) {
      throw Exception('Falha ao atualizar status');
    }
  }

  // ─── ADMIN ───────────────────────────────────────────────────────────────

  static Future<Map<String, dynamic>> getAdminStats() async {
    final response = await http.get(
      Uri.parse('$baseUrl/appointments/admin/stats'),
      headers: await getHeaders(requiresAuth: true),
    );
    if (response.statusCode == 200) return jsonDecode(response.body);
    throw Exception('Falha ao carregar estatísticas');
  }

  static Future<List<dynamic>> getAllAppointments() async {
    final response = await http.get(
      Uri.parse('$baseUrl/appointments/admin/all'),
      headers: await getHeaders(requiresAuth: true),
    );
    if (response.statusCode == 200) return jsonDecode(response.body);
    throw Exception('Falha ao carregar todos os agendamentos');
  }
}
