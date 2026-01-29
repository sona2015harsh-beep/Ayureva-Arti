import 'package:supabase_flutter/supabase_flutter.dart';

class QuizService {
  final SupabaseClient _supabase = Supabase.instance.client;

  // Fetch questions for a video (without correct answers)
  Future<List<Map<String, dynamic>>> getQuestions(String videoId) async {
    try {
      final response = await _supabase
          .from('questions')
          .select('id, question_text, option_a, option_b, option_c, option_d, order_index')
          .eq('video_id', videoId)
          .order('order_index', ascending: true);
      
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error fetching questions: $e');
      return [];
    }
  }

  // Submit quiz answers
  Future<Map<String, dynamic>?> submitQuiz({
    required String videoId,
    required Map<String, String> answers, // questionId -> selected option (A/B/C/D)
  }) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) throw Exception('User not logged in');

      // Fetch correct answers server-side
      final questions = await _supabase
          .from('questions')
          .select('id, correct_option')
          .eq('video_id', videoId);

      int score = 0;
      int totalQuestions = questions.length;

      for (var q in questions) {
        if (answers[q['id']] == q['correct_option']) {
          score++;
        }
      }

      // Save result
      final result = await _supabase.from('quiz_results').upsert({
        'user_id': userId,
        'video_id': videoId,
        'score': score,
        'total_questions': totalQuestions,
        'completed_at': DateTime.now().toIso8601String(),
      }, onConflict: 'user_id,video_id').select().single();

      return {
        'score': score,
        'totalQuestions': totalQuestions,
        'percentage': (score / totalQuestions * 100).round(),
        'passed': (score / totalQuestions) >= 0.7,
        'resultId': result['id'],
      };
    } catch (e) {
      print('Error submitting quiz: $e');
      return null;
    }
  }

  // Get quiz result for a video
  Future<Map<String, dynamic>?> getQuizResult(String videoId) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return null;

      final response = await _supabase
          .from('quiz_results')
          .select()
          .eq('user_id', userId)
          .eq('video_id', videoId)
          .maybeSingle();

      return response;
    } catch (e) {
      print('Error fetching quiz result: $e');
      return null;
    }
  }
}
