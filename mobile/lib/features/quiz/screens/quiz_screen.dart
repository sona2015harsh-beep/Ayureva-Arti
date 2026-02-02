import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../services/quiz_service.dart';

class QuizScreen extends StatefulWidget {
  final String quizId; // Changed from videoId
  final String? title;

  const QuizScreen({
    super.key,
    required this.quizId,
    this.title,
  });

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  final QuizService _quizService = QuizService();
  
  List<Map<String, dynamic>> _questions = [];
  Map<String, String> _selectedAnswers = {}; 
  int _currentQuestionIndex = 0;
  bool _isLoading = true;
  bool _isSubmitting = false;
  Map<String, dynamic>? _result;

  @override
  void initState() {
    super.initState();
    _loadQuestions();
  }

  Future<void> _loadQuestions() async {
    // 1. Check if user already took this quiz
    final existingResult = await _quizService.getQuizResult(widget.quizId);
    if (existingResult != null) {
       // Ideally re-fetch result details if needed, but for now just show results logic?
       // The previous code didn't auto-show results on load, wait...
    }

    // 2. Load questions
    final questions = await _quizService.getQuestions(widget.quizId);
    setState(() {
      _questions = questions;
      _isLoading = false;
    });
  }

  void _selectAnswer(String questionId, String option) {
    setState(() {
      _selectedAnswers[questionId] = option;
    });
  }

  Future<void> _submitQuiz() async {
    if (_selectedAnswers.length < _questions.length) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please answer all questions')),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    final result = await _quizService.submitQuiz(
      quizId: widget.quizId,
      answers: _selectedAnswers,
    );

    setState(() {
      _result = result;
      _isSubmitting = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text('Quiz: ${widget.title ?? 'Test'}'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _questions.isEmpty
              ? _buildNoQuestions()
              : _result != null
                  ? _buildResults()
                  : _buildQuiz(),
    );
  }

  Widget _buildNoQuestions() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.quiz_outlined, size: 80, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            'No quiz available for this video',
            style: TextStyle(fontSize: 18, color: Colors.grey[600]),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Go Back'),
          ),
        ],
      ),
    );
  }

  Widget _buildQuiz() {
    final question = _questions[_currentQuestionIndex];
    final questionId = question['id'];
    final selectedAnswer = _selectedAnswers[questionId];

    return Column(
      children: [
        // Progress indicator
        LinearProgressIndicator(
          value: (_currentQuestionIndex + 1) / _questions.length,
          backgroundColor: Colors.grey[200],
          valueColor: AlwaysStoppedAnimation(AppColors.primary),
        ),
        
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Question number
                Text(
                  'Question ${_currentQuestionIndex + 1} of ${_questions.length}',
                  style: TextStyle(color: Colors.grey[600], fontSize: 14),
                ),
                const SizedBox(height: 16),
                
                // Question text
                Text(
                  question['question_text'],
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 24),
                
                // Options
                ..._buildOptions(question, selectedAnswer),
              ],
            ),
          ),
        ),
        
        // Navigation buttons
        _buildNavigationButtons(),
      ],
    );
  }

  List<Widget> _buildOptions(Map<String, dynamic> question, String? selectedAnswer) {
    final options = [
      {'key': 'A', 'value': question['option_a']},
      {'key': 'B', 'value': question['option_b']},
      if (question['option_c'] != null) {'key': 'C', 'value': question['option_c']},
      if (question['option_d'] != null) {'key': 'D', 'value': question['option_d']},
    ];

    return options.map((opt) {
      final isSelected = selectedAnswer == opt['key'];
      return Container(
        margin: const EdgeInsets.only(bottom: 12),
        child: InkWell(
          onTap: () => _selectAnswer(question['id'], opt['key']!),
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primary.withOpacity(0.1) : Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isSelected ? AppColors.primary : Colors.grey[300]!,
                width: isSelected ? 2 : 1,
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.primary : Colors.grey[100],
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Text(
                      opt['key']!,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : Colors.grey[700],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    opt['value']!,
                    style: TextStyle(
                      fontSize: 16,
                      color: isSelected ? AppColors.primary : Colors.black87,
                    ),
                  ),
                ),
                if (isSelected)
                  Icon(Icons.check_circle, color: AppColors.primary),
              ],
            ),
          ),
        ),
      );
    }).toList();
  }

  Widget _buildNavigationButtons() {
    final isLastQuestion = _currentQuestionIndex == _questions.length - 1;
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            offset: const Offset(0, -4),
            blurRadius: 8,
          ),
        ],
      ),
      child: Row(
        children: [
          if (_currentQuestionIndex > 0)
            Expanded(
              child: OutlinedButton(
                onPressed: () {
                  setState(() => _currentQuestionIndex--);
                },
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  side: BorderSide(color: AppColors.primary),
                ),
                child: const Text('Previous'),
              ),
            ),
          if (_currentQuestionIndex > 0) const SizedBox(width: 16),
          Expanded(
            child: ElevatedButton(
              onPressed: _isSubmitting
                  ? null
                  : () {
                      if (isLastQuestion) {
                        _submitQuiz();
                      } else {
                        setState(() => _currentQuestionIndex++);
                      }
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: _isSubmitting
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation(Colors.white),
                      ),
                    )
                  : Text(isLastQuestion ? 'Submit Quiz' : 'Next'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResults() {
    final passed = _result!['passed'] as bool;
    final percentage = _result!['percentage'] as int;
    
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Result icon
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: passed ? Colors.green[50] : Colors.orange[50],
                shape: BoxShape.circle,
              ),
              child: Icon(
                passed ? Icons.celebration : Icons.refresh,
                size: 60,
                color: passed ? Colors.green : Colors.orange,
              ),
            ),
            const SizedBox(height: 32),
            
            // Score
            Text(
              passed ? 'Congratulations!' : 'Keep Learning!',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: passed ? Colors.green[700] : Colors.orange[700],
              ),
            ),
            const SizedBox(height: 16),
            
            Text(
              'You scored $percentage%',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 8),
            Text(
              '${_result!['score']} out of ${_result!['totalQuestions']} correct',
              style: TextStyle(fontSize: 16, color: Colors.grey[600]),
            ),
            const SizedBox(height: 32),
            
            // Pass/Fail message
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: passed ? Colors.green[100] : Colors.orange[100],
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                passed ? '🎉 Quiz Passed!' : '📚 70% required to pass',
                style: TextStyle(
                  color: passed ? Colors.green[800] : Colors.orange[800],
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const SizedBox(height: 40),
            
            // Actions
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (!passed)
                  OutlinedButton.icon(
                    onPressed: () {
                      setState(() {
                        _result = null;
                        _selectedAnswers = {};
                        _currentQuestionIndex = 0;
                      });
                    },
                    icon: const Icon(Icons.refresh),
                    label: const Text('Try Again'),
                  ),
                const SizedBox(width: 16),
                ElevatedButton.icon(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                  ),
                  icon: const Icon(Icons.arrow_forward),
                  label: const Text('Continue'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
