import 'dart:io';
import 'dart:isolate';
import 'dart:ui';
import 'package:flutter_downloader/flutter_downloader.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';

class DownloadService {
  static const String _portName = 'downloader_send_port';

  static Future<void> init() async {
    await FlutterDownloader.initialize(
      debug: true, 
      ignoreSsl: true, 
    );
    
    // Register port for background updates
    // For simplicity in V1 we might just poll or rely on basic callbacks, 
    // but setting up the port is best practice.
  }

  static Future<bool> _checkPermission() async {
    if (Platform.isIOS) return true;

    final status = await Permission.storage.status;
    if (status.isGranted) return true;

    final result = await Permission.storage.request();
    return result.isGranted;
  }

  static Future<String?> startDownload({
    required String url,
    required String fileName,
  }) async {
    final hasPermission = await _checkPermission();
    if (!hasPermission) {
      print('Permission denied');
      return null;
    }

    final directory = await _getDownloadDirectory();
    if (directory == null) return null;

    final taskId = await FlutterDownloader.enqueue(
      url: url,
      savedDir: directory,
      fileName: fileName,
      showNotification: true,
      openFileFromNotification: true,
      saveInPublicStorage: true, // Save to public downloads folder if possible
    );

    return taskId;
  }

  static Future<String?> _getDownloadDirectory() async {
    try {
      if (Platform.isAndroid) {
        // Use external storage for visibility
        final directory = Directory('/storage/emulated/0/Download');
        if (await directory.exists()) {
          return directory.path;
        }
        return (await getExternalStorageDirectory())?.path;
      }
      return (await getApplicationDocumentsDirectory()).path;
    } catch (e) {
      print('Error getting directory: $e');
      return null;
    }
  }

  static Future<void> openFile(String taskId) async {
    await FlutterDownloader.open(taskId: taskId);
  }
}
