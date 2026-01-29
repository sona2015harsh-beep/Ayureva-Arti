import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

// Note: For actual Razorpay integration, add razorpay_flutter package
// This service handles the API calls for payment order creation and verification

class PaymentService {
  final SupabaseClient _supabase = Supabase.instance.client;
  
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
