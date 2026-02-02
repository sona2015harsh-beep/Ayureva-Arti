import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

// Note: For actual Razorpay integration, add razorpay_flutter package
// This service handles the API calls for payment order creation and verification

class PaymentService {
  final SupabaseClient _supabase = Supabase.instance.client;

  // Verify Coupon Code
  Future<Map<String, dynamic>?> verifyCoupon(String code) async {
    try {
      // TODO: Replace with your actual deployed API URL
      // For Emulator use 'http://10.0.2.2:3000'
      // For iOS Simulator use 'http://127.0.0.1:3000'
      // For Physical Device use your computer's IP 'http://192.168.x.x:3000'
      const String baseUrl = 'http://10.0.2.2:3000'; 
      
      final response = await http.post(
        Uri.parse('$baseUrl/api/coupons/verify'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'code': code}),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        final error = json.decode(response.body);
        throw Exception(error['error'] ?? 'Invalid coupon');
      }
    } catch (e) {
      print('Error verifying coupon: $e');
      return {'error': e.toString().replaceAll('Exception: ', '')};
    }
  }

  
  // Get Razorpay key from environment
  String get razorpayKey => dotenv.env['RAZORPAY_KEY_ID'] ?? '';

  // Create a payment order on the server
  Future<Map<String, dynamic>?> createOrder({
    required String courseId,
    required double amount,
  }) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) throw Exception('User not logged in');

      // Call your backend API to create Razorpay order
      // This should be done server-side for security
      final response = await _supabase.functions.invoke(
        'create-razorpay-order',
        body: {
          'course_id': courseId,
          'amount': amount,
          'user_id': userId,
        },
      );

      if (response.status != 200) {
        throw Exception('Failed to create order');
      }

      return response.data as Map<String, dynamic>;
    } catch (e) {
      print('Error creating order: $e');
      return null;
    }
  }

  // Verify payment after successful Razorpay checkout
  Future<bool> verifyPayment({
    required String orderId,
    required String paymentId,
    required String signature,
    required String courseId,
  }) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) throw Exception('User not logged in');

      // Call your backend API to verify payment
      final response = await _supabase.functions.invoke(
        'verify-razorpay-payment',
        body: {
          'razorpay_order_id': orderId,
          'razorpay_payment_id': paymentId,
          'razorpay_signature': signature,
          'course_id': courseId,
          'user_id': userId,
        },
      );

      if (response.status == 200 && response.data['success'] == true) {
        // Payment verified - enrollment should be created by backend
        return true;
      }

      return false;
    } catch (e) {
      print('Error verifying payment: $e');
      return false;
    }
  }

  // Direct enrollment (for testing or manual enrollment by admin)
  Future<bool> directEnroll({
    required String courseId,
    required double amountPaid,
    String? paymentId,
  }) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) throw Exception('User not logged in');

      await _supabase.from('enrollments').insert({
        'user_id': userId,
        'course_id': courseId,
        'amount_paid': amountPaid,
        'payment_id': paymentId,
      });

      return true;
    } catch (e) {
      print('Error direct enrolling: $e');
      return false;
    }
  }

  // Get user's payment history
  Future<List<Map<String, dynamic>>> getPaymentHistory() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return [];

      final response = await _supabase
          .from('enrollments')
          .select('''
            *,
            course:courses(id, title, thumbnail_url, price)
          ''')
          .eq('user_id', userId)
          .order('enrolled_at', ascending: false);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error fetching payment history: $e');
      return [];
    }
  }
}
