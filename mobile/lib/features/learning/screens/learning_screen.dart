import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../../core/theme/app_theme.dart';

class LearningScreen extends StatefulWidget {
  const LearningScreen({super.key});

  @override
  State<LearningScreen> createState() => _LearningScreenState();
}

class _LearningScreenState extends State<LearningScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  final List<Map<String, dynamic>> _enrolledCourses = [
    {
      'title': 'Complete BAMS 1st Year',
      'instructor': 'Dr. Arti Singh',
      'progress': 0.65,
      'lessonsCompleted': 27,
      'totalLessons': 42,
      'lastWatched': 'Chapter 15: Padartha Vigyan',
      'status': 'in_progress',
    },
    {
      'title': 'Anatomy & Physiology',
      'instructor': 'Dr. Arti Singh',
      'progress': 0.30,
      'lessonsCompleted': 8,
      'totalLessons': 28,
      'lastWatched': 'Chapter 4: Skeletal System',
      'status': 'in_progress',
    },
    {
      'title': 'Introduction to Ayurveda',
      'instructor': 'Dr. Arti Singh',
      'progress': 1.0,
      'lessonsCompleted': 12,
      'totalLessons': 12,
      'lastWatched': 'Complete',
      'status': 'completed',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> _getFilteredCourses(String filter) {
    switch (filter) {
      case 'in_progress':
        return _enrolledCourses.where((c) => c['status'] == 'in_progress').toList();
      case 'completed':
        return _enrolledCourses.where((c) => c['status'] == 'completed').toList();
      default:
        return _enrolledCourses;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.all(16),
              child: FadeInDown(
                child: Text('My Learning', style: AppTypography.h2),
              ),
            ),
            
            // Tab Bar
            FadeInDown(
              delay: const Duration(milliseconds: 100),
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppColors.surfaceVariant,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: TabBar(
                  controller: _tabController,
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
                      height: 44,
                      child: Text('All'),
                    ),
                    Tab(
                      height: 44,
                      child: Text('In Progress'),
                    ),
                    Tab(
                      height: 44,
                      child: Text('Completed'),
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Course List
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildCourseList(_getFilteredCourses('all')),
                  _buildCourseList(_getFilteredCourses('in_progress')),
                  _buildCourseList(_getFilteredCourses('completed')),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCourseList(List<Map<String, dynamic>> courses) {
    if (courses.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.school_outlined,
              size: 64,
              color: AppColors.textMuted,
            ),
            const SizedBox(height: 16),
            Text(
              'No courses yet',
              style: AppTypography.h4.copyWith(color: AppColors.textSecondary),
            ),
            const SizedBox(height: 8),
            Text(
              'Start learning by enrolling in a course',
              style: AppTypography.bodyMedium,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                // Navigate to courses
              },
              child: const Text('Browse Courses'),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: courses.length,
      itemBuilder: (context, index) {
        return FadeInUp(
          delay: Duration(milliseconds: 100 * index),
          child: _buildEnrolledCourseCard(courses[index]),
        );
      },
    );
  }

  Widget _buildEnrolledCourseCard(Map<String, dynamic> course) {
    final isCompleted = course['status'] == 'completed';
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadows.small,
      ),
      child: Column(
        children: [
          // Course header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: isCompleted
                  ? LinearGradient(colors: [AppColors.success, AppColors.success.withOpacity(0.7)])
                  : AppColors.primaryGradient,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            ),
            child: Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    isCompleted ? Icons.check_circle : Icons.menu_book,
                    color: Colors.white,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        course['title'],
                        style: AppTypography.labelLarge.copyWith(color: Colors.white),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        course['instructor'],
                        style: AppTypography.bodySmall.copyWith(color: Colors.white70),
                      ),
                    ],
                  ),
                ),
                if (isCompleted)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      '✓ Complete',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                    ),
                  ),
              ],
            ),
          ),
          
          // Progress section
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Progress bar
                Row(
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: LinearProgressIndicator(
                          value: course['progress'],
                          backgroundColor: Colors.grey.shade200,
                          valueColor: AlwaysStoppedAnimation(
                            isCompleted ? AppColors.success : AppColors.primary,
                          ),
                          minHeight: 8,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      '${(course['progress'] * 100).toInt()}%',
                      style: AppTypography.labelLarge.copyWith(
                        color: isCompleted ? AppColors.success : AppColors.primary,
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 12),
                
                // Lessons info
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${course['lessonsCompleted']}/${course['totalLessons']} lessons completed',
                      style: AppTypography.bodyMedium,
                    ),
                    if (!isCompleted)
                      TextButton.icon(
                        onPressed: () {
                          // Continue watching
                        },
                        icon: const Icon(Icons.play_arrow, size: 20),
                        label: const Text('Continue'),
                        style: TextButton.styleFrom(
                          foregroundColor: AppColors.primary,
                        ),
                      ),
                  ],
                ),
                
                if (!isCompleted) ...[
                  const Divider(),
                  Row(
                    children: [
                      const Icon(Icons.history, size: 16, color: AppColors.textMuted),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Last: ${course['lastWatched']}',
                          style: AppTypography.bodySmall,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
