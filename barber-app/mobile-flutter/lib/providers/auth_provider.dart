import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  String? _token;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null && _token != null;
  bool get isAdmin => _user?.isAdmin ?? false;

  Future<void> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.login(email, password);
      _token = response['token'];
      _user = User.fromJson(response['user']);
      
      await ApiService.saveToken(_token!);
      
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> register(String name, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.register(name, email, password);
      _token = response['token'];
      _user = User.fromJson(response['user']);
      
      await ApiService.saveToken(_token!);
      
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> logout() async {
    _user = null;
    _token = null;
    await ApiService.removeToken();
    notifyListeners();
  }

  Future<void> checkAuth() async {
    final token = await ApiService.getToken();
    if (token != null) {
      _token = token;
      // Aqui você pode fazer uma requisição para validar o token
      // e buscar os dados do usuário
      notifyListeners();
    }
  }
}
