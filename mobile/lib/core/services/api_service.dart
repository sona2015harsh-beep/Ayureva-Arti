import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// API Service for Ayureva backend
class ApiService {
  static const String baseUrl = 'https://ayureva-arti.vercel.app/api';
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  
  // Get auth token from secure storage
  Future<String?> _getToken() async {
    return await _storage.read(key: 'auth_token');
  }
  
  // Generic GET request
  Future<Map<String, dynamic>> get(String endpoint) async {
    final token = await _getToken();
    final response = await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    return _handleResponse(response);
  }
  
  // Generic POST request
  Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> data) async {
    final token = await _getToken();
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(data),
    );
    return _handleResponse(response);
  }
  
  Map<String, dynamic> _handleResponse(http.Response response) {
    final data = jsonDecode(response.body);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return {'success': true, 'data': data};
    } else {
      return {'success': false, 'error': data['message'] ?? 'An error occurred'};
    }
  }
  
  // Auth methods
  Future<Map<String, dynamic>> login(String email, String password) async {
    return post('/auth/login', {'email': email, 'password': password});
  }
  
  Future<Map<String, dynamic>> signup({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    return post('/auth/signup', {
      'name': name,
      'email': email,
      'phone': phone,
      'password': password,
    });
  }
  
  Future<Map<String, dynamic>> verifyOtp(String phone, String otp) async {
    return post('/auth/verify-otp', {'phone': phone, 'otp': otp});
  }
  
  // Course methods
  Future<Map<String, dynamic>> getCourses() async {
    return get('/courses');
  }
  
  Future<Map<String, dynamic>> getCourse(String id) async {
    return get('/courses/$id');
  }
  
  Future<Map<String, dynamic>> getMyCourses() async {
    return get('/user/courses');
  }
  
  // Save auth token
  Future<void> saveToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }
  
  // Clear auth
  Future<void> logout() async {
    await _storage.delete(key: 'auth_token');
    await _storage.delete(key: 'user');
  }
  
  // Save user data
  Future<void> saveUser(Map<String, dynamic> user) async {
    await _storage.write(key: 'user', value: jsonEncode(user));
  }
  
  // Get user data
  Future<Map<String, dynamic>?> getUser() async {
    final userData = await _storage.read(key: 'user');
    if (userData != null) {
      return jsonDecode(userData);
    }
    return null;
  }
  
  // Check if logged in
  Future<bool> isLoggedIn() async {
    final token = await _getToken();
    return token != null;
  }
}
