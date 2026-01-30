import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/services/supabase_service.dart';

class NotificationService {
  static final _supabase = Supabase.instance.client;

  // Fetch notifications for the current user AND global announcements
  static Future<List<Map<String, dynamic>>> fetchNotifications() async {
    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) return [];

    try {
      final response = await _supabase
          .from('notifications')
          .select()
          .or('target_user_id.eq.$userId,target_user_id.is.null')
          .order('created_at', ascending: false);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error fetching notifications: $e');
      return [];
    }
  }

  // Get unread count (For Badge)
  // Note: Since we don't have a separate tracking table for 'global' reads yet,
  // this will only be accurate for targeted notifications in V1, or we rely on local storage for 'last checked time'.
  // For V1 MVP, we will just show the total count or use a local 'last_seen' timestamp.
  static Future<int> getUnreadCount() async {
    // Simplified: Just return total for now to show activity
    // In Phase 5.5 we can add a 'notification_reads' table
     final userId = _supabase.auth.currentUser?.id;
    if (userId == null) return 0;
    
    final response = await _supabase
        .from('notifications')
        .count()
        .or('target_user_id.eq.$userId,target_user_id.is.null');
      
    return response;
  }
}
