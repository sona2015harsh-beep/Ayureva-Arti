import 'package:supabase_flutter/supabase_flutter.dart';
// Note: For full FCM integration, add firebase_messaging package

class NotificationService {
  final SupabaseClient _supabase = Supabase.instance.client;

  // Fetch user notifications
  Future<List<Map<String, dynamic>>> getNotifications() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return [];

      final response = await _supabase
          .from('notifications')
          .select()
          .eq('user_id', userId)
          .order('created_at', ascending: false)
          .limit(50);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error fetching notifications: $e');
      return [];
    }
  }

  // Get unread notification count
  Future<int> getUnreadCount() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return 0;

      final response = await _supabase
          .from('notifications')
          .select('id')
          .eq('user_id', userId)
          .eq('is_read', false);

      return response.length;
    } catch (e) {
      print('Error fetching unread count: $e');
      return 0;
    }
  }

  // Mark notifications as read
  Future<void> markAsRead(List<String> notificationIds) async {
    try {
      await _supabase
          .from('notifications')
          .update({'is_read': true})
          .inFilter('id', notificationIds);
    } catch (e) {
      print('Error marking notifications as read: $e');
    }
  }

  // Mark all as read
  Future<void> markAllAsRead() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return;

      await _supabase
          .from('notifications')
          .update({'is_read': true})
          .eq('user_id', userId)
          .eq('is_read', false);
    } catch (e) {
      print('Error marking all as read: $e');
    }
  }

  // Register device token for push notifications
  Future<void> registerDeviceToken(String token, String platform) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return;

      await _supabase.from('device_tokens').upsert({
        'user_id': userId,
        'token': token,
        'platform': platform,
      }, onConflict: 'user_id,token');
    } catch (e) {
      print('Error registering device token: $e');
    }
  }

  // Remove device token (for logout)
  Future<void> removeDeviceToken(String token) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return;

      await _supabase
          .from('device_tokens')
          .delete()
          .eq('user_id', userId)
          .eq('token', token);
    } catch (e) {
      print('Error removing device token: $e');
    }
  }

  // Subscribe to real-time notifications
  void subscribeToNotifications(void Function(Map<String, dynamic>) onNotification) {
    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) return;

    _supabase
        .from('notifications')
        .stream(primaryKey: ['id'])
        .eq('user_id', userId)
        .listen((List<Map<String, dynamic>> data) {
          if (data.isNotEmpty) {
            // Get the newest notification
            final newest = data.reduce((a, b) {
              final aDate = DateTime.parse(a['created_at']);
              final bDate = DateTime.parse(b['created_at']);
              return aDate.isAfter(bDate) ? a : b;
            });
            onNotification(newest);
          }
        });
  }
}
