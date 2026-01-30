import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/theme/app_theme.dart';
import '../../../services/course_service.dart';
import '../../../services/video_progress_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final CourseService _courseService = CourseService();
  final VideoProgressService _progressService = VideoProgressService();
  
  String _userName = 'Student';
  List<Map<String, dynamic>> _featuredCourses = [];
  List<Map<String, dynamic>> _enrolledCourses = [];
  List<Map<String, dynamic>> _recentlyWatched = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    // Get user name from Supabase auth
    final user = Supabase.instance.client.auth.currentUser;
    final fullName = user?.userMetadata?['full_name'] ?? user?.email?.split('@')[0] ?? 'Student';

    final featured = await _courseService.getFeaturedCourses(limit: 5);
    final enrolled = await _courseService.getEnrolledCourses();
    final recent = await _progressService.getRecentlyWatched(limit: 3);

    setState(() {
      _userName = fullName;
      _featuredCourses = featured;
      _enrolledCourses = enrolled;
      _recentlyWatched = recent;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: CustomScrollView(
          slivers: [
            // Custom App Bar with gradient
            SliverToBoxAdapter(
              child: _buildHeader(),
            ),
            
            // Stats Cards
            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverToBoxAdapter(
                child: _buildStatsGrid(),
              ),
            ),
            
            // Continue Watching Section
            if (_recentlyWatched.isNotEmpty) ...[
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverToBoxAdapter(
                  child: _buildSectionHeader('Continue Watching', () {
                    context.push('/learning');
                  }),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverToBoxAdapter(
                  child: _buildRecentlyWatched(),
                ),
              ),
            ],
            
            // My Courses (Enrolled)
            if (_enrolledCourses.isNotEmpty) ...[
              SliverPadding(
                padding: const EdgeInsets.all(16),
                sliver: SliverToBoxAdapter(
                  child: _buildSectionHeader('My Courses', () {
                    context.push('/learning');
                  }),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.only(left: 16, bottom: 16),
                sliver: SliverToBoxAdapter(
                  child: _buildEnrolledCourses(),
                ),
              ),
            ],
            
            // Featured Courses
            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverToBoxAdapter(
                child: _buildSectionHeader('Featured Courses', () {
                  context.push('/courses');
                }),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.only(left: 16, bottom: 16),
              sliver: SliverToBoxAdapter(
                child: _isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : _buildFeaturedCourses(),
              ),
            ),
            
            // Browse by Year
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverToBoxAdapter(
                child: _buildSectionHeader('Browse by Year', () {
                  context.push('/courses');
                }),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverToBoxAdapter(
                child: _buildYearCategories(),
              ),
            ),
            
            // Bottom padding
            const SliverPadding(padding: EdgeInsets.only(bottom: 20)),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      decoration: const BoxDecoration(
        gradient: AppColors.heroGradient,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(24),
          bottomRight: Radius.circular(24),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  FadeInLeft(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Namaste 🙏',
                          style: AppTypography.bodyMedium.copyWith(
                            color: Colors.white70,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _userName,
                          style: AppTypography.h3.copyWith(
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                  FadeInRight(
                    child: Row(
                      children: [
                        _buildHeaderButton(Icons.search, () {
                          context.push('/courses');
                        }),
                        const SizedBox(width: 8),
                        _buildHeaderButton(Icons.notifications_outlined, () {
                          // Navigate to notifications
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Notifications coming soon!')),
                          );
                        }),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              
              // Dr. Arti Banner
              FadeInUp(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: InkWell(
                    onTap: () => context.push('/about-instructor'),
                    borderRadius: BorderRadius.circular(16),
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image(
                              image: const AssetImage('assets/images/dr-arti-real.jpg'),
                              width: 60,
                              height: 60,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Container(
                                  width: 60,
                                  height: 60,
                                  decoration: BoxDecoration(
                                    color: Colors.white24,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Icon(Icons.person, color: Colors.white),
                                );
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Learn with Dr. Arti Singh',
                                  style: AppTypography.labelLarge.copyWith(
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'BAMS, Medical Officer',
                                  style: AppTypography.bodySmall.copyWith(
                                    color: Colors.white70,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const Icon(
                            Icons.arrow_forward_ios,
                            color: Colors.white70,
                            size: 16,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderButton(IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.15),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: Colors.white, size: 22),
      ),
    );
  }

  Widget _buildStatsGrid() {
    final enrolledCount = _enrolledCourses.length;
    
    final stats = [
      _StatData(icon: Icons.school, value: '$enrolledCount', label: 'Enrolled', color: AppColors.primary),
      _StatData(icon: Icons.access_time, value: '${_recentlyWatched.length}', label: 'In Progress', color: AppColors.info),
      _StatData(icon: Icons.local_fire_department, value: '5', label: 'Day Streak', color: AppColors.warning),
      _StatData(icon: Icons.emoji_events, value: '2', label: 'Badges', color: AppColors.accent),
    ];

    return FadeInUp(
      delay: const Duration(milliseconds: 200),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.6,
        ),
        itemCount: stats.length,
        itemBuilder: (context, index) {
          final stat = stats[index];
          return Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: AppShadows.small,
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: stat.color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(stat.icon, color: stat.color, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        stat.value,
                        style: AppTypography.h3.copyWith(color: stat.color),
                      ),
                      Text(
                        stat.label,
                        style: AppTypography.bodySmall,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSectionHeader(String title, VoidCallback onViewAll) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: AppTypography.h4),
        TextButton(
          onPressed: onViewAll,
          child: Text(
            'View All',
            style: AppTypography.labelLarge.copyWith(color: AppColors.primary),
          ),
        ),
      ],
    );
  }

  Widget _buildRecentlyWatched() {
    if (_recentlyWatched.isEmpty) return const SizedBox.shrink();
    
    final recent = _recentlyWatched.first;
    final video = recent['video'];
    final progress = recent['progress_seconds'] ?? 0;
    final duration = video?['duration'] ?? 1;
    final progressPercent = duration > 0 ? progress / duration : 0.0;

    return FadeInUp(
      delay: const Duration(milliseconds: 300),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: AppShadows.small,
        ),
        child: InkWell(
          onTap: () {
            if (video != null) {
              context.push('/video-player/${video['id']}');
            }
          },
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  width: 100,
                  height: 70,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    image: video?['thumbnail_url'] != null
                        ? DecorationImage(
                            image: NetworkImage(video['thumbnail_url']),
                            fit: BoxFit.cover,
                          )
                        : null,
                  ),
                  child: video?['thumbnail_url'] == null
                      ? const Icon(Icons.play_circle_filled, color: AppColors.primary, size: 32)
                      : null,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      video?['title'] ?? 'Video',
                      style: AppTypography.labelLarge,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      video?['module']?['title'] ?? '',
                      style: AppTypography.bodySmall,
                    ),
                    const SizedBox(height: 8),
                    // Progress bar
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: progressPercent.toDouble(),
                        backgroundColor: Colors.grey.shade200,
                        valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                        minHeight: 6,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEnrolledCourses() {
    return SizedBox(
      height: 160,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _enrolledCourses.length,
        itemBuilder: (context, index) {
          final course = _enrolledCourses[index];
          return FadeInRight(
            delay: Duration(milliseconds: 100 * index),
            child: Container(
              width: 240,
              margin: const EdgeInsets.only(right: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: AppShadows.small,
              ),
              child: InkWell(
                onTap: () => context.push('/course-detail/${course['id']}'),
                borderRadius: BorderRadius.circular(16),
                child: Row(
                  children: [
                    // Thumbnail
                    Container(
                      width: 80,
                      decoration: BoxDecoration(
                        gradient: course['thumbnail_url'] == null
                            ? LinearGradient(
                                colors: [AppColors.primary.withOpacity(0.8), AppColors.primaryDark],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              )
                            : null,
                        image: course['thumbnail_url'] != null
                            ? DecorationImage(
                                image: NetworkImage(course['thumbnail_url']),
                                fit: BoxFit.cover,
                              )
                            : null,
                        borderRadius: const BorderRadius.horizontal(left: Radius.circular(16)),
                      ),
                      child: course['thumbnail_url'] == null
                          ? Center(
                              child: Icon(
                                Icons.menu_book,
                                color: Colors.white.withOpacity(0.8),
                                size: 32,
                              ),
                            )
                          : null,
                    ),
                    // Content
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              course['title'] ?? '',
                              style: AppTypography.labelLarge,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              course['subtitle'] ?? '',
                              style: AppTypography.bodySmall,
                              maxLines: 1,
                            ),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                'Continue',
                                style: AppTypography.bodySmall.copyWith(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFeaturedCourses() {
    if (_featuredCourses.isEmpty) {
      return const Center(
        child: Text('No courses available. Check back soon!'),
      );
    }

    return SizedBox(
      height: 250,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _featuredCourses.length,
        itemBuilder: (context, index) {
          final course = _featuredCourses[index];
          final price = (course['price'] ?? 0).toDouble();
          
          return FadeInRight(
            delay: Duration(milliseconds: 100 * index),
            child: Container(
              width: 180,
              margin: const EdgeInsets.only(right: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: AppShadows.small,
              ),
              child: InkWell(
                onTap: () => context.push('/course-detail/${course['id']}'),
                borderRadius: BorderRadius.circular(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Course thumbnail
                    Container(
                      height: 100,
                      decoration: BoxDecoration(
                        gradient: course['thumbnail_url'] == null
                            ? LinearGradient(
                                colors: [
                                  AppColors.primary.withOpacity(0.8),
                                  AppColors.primaryDark,
                                ],
                              )
                            : null,
                        image: course['thumbnail_url'] != null
                            ? DecorationImage(
                                image: NetworkImage(course['thumbnail_url']),
                                fit: BoxFit.cover,
                              )
                            : null,
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                      ),
                      child: course['thumbnail_url'] == null
                          ? Center(
                              child: Icon(
                                Icons.menu_book,
                                color: Colors.white.withOpacity(0.8),
                                size: 40,
                              ),
                            )
                          : null,
                    ),
                    Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            course['title'] ?? 'Course',
                            style: AppTypography.labelLarge,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            course['subtitle'] ?? '',
                            style: AppTypography.bodySmall,
                            maxLines: 1,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            price > 0 ? '₹${price.toInt()}' : 'Free',
                            style: AppTypography.h4.copyWith(
                              color: price > 0 ? AppColors.primary : Colors.green,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildYearCategories() {
    final years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG Courses'];
    
    return FadeInUp(
      delay: const Duration(milliseconds: 400),
      child: Wrap(
        spacing: 12,
        runSpacing: 12,
        children: years.map((year) {
          return GestureDetector(
            onTap: () => context.push('/courses'),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.primary.withOpacity(0.2)),
              ),
              child: Text(
                year,
                style: AppTypography.labelLarge.copyWith(color: AppColors.primary),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _StatData {
  final IconData icon;
  final String value;
  final String label;
  final Color color;

  _StatData({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });
}
