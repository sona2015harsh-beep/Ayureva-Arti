import 'package:supabase_flutter/supabase_flutter.dart';

class VideoProgressService {
  final SupabaseClient _supabase = Supabase.instance.client;

  // Get all video progress for current user
  Future<Map<String, Map<String, dynamic>>> getAllProgress() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return {};

      final response = await _supabase
          .from('video_progress')
          .select()
          .eq('user_id', userId);

      // Return as map with video_id as key for quick lookup
      final Map<String, Map<String, dynamic>> progressMap = {};
      for (var item in response) {
        progressMap[item['video_id']] = item;
      }
      return progressMap;
    } catch (e) {
      print('Error fetching video progress: $e');
      return {};
    }
  }

  // Get progress for specific video
  Future<Map<String, dynamic>?> getProgress(String videoId) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return null;

      final response = await _supabase
          .from('video_progress')
          .select()
          .eq('user_id', userId)
          .eq('video_id', videoId)
          .maybeSingle();

      return response;
    } catch (e) {
      print('Error fetching video progress: $e');
      return null;
    }
  }

  // Update video progress
  Future<void> updateProgress({
    required String videoId,
    required int progressSeconds,
    bool? isCompleted,
  }) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return;

      await _supabase.from('video_progress').upsert({
        'user_id': userId,
        'video_id': videoId,
        'progress_seconds': progressSeconds,
        if (isCompleted != null) 'is_completed': isCompleted,
        'last_watched_at': DateTime.now().toIso8601String(),
      }, onConflict: 'user_id,video_id');
    } catch (e) {
      print('Error updating video progress: $e');
    }
  }

  // Mark video as completed
  Future<void> markCompleted(String videoId) async {
    await updateProgress(
      videoId: videoId,
      progressSeconds: 0, // Doesn't matter for completed
      isCompleted: true,
    );
  }

  // Get course completion percentage
  Future<double> getCourseProgress(String courseId) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return 0;

      // Get all videos in course
      final videos = await _supabase
          .from('videos')
          .select('id, module:modules!inner(course_id)')
          .eq('module.course_id', courseId);

      if (videos.isEmpty) return 0;

      final videoIds = videos.map((v) => v['id'] as String).toList();

      // Get completed videos
      final completedVideos = await _supabase
          .from('video_progress')
          .select('id')
          .eq('user_id', userId)
          .eq('is_completed', true)
          .inFilter('video_id', videoIds);

      return completedVideos.length / videoIds.length;
    } catch (e) {
      print('Error calculating course progress: $e');
      return 0;
    }
  }

  // Get recently watched videos
  Future<List<Map<String, dynamic>>> getRecentlyWatched({int limit = 5}) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return [];

      final response = await _supabase
          .from('video_progress')
          .select('''
            *,
            video:videos(
              id, title, duration, thumbnail_url,
              module:modules(
                title,
                course:courses(id, title, thumbnail_url)
              )
            )
          ''')
          .eq('user_id', userId)
          .order('last_watched_at', ascending: false)
          .limit(limit);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error fetching recently watched: $e');
      return [];
    }
  }
}
