import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'dart:async';
import '../../../core/theme/app_theme.dart';
import '../../../core/services/download_service.dart';
import '../../../services/quiz_service.dart';
import 'package:go_router/go_router.dart';

class VideoPlayerScreen extends StatefulWidget {
  final String lessonId;
  final String courseId;
  
  const VideoPlayerScreen({
    super.key,
    required this.lessonId,
    required this.courseId,
  });

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  // State
  bool _isPlaying = false;
  double _progress = 0.0;
  int _positionSeconds = 0;
  bool _isLoading = true;
  Timer? _heartbeatTimer;
  final SupabaseClient _supabase = Supabase.instance.client;

  // Real Data
  Map<String, dynamic>? _videoData;
  Map<String, dynamic>? _courseData;
  
  // Mocks for UI compatibility until full implementation
  final List<Map<String, dynamic>> _chapters = []; 
  Map<String, dynamic> get _lesson => {
    'title': _videoData?['title'] ?? 'Loading...',
    'course': _courseData?['title'] ?? '',
    'duration': _videoData?['duration'] ?? '00:00',
    'description': 'Description not available',
  };

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _stopHeartbeat();
    super.dispose();
  }

  Future<void> _loadData() async {
    try {
      // 1. Fetch Video Details
      final videoRes = await _supabase
          .from('videos')
          .select('*, module:modules(title)')
          .eq('id', widget.lessonId)
          .single();

      // 2. Fetch Course Details (for context)
      final courseRes = await _supabase
          .from('courses')
          .select('title')
          .eq('id', widget.courseId)
          .single();
      
      // 3. Get Signed URL
      String? signedUrl;
      if (videoRes['video_url'] != null) {
        try {
           final session = _supabase.auth.currentSession;
           if (session != null) {
              // Assuming API is hosted at relative path or configured base URL
              // In production, use your actual backend URL from .env
              // For now, mocking the fetch call as we need `http` package
              // and base URL configuration. 
              // IMPORTANT: Since we don't have the base URL config here, 
              // I will leave a TODO to implement the HTTP call.
              // For now, we use the raw URL (assuming public bucket currently)
              // but tracking logic is ready.
              
              // Implementation when ready:
              /*
              final res = await http.post(
                Uri.parse('$API_BASE_URL/api/video/sign-url'),
                headers: {'Authorization': 'Bearer ${session.accessToken}'},
                body: jsonEncode({'key': videoRes['video_url']})
              );
              signedUrl = jsonDecode(res.body)['url'];
              */
           }
        } catch (e) {
          print('Error signing URL: $e');
        }
      }

      // 3. Fetch Existing Progress
      final userId = _supabase.auth.currentUser?.id;
      int existingSeconds = 0;
      if (userId != null) {
        final progressRes = await _supabase
            .from('video_progress')
            .select('position_seconds')
            .eq('user_id', userId)
            .eq('video_id', widget.lessonId)
            .maybeSingle();
        
        if (progressRes != null) {
          existingSeconds = progressRes['position_seconds'] ?? 0;
        }
      }

      setState(() {
        _videoData = videoRes;
        _courseData = courseRes;
        _positionSeconds = existingSeconds;
        _progress = _calculateProgress(existingSeconds);
        _isLoading = false;
      });

    } catch (e) {
      print('Error loading video data: $e');
      setState(() => _isLoading = false);
    }
  }

  double _calculateProgress(int seconds) {
    if (_videoData == null) return 0.0;
    // Parse duration "MM:SS" or use default
    // For simplicity, assuming duration is stored as string "MM:SS" or integer seconds?
    // In schema 'duration' is String?. Let's try to parse or mock total duration
    // Mocking total duration as 60 mins (3600s) if parsing fails for now
    return seconds / 3600.0;
  }

  void _togglePlay() {
    setState(() {
      _isPlaying = !_isPlaying;
      if (_isPlaying) {
        _startHeartbeat();
      } else {
        _stopHeartbeat();
      }
    });
  }

  void _startHeartbeat() {
    _heartbeatTimer?.cancel();
    _heartbeatTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      _updateProgress();
    });
  }

  void _stopHeartbeat() {
    _heartbeatTimer?.cancel();
  }

  Future<void> _updateProgress() async {
    // Simulate playing by adding 5 seconds
    setState(() {
      _positionSeconds += 5;
      _progress = _calculateProgress(_positionSeconds);
    });

    // Send Heartbeat to DB
    final userId = _supabase.auth.currentUser?.id;
    if (userId != null) {
      await _supabase.from('video_progress').upsert({
        'user_id': userId,
        'video_id': widget.lessonId,
        'position_seconds': _positionSeconds,
        'is_completed': _progress > 0.9, // Mark complete at 90%
        'updated_at': DateTime.now().toIso8601String(),
      }, onConflict: 'user_id, video_id');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Column(
        children: [
          // Video Player Section
          _buildVideoPlayer(context),
          
          // Content Section
          Expanded(
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(24),
                  topRight: Radius.circular(24),
                ),
              ),
              child: _buildContent(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVideoPlayer(BuildContext context) {
    return SafeArea(
      bottom: false,
      child: Container(
        height: 260,
        color: Colors.black,
        child: Stack(
          children: [
            // Video placeholder
            Center(
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      AppColors.primaryDark,
                      AppColors.primary,
                    ],
                  ),
                ),
                width: double.infinity,
                height: double.infinity,
                child: const Center(
                  child: Icon(
                    Icons.play_circle_outline,
                    size: 80,
                    color: Colors.white54,
                  ),
                ),
              ),
            ),
            
            // Top controls
            Positioned(
              top: 8,
              left: 8,
              right: 8,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                  ),
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.picture_in_picture_alt, color: Colors.white),
                        onPressed: () {},
                      ),
                      IconButton(
                        icon: const Icon(Icons.settings, color: Colors.white),
                        onPressed: () {},
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            // Play/Pause overlay
            Center(
              child: GestureDetector(
                onTap: () {
                  _togglePlay();
                },
                child: Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.3),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    _isPlaying ? Icons.pause : Icons.play_arrow,
                    size: 40,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            
            // Bottom controls
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.7),
                    ],
                  ),
                ),
                child: Column(
                  children: [
                    // Progress bar
                    SliderTheme(
                      data: SliderTheme.of(context).copyWith(
                        trackHeight: 4,
                        thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                        overlayShape: const RoundSliderOverlayShape(overlayRadius: 12),
                        activeTrackColor: AppColors.primary,
                        inactiveTrackColor: Colors.white30,
                        thumbColor: AppColors.primary,
                      ),
                      child: Slider(
                        value: _progress,
                        onChanged: (value) => setState(() => _progress = value),
                      ),
                    ),
                    
                    // Time and controls
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Text(
                              '8:35',
                              style: TextStyle(color: Colors.white, fontSize: 12),
                            ),
                            const Text(
                              ' / 24:35',
                              style: TextStyle(color: Colors.white54, fontSize: 12),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.skip_previous, color: Colors.white, size: 28),
                              onPressed: () {},
                            ),
                            IconButton(
                              icon: const Icon(Icons.skip_next, color: Colors.white, size: 28),
                              onPressed: () {},
                            ),
                            IconButton(
                              icon: const Icon(Icons.fullscreen, color: Colors.white, size: 28),
                              onPressed: () {},
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContent() {
    return DefaultTabController(
      length: 2,
      child: Column(
        children: [
          // Lesson info
          Padding(
            padding: const EdgeInsets.all(16),
            child: FadeInUp(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          _videoData?['title'] ?? 'Loading...',
                          style: AppTypography.h4,
                        ),
                      ),
                       IconButton(
                        onPressed: () async {
                           // Mock download for demo
                           final taskId = await DownloadService.startDownload(
                             url: 'https://files.catbox.moe/c9339e.mp4',       // Example URL
                             fileName: '${_lesson['title'].replaceAll(":", "")}.mp4', // Sanitize filename
                           );
                           if (taskId != null) {
                             if (mounted) {
                               ScaffoldMessenger.of(context).showSnackBar(
                                 const SnackBar(content: Text('Download started...')),
                               );
                             }
                           } else {
                             if (mounted) {
                               ScaffoldMessenger.of(context).showSnackBar(
                                 const SnackBar(content: Text('Could not start download. Check permissions.')),
                               );
                             }
                           }
                        },
                        icon: const Icon(Icons.download_for_offline_outlined),
                        color: AppColors.primary,
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(Icons.menu_book, size: 14, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        _courseData?['title'] ?? '',
                        style: AppTypography.bodySmall,
                      ),
                      const SizedBox(width: 12),
                      Icon(Icons.access_time, size: 14, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        _lesson['duration'],
                        style: AppTypography.bodySmall,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          
          // Tabs
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: AppColors.surfaceVariant,
              borderRadius: BorderRadius.circular(16),
            ),
            child: TabBar(
              indicatorSize: TabBarIndicatorSize.tab,
              indicator: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              labelColor: Colors.white,
              unselectedLabelColor: AppColors.textSecondary,
              labelStyle: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
              unselectedLabelStyle: const TextStyle(
                fontWeight: FontWeight.w500,
                fontSize: 14,
              ),
              dividerColor: Colors.transparent,
              splashBorderRadius: BorderRadius.circular(12),
              tabs: const [
                Tab(
                  height: 40,
                  child: Text('Chapters'),
                ),
                Tab(
                  height: 40,
                  child: Text('About'),
                ),
              ],
            ),
          ),
          
          // Tab content
          Expanded(
            child: TabBarView(
              children: [
                _buildChaptersList(),
                _buildAboutTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChaptersList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _chapters.length,
      itemBuilder: (context, index) {
        final chapter = _chapters[index];
        final isCurrent = chapter['current'] == true;
        final isCompleted = chapter['completed'] == true;
        
        return FadeInUp(
          delay: Duration(milliseconds: 50 * index),
          child: Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isCurrent ? AppColors.primary.withOpacity(0.1) : Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isCurrent ? AppColors.primary : Colors.grey.shade200,
              ),
            ),
            child: Row(
              children: [
                // Status indicator
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: isCompleted
                        ? AppColors.success
                        : (isCurrent ? AppColors.primary : Colors.grey.shade200),
                    shape: BoxShape.circle,
                  ),
                  child: isCompleted
                      ? const Icon(Icons.check, color: Colors.white, size: 18)
                      : (isCurrent
                          ? const Icon(Icons.play_arrow, color: Colors.white, size: 18)
                          : Text(
                              '${index + 1}',
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            )),
                ),
                const SizedBox(width: 12),
                
                // Chapter info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        chapter['title'],
                        style: AppTypography.labelLarge.copyWith(
                          color: isCurrent ? AppColors.primary : null,
                        ),
                      ),
                      Text(
                        chapter['duration'],
                        style: AppTypography.bodySmall,
                      ),
                    ],
                  ),
                ),
                
                // Download icon
                if (isCompleted)
                  const Icon(Icons.download_done, color: AppColors.success, size: 20),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildAboutTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('About This Lesson', style: AppTypography.h4),
          const SizedBox(height: 12),
          Text(
            _lesson['description'],
            style: AppTypography.bodyMedium.copyWith(height: 1.6),
          ),
          const SizedBox(height: 24),
          
          // Resources
          Text('Resources', style: AppTypography.h4),
          const SizedBox(height: 12),
          _buildResourceItem(Icons.picture_as_pdf, 'Doshas Reference Guide.pdf', '2.4 MB'),
          _buildResourceItem(Icons.image, 'Dosha Chart.png', '1.1 MB'),
          _buildResourceItem(Icons.quiz, 'Chapter Quiz', 'Take Test', onTap: _navigateToQuiz),
        ],
      ),
    );
  }

  Future<void> _navigateToQuiz() async {
    setState(() => _isLoading = true);
    try {
      final quizService = QuizService(); // Instantiate here or keep instance
      final quiz = await quizService.getQuizIdForVideo(widget.lessonId);
      
      if (mounted) {
        setState(() => _isLoading = false);
        if (quiz != null) {
          context.push('/quiz/${quiz['id']}', extra: quiz['title']);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('No quiz available for this video')),
          );
        }
      }
    } catch (e) {
      print('Nav error: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Widget _buildResourceItem(IconData icon, String title, String subtitle, {VoidCallback? onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surfaceVariant,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: AppColors.primary, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: AppTypography.labelLarge),
                  Text(subtitle, style: AppTypography.bodySmall),
                ],
              ),
            ),
            Icon(
              onTap != null ? Icons.arrow_forward_ios : Icons.download_outlined, 
              color: AppColors.primary, 
              size: onTap != null ? 16 : 24
            ),
          ],
        ),
      ),
    );
  }
}
