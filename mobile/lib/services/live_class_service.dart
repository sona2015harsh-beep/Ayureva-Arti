import 'package:supabase_flutter/supabase_flutter.dart';

class LiveClassService {
  final SupabaseClient _supabase = Supabase.instance.client;

  // Fetch upcoming live classes for the user
  Future<List<Map<String, dynamic>>> getUpcomingClasses() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return [];

      // Get user's enrolled courses
      final enrollments = await _supabase
          .from('enrollments')
          .select('course_id')
          .eq('user_id', userId);
      
      final enrolledCourseIds = enrollments.map((e) => e['course_id'] as String).toList();

      // Get profile to check if admin
      final profile = await _supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

      final isAdmin = profile['role'] == 'admin' || profile['role'] == 'instructor';

      // Fetch live classes
      PostgrestFilterBuilder query = _supabase
          .from('live_classes')
          .select('''
            *,
            course:courses(title, thumbnail_url),
            instructor:profiles!instructor_id(full_name, avatar_url)
          ''')
          .gte('scheduled_at', DateTime.now().toIso8601String());

      // Non-admins only see their enrolled courses' classes
      if (!isAdmin && enrolledCourseIds.isNotEmpty) {
        query = query.filter('course_id', 'in', '(${enrolledCourseIds.join(',')})');
      }

      final response = await query.order('scheduled_at', ascending: true);
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error fetching live classes: $e');
      return [];
    }
  }

  // Get active live classes (currently in session)
  Future<List<Map<String, dynamic>>> getActiveClasses() async {
    try {
      final response = await _supabase
          .from('live_classes')
          .select('''
            *,
            course:courses(title, thumbnail_url),
            instructor:profiles!instructor_id(full_name, avatar_url)
          ''')
          .eq('is_active', true)
          .order('scheduled_at', ascending: true);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error fetching active classes: $e');
      return [];
    }
  }

  // Get Jitsi room details for a specific class
  Future<Map<String, dynamic>?> getClassDetails(String classId) async {
    try {
      final response = await _supabase
          .from('live_classes')
          .select('''
            *,
            course:courses(title),
            instructor:profiles!instructor_id(full_name)
          ''')
          .eq('id', classId)
          .single();

      return response;
    } catch (e) {
      print('Error fetching class details: $e');
      return null;
    }
  }

  // Generate Jitsi join URL
  String getJitsiUrl(String roomId, String displayName) {
    // Using Jitsi public server (use your own server in production)
    final encodedName = Uri.encodeComponent(displayName);
    return 'https://meet.jit.si/$roomId#userInfo.displayName="$encodedName"';
  }
}
