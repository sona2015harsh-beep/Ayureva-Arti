import 'package:flutter/material.dart';
import 'package:flutter_downloader/flutter_downloader.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/services/download_service.dart';
import 'package:animate_do/animate_do.dart';

class MyDownloadsScreen extends StatefulWidget {
  const MyDownloadsScreen({super.key});

  @override
  State<MyDownloadsScreen> createState() => _MyDownloadsScreenState();
}

class _MyDownloadsScreenState extends State<MyDownloadsScreen> {
  List<DownloadTask> _tasks = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadTasks();
  }

  Future<void> _loadTasks() async {
    setState(() => _isLoading = true);
    final tasks = await DownloadService.getDownloadedTasks();
    if (mounted) {
      setState(() {
        _tasks = tasks ?? [];
        _isLoading = false;
      });
    }
  }

  Future<void> _openTask(DownloadTask task) async {
    if (task.status == DownloadTaskStatus.complete) {
      await DownloadService.openFile(task.taskId);
    } else if (task.status == DownloadTaskStatus.failed) {
      // Retry logic could go here, for now just show error
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Download failed. Please try again.')),
      );
    }
  }

  Future<void> _deleteTask(DownloadTask task) async {
    await DownloadService.removeTask(task.taskId);
    _loadTasks();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Downloads'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: AppTypography.h3.copyWith(color: AppColors.textPrimary),
        iconTheme: const IconThemeData(color: AppColors.textPrimary),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : RefreshIndicator(
              onRefresh: _loadTasks,
              color: AppColors.primary,
              child: _tasks.isEmpty
                  ? _buildEmptyState()
                  : ListView.builder(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      itemCount: _tasks.length,
                      itemBuilder: (context, index) {
                        final task = _tasks[index];
                        return FadeInUp(
                          delay: Duration(milliseconds: 50 * index),
                          child: _buildDownloadItem(task),
                        );
                      },
                    ),
            ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.cloud_off, size: 64, color: AppColors.textSecondary.withOpacity(0.5)),
          const SizedBox(height: AppSpacing.md),
          Text(
            'No downloads yet',
            style: AppTypography.h3.copyWith(color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Downloaded videos will appear here',
            style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildDownloadItem(DownloadTask task) {
    IconData icon;
    Color color;
    String statusText;

    switch (task.status) {
      case DownloadTaskStatus.complete:
        icon = Icons.play_circle_fill;
        color = AppColors.success;
        statusText = 'Ready to play';
        break;
      case DownloadTaskStatus.running:
        icon = Icons.downloading;
        color = AppColors.primary;
        statusText = 'Downloading... ${task.progress}%';
        break;
      case DownloadTaskStatus.failed:
        icon = Icons.error;
        color = AppColors.error;
        statusText = 'Failed';
        break;
      case DownloadTaskStatus.paused:
        icon = Icons.pause_circle;
        color = Colors.orange;
        statusText = 'Paused';
        break;
      default:
        icon = Icons.schedule;
        color = Colors.grey;
        statusText = 'Pending';
    }

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.md),
        boxShadow: AppShadows.small,
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Icon(icon, color: color, size: 32),
        title: Text(
          task.filename ?? 'Unknown File',
          style: AppTypography.bodyLarge.copyWith(fontWeight: FontWeight.bold),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(statusText, style: AppTypography.bodySmall.copyWith(color: color)),
            if (task.status == DownloadTaskStatus.running)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: LinearProgressIndicator(
                  value: task.progress / 100,
                  backgroundColor: AppColors.surfaceVariant,
                  valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                  minHeight: 4,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(Icons.delete_outline, color: Colors.grey),
          onPressed: () => _deleteTask(task),
        ),
        onTap: () => _openTask(task),
      ),
    );
  }
}
