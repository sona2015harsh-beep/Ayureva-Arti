import 'package:supabase_flutter/supabase_flutter.dart';

class CourseService {
  final SupabaseClient _supabase = Supabase.instance.client;

  // Fetch courses with filters
  Future<List<Map<String, dynamic>>> getCourses({
    bool? isFree,
    String? category,
    String sortBy = 'newest', // newest, popular, price_low, price_high
  }) async {
    try {
      dynamic query = _supabase
          .from('courses')
          .select('''
            *,
            instructor:profiles!instructor_id(full_name, avatar_url),
            modules:modules(count)
          ''')
          .eq('is_published', true);

      // Apply Filters
      if (isFree != null) {
        if (isFree) {
          query = query.eq('price', 0);
        } else {
          query = query.gt('price', 0);
        }
      }

      if (category != null && category.isNotEmpty) {
        query = query.ilike('subtitle', '%$category%'); // Assuming subtitle is used as category/tag
      }

      // Apply Sorting
      switch (sortBy) {
        case 'popular':
          query = query.order('rating', ascending: false);
          break;
        case 'price_low':
          query = query.order('price', ascending: true);
          break;
        case 'price_high':
          query = query.order('price', ascending: false);
          break;
        case 'newest':
        default:
          query = query.order('created_at', ascending: false);
      }

      final response = await query;
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error fetching courses: $e');
      return [];
    }
  }

  // Fetch single course with full details
  Future<Map<String, dynamic>?> getCourseDetails(String courseId) async {
    try {
      final response = await _supabase
          .from('courses')
          .select('''
            *,
            instructor:profiles!instructor_id(id, full_name, avatar_url, email),
            modules(
              id, title, order_index,
              videos(id, title, duration, video_url, is_free_preview, order_index)
            )
          ''')
          .eq('id', courseId)
          .single();

      // Sort modules and videos by order_index
      if (response['modules'] != null) {
        final modules = List<Map<String, dynamic>>.from(response['modules']);
        modules.sort((a, b) => (a['order_index'] ?? 0).compareTo(b['order_index'] ?? 0));
        
        for (var module in modules) {
          if (module['videos'] != null) {
            final videos = List<Map<String, dynamic>>.from(module['videos']);
            videos.sort((a, b) => (a['order_index'] ?? 0).compareTo(b['order_index'] ?? 0));
            module['videos'] = videos;
          }
        }
        response['modules'] = modules;
      }

      return response;
    } catch (e) {
      print('Error fetching course details: $e');
      return null;
    }
  }

  // Search courses
  Future<List<Map<String, dynamic>>> searchCourses(String query) async {
    try {
      final response = await _supabase
          .from('courses')
          .select('''
            *,
            instructor:profiles!instructor_id(full_name)
          ''')
          .eq('is_published', true)
          .or('title.ilike.%$query%,description.ilike.%$query%,subtitle.ilike.%$query%')
          .order('created_at', ascending: false);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error searching courses: $e');
      return [];
    }
  }

  // Get user's enrolled courses
  Future<List<Map<String, dynamic>>> getEnrolledCourses() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return [];

      final response = await _supabase
          .from('enrollments')
          .select('''
            *,
            course:courses(
              *,
              instructor:profiles!instructor_id(full_name, avatar_url),
              modules(count)
            )
          ''')
          .eq('user_id', userId)
          .order('enrolled_at', ascending: false);

      // Extract courses from enrollments
      return response.map<Map<String, dynamic>>((e) {
        final course = Map<String, dynamic>.from(e['course']);
        course['enrolled_at'] = e['enrolled_at'];
        course['enrollment_id'] = e['id'];
        return course;
      }).toList();
    } catch (e) {
      print('Error fetching enrolled courses: $e');
      return [];
    }
  }

  // Check if user is enrolled in a course
  Future<bool> isEnrolled(String courseId) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return false;

      final response = await _supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', userId)
          .eq('course_id', courseId)
          .maybeSingle();

      return response != null;
    } catch (e) {
      print('Error checking enrollment: $e');
      return false;
    }
  }

  // Enroll in a free course
  Future<bool> enrollFreeCourse(String courseId) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return false;

      // Check if course is free
      final course = await _supabase
          .from('courses')
          .select('price')
          .eq('id', courseId)
          .single();

      if ((course['price'] ?? 0) > 0) {
        print('Course is not free');
        return false;
      }

      await _supabase.from('enrollments').insert({
        'user_id': userId,
        'course_id': courseId,
        'amount_paid': 0,
      });

      return true;
    } catch (e) {
      print('Error enrolling in free course: $e');
      return false;
    }
  }

  // Get featured/popular courses (for home screen)
  Future<List<Map<String, dynamic>>> getFeaturedCourses({int limit = 5}) async {
    try {
      final response = await _supabase
          .from('courses')
          .select('''
            *,
            instructor:profiles!instructor_id(full_name, avatar_url)
          ''')
          .eq('is_published', true)
          .order('rating', ascending: false)
          .limit(limit);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error fetching featured courses: $e');
      return [];
    }
  }

  // Get course categories (derived from courses)
  Future<List<String>> getCategories() async {
    try {
      final response = await _supabase
          .from('courses')
          .select('subtitle')
          .eq('is_published', true);

      final categories = <String>{};
      for (var course in response) {
        if (course['subtitle'] != null && course['subtitle'].toString().isNotEmpty) {
          categories.add(course['subtitle']);
        }
      }
      return categories.toList();
    } catch (e) {
      print('Error fetching categories: $e');
      return [];
    }
  }
}
