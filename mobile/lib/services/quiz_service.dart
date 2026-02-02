import 'package:supabase_flutter/supabase_flutter.dart';

class QuizService {
  final SupabaseClient _supabase = Supabase.instance.client;

  // --- New Methods for Quiz Context ---

  // Get Quiz ID linked to a Video
  Future<Map<String, dynamic>?> getQuizIdForVideo(String videoId) async {
    try {
      final response = await _supabase
          .from('quizzes')
          .select('id, title, time_limit_minutes, passing_percentage')
          .eq('video_id', videoId)
          .eq('type', 'VIDEO')
          .maybeSingle();
      return response;
    } catch (e) {
      print('Error finding quiz for video: $e');
      return null;
    }
  }

  // Get Quiz ID linked to a Module
  Future<Map<String, dynamic>?> getQuizIdForModule(String moduleId) async {
    try {
      final response = await _supabase
          .from('quizzes')
          .select('id, title, time_limit_minutes, passing_percentage')
          .eq('module_id', moduleId)
          .eq('type', 'MODULE')
          .maybeSingle();
      return response;
    } catch (e) {
      print('Error finding quiz for module: $e');
      return null;
    }
  }

  // List Mock Tests
  Future<List<Map<String, dynamic>>> getMockTests() async {
    try {
      final response = await _supabase
          .from('quizzes')
          .select('id, title, description, time_limit_minutes')
          .eq('type', 'MOCK')
          .eq('is_active', true)
          .order('created_at', ascending: false);
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error fetching mock tests: $e');
      return [];
    }
  }

  // --- Core Quiz Logic ---

  Future<List<Map<String, dynamic>>> getQuestions(String quizId) async {
    try {
      final response = await _supabase
          .from('questions')
          .select('id, question_text, option_a, option_b, option_c, option_d, order_index')
          .eq('quiz_id', quizId)
          .order('order_index', ascending: true);
      
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error fetching questions: $e');
      return [];
    }
  }

  Future<Map<String, dynamic>?> submitQuiz({
    required String quizId,
    required Map<String, String> answers,
  }) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) throw Exception('User not logged in');

      // 1. Fetch correct answers & passing criteria
      final questions = await _supabase
          .from('questions')
          .select('id, correct_option')
          .eq('quiz_id', quizId);
      
      final quizConfig = await _supabase
          .from('quizzes')
          .select('passing_percentage')
          .eq('id', quizId)
          .single();

      int score = 0;
      int totalQuestions = questions.length;

      for (var q in questions) {
        if (answers[q['id']] == q['correct_option']) {
          score++;
        }
      }

      // 2. Check existing result (Manual Upsert logic since unique constraint might be tricky)
      final existing = await _supabase
          .from('quiz_results')
          .select('id')
          .eq('user_id', userId)
          .eq('quiz_id', quizId)
          .maybeSingle();

      Map<String, dynamic> result;
      final payload = {
        'user_id': userId,
        'quiz_id': quizId,
        'score': score,
        'total_questions': totalQuestions,
        'completed_at': DateTime.now().toIso8601String(),
      };

      if (existing != null) {
        result = await _supabase
            .from('quiz_results')
            .update(payload)
            .eq('id', existing['id'])
            .select()
            .single();
      } else {
        result = await _supabase
            .from('quiz_results')
            .insert(payload)
            .select()
            .single();
      }

      final passingPct = quizConfig['passing_percentage'] ?? 70;

      return {
        'score': score,
        'totalQuestions': totalQuestions,
        'percentage': totalQuestions > 0 ? (score / totalQuestions * 100).round() : 0,
        'passed': totalQuestions > 0 && (score / totalQuestions * 100) >= passingPct,
        'resultId': result['id'],
      };
    } catch (e) {
      print('Error submitting quiz: $e');
      return null;
    }
  }

  // Get result for a specific quiz
  Future<Map<String, dynamic>?> getQuizResult(String quizId) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return null;

      final response = await _supabase
          .from('quiz_results')
          .select()
          .eq('user_id', userId)
          .eq('quiz_id', quizId)
          .maybeSingle();

      return response;
    } catch (e) {
      print('Error fetching quiz result: $e');
      return null;
    }
  }
}
