import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../../../core/theme/app_theme.dart';

class JitsiMeetingScreen extends StatefulWidget {
  final String roomName;
  final String title;

  const JitsiMeetingScreen({
    super.key,
    required this.roomName,
    required this.title,
  });

  @override
  State<JitsiMeetingScreen> createState() => _JitsiMeetingScreenState();
}

class _JitsiMeetingScreenState extends State<JitsiMeetingScreen> {
  late WebViewController _controller;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initWebView();
  }

  void _initWebView() {
    final user = Supabase.instance.client.auth.currentUser;
    final displayName = user?.userMetadata?['full_name'] ?? user?.email ?? 'Student';
    final email = user?.email ?? '';

    // Build Jitsi URL with user info
    final jitsiUrl = _buildJitsiUrl(
      roomId: widget.roomName,
      displayName: displayName,
      email: email,
    );

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            setState(() => _isLoading = true);
          },
          onPageFinished: (String url) {
            setState(() => _isLoading = false);
          },
          onWebResourceError: (WebResourceError error) {
            print('WebView error: ${error.description}');
          },
        ),
      )
      ..loadRequest(Uri.parse(jitsiUrl));
  }

  String _buildJitsiUrl({
    required String roomId,
    required String displayName,
    required String email,
  }) {
    // Using Jitsi public server - replace with your own if needed
    final baseUrl = 'https://meet.jit.si/$roomId';
    
    // Jitsi URL parameters
    final params = {
      'userInfo.displayName': displayName,
      'userInfo.email': email,
      'config.prejoinPageEnabled': 'false',
      'config.startWithAudioMuted': 'true',
      'config.startWithVideoMuted': 'false',
      'interfaceConfig.SHOW_JITSI_WATERMARK': 'false',
      'interfaceConfig.SHOW_WATERMARK_FOR_GUESTS': 'false',
      'interfaceConfig.TOOLBAR_BUTTONS': '["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","chat","recording","livestreaming","etherpad","sharedvideo","settings","raisehand","videoquality","filmstrip","feedback","stats","shortcuts","tileview","select-background","download","help","mute-everyone","security"]',
    };

    final queryString = params.entries
        .map((e) => '${e.key}=${Uri.encodeComponent(e.value)}')
        .join('&');

    return '$baseUrl#$queryString';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => _controller.reload(),
          ),
          IconButton(
            icon: const Icon(Icons.fullscreen),
            onPressed: () {
              // Toggle fullscreen if needed
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          WebViewWidget(controller: _controller),
          if (_isLoading)
            Container(
              color: Colors.black,
              child: const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(color: Colors.white),
                    SizedBox(height: 16),
                    Text(
                      'Connecting to live class...',
                      style: TextStyle(color: Colors.white, fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        color: Colors.black,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildControlButton(
              icon: Icons.mic_off,
              label: 'Mute',
              onPressed: () {
                // Toggle mute via JavaScript injection
                _controller.runJavaScript('APP.conference._room.setLocalAudioMute(!APP.conference._room.isLocalAudioMuted())');
              },
            ),
            _buildControlButton(
              icon: Icons.videocam_off,
              label: 'Video',
              onPressed: () {
                _controller.runJavaScript('APP.conference._room.setLocalVideoMute(!APP.conference._room.isLocalVideoMuted())');
              },
            ),
            _buildControlButton(
              icon: Icons.chat_bubble_outline,
              label: 'Chat',
              onPressed: () {
                _controller.runJavaScript('APP.UI.toggleChat()');
              },
            ),
            _buildControlButton(
              icon: Icons.call_end,
              label: 'Leave',
              color: Colors.red,
              onPressed: () {
                _showLeaveDialog();
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildControlButton({
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
    Color color = Colors.white,
  }) {
    return InkWell(
      onTap: onPressed,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color == Colors.red ? Colors.red : Colors.grey[800],
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          const SizedBox(height: 4),
          Text(label, style: TextStyle(color: color, fontSize: 12)),
        ],
      ),
    );
  }

  void _showLeaveDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Leave Class?'),
        content: const Text('Are you sure you want to leave this live class?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              Navigator.pop(context); // Close meeting screen
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Leave'),
          ),
        ],
      ),
    );
  }
}
