import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../services/live_class_service.dart';
import 'jitsi_meeting_screen.dart';

class LiveClassesScreen extends StatefulWidget {
  const LiveClassesScreen({super.key});

  @override
  State<LiveClassesScreen> createState() => _LiveClassesScreenState();
}

class _LiveClassesScreenState extends State<LiveClassesScreen> {
  final LiveClassService _liveClassService = LiveClassService();
  
  List<Map<String, dynamic>> _upcomingClasses = [];
  List<Map<String, dynamic>> _activeClasses = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadClasses();
  }

  Future<void> _loadClasses() async {
    setState(() => _isLoading = true);
    
    final upcoming = await _liveClassService.getUpcomingClasses();
    final active = await _liveClassService.getActiveClasses();
    
    setState(() {
      _upcomingClasses = upcoming;
      _activeClasses = active;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Live Classes'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadClasses,
              child: _buildContent(),
            ),
    );
  }

  Widget _buildContent() {
    if (_activeClasses.isEmpty && _upcomingClasses.isEmpty) {
      return _buildEmptyState();
    }

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Active Classes (Live Now)
          if (_activeClasses.isNotEmpty) ...[
            _buildSectionHeader('🔴 Live Now', Colors.red),
            const SizedBox(height: 12),
            ..._activeClasses.map((c) => _buildClassCard(c, isActive: true)),
            const SizedBox(height: 24),
          ],
          
          // Upcoming Classes
          if (_upcomingClasses.isNotEmpty) ...[
            _buildSectionHeader('📅 Upcoming Classes', AppColors.primary),
            const SizedBox(height: 12),
            ..._upcomingClasses.map((c) => _buildClassCard(c)),
          ],
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.videocam_off_outlined, size: 80, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            'No live classes scheduled',
            style: TextStyle(fontSize: 18, color: Colors.grey[600]),
          ),
          const SizedBox(height: 8),
          Text(
            'Check back later for new sessions',
            style: TextStyle(fontSize: 14, color: Colors.grey[500]),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, Color color) {
    return Row(
      children: [
        Container(
          width: 4,
          height: 24,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 12),
        Text(
          title,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildClassCard(Map<String, dynamic> classData, {bool isActive = false}) {
    final scheduledAt = DateTime.parse(classData['scheduled_at']);
    final duration = classData['duration_minutes'] ?? 60;
    final course = classData['course'];
    final instructor = classData['instructor'];

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: isActive ? Border.all(color: Colors.red, width: 2) : null,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Thumbnail / Banner
          Container(
            height: 120,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              image: course?['thumbnail_url'] != null
                  ? DecorationImage(
                      image: NetworkImage(course['thumbnail_url']),
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
            child: (classData['thumbnail_url'] != null || course?['thumbnail_url'] != null)
                ? Container(
                    decoration: BoxDecoration(
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                      image: DecorationImage(
                        image: NetworkImage(classData['thumbnail_url'] ?? course['thumbnail_url']),
                        fit: BoxFit.cover,
                      ),
                    ),
                  )
                : Center(
                    child: Icon(
                      Icons.videocam,
                      size: 48,
                      color: AppColors.primary.withOpacity(0.5),
                    ),
                  ),
          ),
          
          // Content
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Title
                Text(
                  classData['title'] ?? 'Live Class',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                
                // Course name
                if (course != null)
                  Row(
                    children: [
                      Icon(Icons.school_outlined, size: 16, color: Colors.grey[600]),
                      const SizedBox(width: 6),
                      Text(
                        course['title'] ?? 'General',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                    ],
                  ),
                const SizedBox(height: 6),
                
                // Time and Duration
                Row(
                  children: [
                    Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                    const SizedBox(width: 6),
                    Text(
                      DateFormat('MMM d, yyyy • h:mm a').format(scheduledAt),
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '${duration}min',
                        style: TextStyle(fontSize: 12, color: Colors.grey[700]),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                
                // Instructor
                if (instructor != null)
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 12,
                        backgroundImage: instructor['avatar_url'] != null
                            ? NetworkImage(instructor['avatar_url'])
                            : null,
                        child: instructor['avatar_url'] == null
                            ? const Icon(Icons.person, size: 16)
                            : null,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        instructor['full_name'] ?? 'Instructor',
                        style: TextStyle(color: Colors.grey[700]),
                      ),
                    ],
                  ),
                const SizedBox(height: 16),
                
                // Join Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: isActive || _isWithinJoinWindow(scheduledAt)
                        ? () => _joinClass(classData)
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isActive ? Colors.red : AppColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    icon: Icon(isActive ? Icons.videocam : Icons.login),
                    label: Text(
                      isActive
                          ? 'Join Now - LIVE'
                          : _isWithinJoinWindow(scheduledAt)
                              ? 'Join Class'
                              : 'Available ${_getTimeUntil(scheduledAt)}',
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  bool _isWithinJoinWindow(DateTime scheduledAt) {
    final now = DateTime.now();
    final joinStart = scheduledAt.subtract(const Duration(minutes: 10));
    return now.isAfter(joinStart);
  }

  String _getTimeUntil(DateTime scheduledAt) {
    final now = DateTime.now();
    final diff = scheduledAt.difference(now);
    
    if (diff.inDays > 0) {
      return 'in ${diff.inDays}d';
    } else if (diff.inHours > 0) {
      return 'in ${diff.inHours}h';
    } else if (diff.inMinutes > 0) {
      return 'in ${diff.inMinutes}m';
    }
    return 'soon';
  }

  void _joinClass(Map<String, dynamic> classData) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => JitsiMeetingScreen(
          roomName: classData['jitsi_room_id'] ?? '',
          title: classData['title'] ?? 'Live Class',
        ),
      ),
    );
  }
}
