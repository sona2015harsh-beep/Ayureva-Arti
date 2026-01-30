import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../services/course_service.dart';

class CourseDetailScreen extends StatefulWidget {
  final String courseId;
  
  const CourseDetailScreen({super.key, required this.courseId});

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  final CourseService _courseService = CourseService();
  
  bool _isExpanded = false;
  bool _isLoading = true;
  bool _isEnrolled = false;
  Map<String, dynamic>? _course;

  @override
  void initState() {
    super.initState();
    _loadCourse();
  }

  Future<void> _loadCourse() async {
    setState(() => _isLoading = true);
    
    final course = await _courseService.getCourseDetails(widget.courseId);
    final isEnrolled = await _courseService.isEnrolled(widget.courseId);
    
    setState(() {
      _course = course;
      _isEnrolled = isEnrolled;
      _isLoading = false;
    });
  }

  Future<void> _enroll() async {
    final price = (_course?['price'] ?? 0).toDouble();
    
    if (price > 0) {
      // Navigate to checkout for paid courses
      context.push('/checkout/${widget.courseId}');
    } else {
      // Free course - direct enroll
      final success = await _courseService.enrollFreeCourse(widget.courseId);
      if (success) {
        setState(() => _isEnrolled = true);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Enrolled successfully!')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        backgroundColor: AppColors.background,
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_course == null) {
      return Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(title: const Text('Course Not Found')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64, color: Colors.grey),
              const SizedBox(height: 16),
              const Text('Course not found'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Go Back'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // Hero Header
          SliverToBoxAdapter(
            child: _buildHeader(context),
          ),
          
          // Course Info
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Quick Stats
                FadeInUp(
                  child: _buildQuickStats(),
                ),
                
                const SizedBox(height: 20),
                
                // Description
                FadeInUp(
                  delay: const Duration(milliseconds: 100),
                  child: _buildDescription(),
                ),
                
                const SizedBox(height: 20),
                
                // Curriculum (Modules & Videos)
                FadeInUp(
                  delay: const Duration(milliseconds: 200),
                  child: _buildCurriculum(),
                ),
                
                const SizedBox(height: 20),
                
                // Instructor Preview
                FadeInUp(
                  delay: const Duration(milliseconds: 300),
                  child: _buildInstructorPreview(),
                ),
                
                // Bottom padding for floating button
                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomBar(),
    );
  }

  Widget _buildHeader(BuildContext context) {
    final thumbnailUrl = _course!['thumbnail_url'];
    final subtitle = _course!['subtitle'] ?? '';
    final rating = (_course!['rating'] ?? 4.5).toDouble();
    
    return Container(
      height: 280,
      decoration: BoxDecoration(
        gradient: thumbnailUrl == null ? AppColors.heroGradient : null,
        image: thumbnailUrl != null
            ? DecorationImage(
                image: NetworkImage(thumbnailUrl),
                fit: BoxFit.cover,
                colorFilter: ColorFilter.mode(
                  Colors.black.withOpacity(0.4),
                  BlendMode.darken,
                ),
              )
            : null,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // App Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
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
                        icon: const Icon(Icons.share_outlined, color: Colors.white),
                        onPressed: () {},
                      ),
                      IconButton(
                        icon: const Icon(Icons.bookmark_outline, color: Colors.white),
                        onPressed: () {},
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            // Course Info
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: FadeInLeft(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Category badge
                      if (subtitle.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            subtitle,
                            style: const TextStyle(color: Colors.white, fontSize: 12),
                          ),
                        ),
                      
                      const SizedBox(height: 12),
                      
                      Text(
                        _course!['title'] ?? 'Course',
                        style: AppTypography.h2.copyWith(color: Colors.white),
                      ),
                      
                      const SizedBox(height: 8),
                      
                      Text(
                        _course!['description']?.split('\n').first ?? '',
                        style: AppTypography.bodyMedium.copyWith(color: Colors.white70),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      
                      const SizedBox(height: 12),
                      
                      // Rating
                      Row(
                        children: [
                          const Icon(Icons.star, color: AppColors.warning, size: 18),
                          const SizedBox(width: 4),
                          Text(
                            rating.toStringAsFixed(1),
                            style: AppTypography.labelLarge.copyWith(color: Colors.white),
                          ),
                          if (_isEnrolled) ...[
                            const SizedBox(width: 16),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.green,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Text(
                                'ENROLLED',
                                style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickStats() {
    final modules = _course!['modules'] as List? ?? [];
    int totalVideos = 0;
    int totalDuration = 0;
    
    for (var module in modules) {
      final videos = module['videos'] as List? ?? [];
      totalVideos += videos.length;
      for (var video in videos) {
        totalDuration += (video['duration'] ?? 0) as int;
      }
    }
    
    final durationStr = totalDuration > 3600
        ? '${(totalDuration / 3600).toStringAsFixed(1)}h'
        : '${(totalDuration / 60).ceil()}m';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadows.small,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatItem(Icons.folder_outlined, '${modules.length}', 'Modules'),
          _buildStatDivider(),
          _buildStatItem(Icons.play_circle_outline, '$totalVideos', 'Videos'),
          _buildStatDivider(),
          _buildStatItem(Icons.access_time, durationStr, 'Duration'),
        ],
      ),
    );
  }

  Widget _buildStatItem(IconData icon, String value, String label) {
    return Column(
      children: [
        Icon(icon, color: AppColors.primary, size: 24),
        const SizedBox(height: 8),
        Text(value, style: AppTypography.labelLarge),
        Text(label, style: AppTypography.bodySmall),
      ],
    );
  }

  Widget _buildStatDivider() {
    return Container(
      width: 1,
      height: 50,
      color: Colors.grey.shade200,
    );
  }

  Widget _buildDescription() {
    final description = _course!['description'] ?? 'No description available.';
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadows.small,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('About This Course', style: AppTypography.h4),
          const SizedBox(height: 12),
          Text(
            description,
            style: AppTypography.bodyMedium.copyWith(height: 1.6),
            maxLines: _isExpanded ? null : 4,
            overflow: _isExpanded ? null : TextOverflow.ellipsis,
          ),
          if (description.length > 200)
            TextButton(
              onPressed: () => setState(() => _isExpanded = !_isExpanded),
              child: Text(_isExpanded ? 'Show Less' : 'Read More'),
            ),
        ],
      ),
    );
  }

  Widget _buildCurriculum() {
    final modules = _course!['modules'] as List? ?? [];
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadows.small,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Curriculum', style: AppTypography.h4),
              Text(
                '${modules.length} modules',
                style: AppTypography.bodySmall,
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (modules.isEmpty)
            const Text('No content available yet.')
          else
            ...modules.asMap().entries.map((entry) {
              final index = entry.key;
              final module = entry.value;
              final videos = module['videos'] as List? ?? [];
              
              return _buildModuleItem(index + 1, module, videos);
            }),
        ],
      ),
    );
  }

  Widget _buildModuleItem(int index, Map<String, dynamic> module, List videos) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(12),
      ),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        childrenPadding: const EdgeInsets.only(bottom: 8),
        leading: Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Center(
            child: Text(
              '$index',
              style: TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        title: Text(module['title'] ?? 'Module $index', style: AppTypography.labelLarge),
        subtitle: Text(
          '${videos.length} videos',
          style: AppTypography.bodySmall,
        ),
        children: videos.map<Widget>((video) {
          final isFreePreview = video['is_free_preview'] == true;
          final duration = video['duration'] ?? 0;
          final durationStr = duration > 60
              ? '${(duration / 60).ceil()}m'
              : '${duration}s';
              
          // Check for Scheduled/Drip Content
          final unlockAtStr = video['unlock_at'];
          DateTime? unlockAt;
          bool isLockedBySchedule = false;
          
          if (unlockAtStr != null) {
             unlockAt = DateTime.tryParse(unlockAtStr)?.toLocal();
             if (unlockAt != null && unlockAt.isAfter(DateTime.now())) {
               isLockedBySchedule = true;
             }
          }
          
          final isAccessible = (_isEnrolled || isFreePreview) && !isLockedBySchedule;
          
          return ListTile(
            leading: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isAccessible
                    ? AppColors.primary.withOpacity(0.1)
                    : Colors.grey.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                isAccessible
                    ? Icons.play_circle_outline
                    : (isLockedBySchedule ? Icons.schedule : Icons.lock_outline),
                color: isAccessible
                    ? AppColors.primary
                    : Colors.grey,
                size: 20,
              ),
            ),
            title: Text(
              video['title'] ?? 'Video',
              style: AppTypography.bodyMedium.copyWith(
                color: isAccessible ? AppColors.textPrimary : AppColors.textMuted,
              ),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(durationStr, style: AppTypography.bodySmall),
                    if (isFreePreview && !_isEnrolled) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text(
                          'FREE PREVIEW',
                          style: TextStyle(color: Colors.green, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ],
                ),
                if (isLockedBySchedule && unlockAt != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      'Available: ${_formatDate(unlockAt)}',
                      style: const TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.w500),
                    ),
                  ),
              ],
            ),
            trailing: isAccessible 
                ? const Icon(Icons.chevron_right, size: 20) 
                : const Icon(Icons.lock, size: 16, color: Colors.grey),
            onTap: () {
              if (isAccessible) {
                context.push('/video-player/${video['id']}');
              } else {
                if (isLockedBySchedule) {
                   ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('This class unlocks on ${_formatDate(unlockAt!)}')),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Enroll to access this video')),
                  );
                }
              }
            },
          );
        }).toList(),
      ),
    );
  }

  String _formatDate(DateTime date) {
    // Simple formatter since we might not have intl package handy in this file context, 
    // or to keep it simple. ideally use DateFormat.
    return '${date.day}/${date.month} ${_TwoDigits(date.hour)}:${_TwoDigits(date.minute)}';
  }
  
  String _TwoDigits(int n) => n >= 10 ? '$n' : '0$n';


  Widget _buildInstructorPreview() {
    final instructor = _course!['instructor'];
    final instructorName = instructor?['full_name'] ?? 'Instructor';
    final avatarUrl = instructor?['avatar_url'];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppShadows.small,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Your Instructor', style: AppTypography.h4),
          const SizedBox(height: 16),
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: avatarUrl != null
                    ? Image.network(
                        avatarUrl,
                        width: 60,
                        height: 60,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => _buildDefaultAvatar(),
                      )
                    : _buildDefaultAvatar(),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(instructorName, style: AppTypography.labelLarge),
                    const SizedBox(height: 4),
                    Text(instructor?['email'] ?? '', style: AppTypography.bodySmall),
                  ],
                ),
              ),
              TextButton(
                onPressed: () {
                  context.push('/about-instructor');
                },
                child: const Text('View'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDefaultAvatar() {
    return Container(
      width: 60,
      height: 60,
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Icon(Icons.person, color: AppColors.primary),
    );
  }

  Widget _buildBottomBar() {
    final price = (_course?['price'] ?? 0).toDouble();
    
    return Container(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 16,
        bottom: MediaQuery.of(context).padding.bottom + 16,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        children: [
          // Price
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                price > 0 ? '₹${price.toInt()}' : 'Free',
                style: AppTypography.h3.copyWith(
                  color: price > 0 ? AppColors.primary : Colors.green,
                ),
              ),
            ],
          ),
          const SizedBox(width: 24),
          
          // Enroll/Continue Button
          Expanded(
            child: ElevatedButton(
              onPressed: _isEnrolled
                  ? () {
                      // Navigate to first video
                      final modules = _course!['modules'] as List? ?? [];
                      if (modules.isNotEmpty) {
                        final firstModule = modules.first;
                        final videos = firstModule['videos'] as List? ?? [];
                        if (videos.isNotEmpty) {
                          context.push('/video-player/${videos.first['id']}');
                        }
                      }
                    }
                  : _enroll,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: _isEnrolled ? Colors.green : AppColors.primary,
              ),
              child: Text(_isEnrolled ? 'Continue Learning' : (price > 0 ? 'Enroll Now' : 'Start Free')),
            ),
          ),
        ],
      ),
    );
  }
}
