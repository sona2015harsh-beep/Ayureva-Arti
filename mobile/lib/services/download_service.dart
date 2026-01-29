import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';
import 'package:dio/dio.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class DownloadService extends ChangeNotifier {
  final SupabaseClient _supabase = Supabase.instance.client;
  final Dio _dio = Dio();
  
  // Track download progress: videoId -> progress (0.0 - 1.0)
  final Map<String, double> _downloadProgress = {};
  
  // Track downloaded videos
  final Set<String> _downloadedVideoIds = {};
  
  // Currently downloading
  final Set<String> _activeDownloads = {};

  Map<String, double> get downloadProgress => Map.unmodifiable(_downloadProgress);
  Set<String> get downloadedVideoIds => Set.unmodifiable(_downloadedVideoIds);
  bool isDownloading(String videoId) => _activeDownloads.contains(videoId);
  bool isDownloaded(String videoId) => _downloadedVideoIds.contains(videoId);

  DownloadService() {
    _loadDownloadedVideos();
  }

  Future<void> _loadDownloadedVideos() async {
    if (kIsWeb) return; // Downloads not supported on web
    
    try {
      final dir = await _getDownloadDirectory();
      if (await dir.exists()) {
        final files = dir.listSync();
        for (var file in files) {
          if (file is File && file.path.endsWith('.mp4')) {
            final videoId = file.path.split('/').last.replaceAll('.mp4', '');
            _downloadedVideoIds.add(videoId);
          }
        }
        notifyListeners();
      }
    } catch (e) {
      print('Error loading downloaded videos: $e');
    }
  }

  Future<Directory> _getDownloadDirectory() async {
    final appDir = await getApplicationDocumentsDirectory();
    final downloadDir = Directory('${appDir.path}/ayureva_videos');
    if (!await downloadDir.exists()) {
      await downloadDir.create(recursive: true);
    }
    return downloadDir;
  }

  // Get local video path if downloaded
  Future<String?> getLocalVideoPath(String videoId) async {
    if (kIsWeb) return null;
    
    final dir = await _getDownloadDirectory();
    final file = File('${dir.path}/$videoId.mp4');
    if (await file.exists()) {
      return file.path;
    }
    return null;
  }

  // Download video
  Future<bool> downloadVideo({
    required String videoId,
    required String videoUrl,
    Function(double)? onProgress,
  }) async {
    if (kIsWeb) {
      print('Downloads not supported on web');
      return false;
    }

    if (_activeDownloads.contains(videoId)) {
      print('Already downloading this video');
      return false;
    }

    try {
      _activeDownloads.add(videoId);
      _downloadProgress[videoId] = 0.0;
      notifyListeners();

      final dir = await _getDownloadDirectory();
      final filePath = '${dir.path}/$videoId.mp4';

      // Get signed URL if using Supabase Storage
      String downloadUrl = videoUrl;
      if (videoUrl.contains('supabase')) {
        // Generate signed URL for private bucket
        final signedUrl = await _supabase.storage
            .from('videos')
            .createSignedUrl(videoUrl.split('/videos/').last, 3600); // 1 hour validity
        downloadUrl = signedUrl;
      }

      await _dio.download(
        downloadUrl,
        filePath,
        onReceiveProgress: (received, total) {
          if (total != -1) {
            final progress = received / total;
            _downloadProgress[videoId] = progress;
            onProgress?.call(progress);
            notifyListeners();
          }
        },
      );

      _downloadedVideoIds.add(videoId);
      _activeDownloads.remove(videoId);
      _downloadProgress.remove(videoId);
      notifyListeners();
      
      return true;
    } catch (e) {
      print('Error downloading video: $e');
      _activeDownloads.remove(videoId);
      _downloadProgress.remove(videoId);
      notifyListeners();
      return false;
    }
  }

  // Delete downloaded video
  Future<bool> deleteVideo(String videoId) async {
    if (kIsWeb) return false;

    try {
      final path = await getLocalVideoPath(videoId);
      if (path != null) {
        await File(path).delete();
        _downloadedVideoIds.remove(videoId);
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Error deleting video: $e');
      return false;
    }
  }

  // Get total download size
  Future<int> getTotalDownloadSize() async {
    if (kIsWeb) return 0;

    try {
      final dir = await _getDownloadDirectory();
      int totalSize = 0;
      final files = dir.listSync();
      for (var file in files) {
        if (file is File) {
          totalSize += await file.length();
        }
      }
      return totalSize;
    } catch (e) {
      return 0;
    }
  }

  // Clear all downloads
  Future<void> clearAllDownloads() async {
    if (kIsWeb) return;

    try {
      final dir = await _getDownloadDirectory();
      if (await dir.exists()) {
        await dir.delete(recursive: true);
      }
      _downloadedVideoIds.clear();
      notifyListeners();
    } catch (e) {
      print('Error clearing downloads: $e');
    }
  }
}
