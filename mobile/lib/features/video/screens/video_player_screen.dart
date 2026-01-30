import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/services/download_service.dart';

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
  bool _isPlaying = false;
  double _progress = 0.35;
  
  // Mock lesson data
  final Map<String, dynamic> _lesson = {
    'title': 'Chapter 3: Understanding Doshas',
    'course': 'Complete BAMS 1st Year',
    'duration': '24:35',
    'description': 'In this lesson, we dive deep into the three doshas - Vata, Pitta, and Kapha. You\'ll learn how to identify each dosha, their characteristics, and their importance in Ayurvedic diagnosis and treatment.',
  };
  
  final List<Map<String, dynamic>> _chapters = [
    {'title': 'Chapter 1: Introduction', 'duration': '15:20', 'completed': true},
    {'title': 'Chapter 2: History of Ayurveda', 'duration': '22:15', 'completed': true},
    {'title': 'Chapter 3: Understanding Doshas', 'duration': '24:35', 'completed': false, 'current': true},
    {'title': 'Chapter 4: Vata Dosha in Detail', 'duration': '28:10', 'completed': false},
    {'title': 'Chapter 5: Pitta Dosha in Detail', 'duration': '26:45', 'completed': false},
    {'title': 'Chapter 6: Kapha Dosha in Detail', 'duration': '25:30', 'completed': false},
  ];

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
                  setState(() => _isPlaying = !_isPlaying);
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
                          _lesson['title'],
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
                        _lesson['course'],
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
          _buildResourceItem(Icons.quiz, 'Chapter Quiz', '10 Questions'),
        ],
      ),
    );
  }

  Widget _buildResourceItem(IconData icon, String title, String subtitle) {
    return Container(
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
          const Icon(Icons.download_outlined, color: AppColors.primary),
        ],
      ),
    );
  }
}
