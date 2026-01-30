import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'core/services/api_service.dart';
import 'routes/app_router.dart';
import 'core/config/env.dart';
import 'core/services/supabase_service.dart';
import 'core/services/download_service.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );

  runApp(const AppLaunchWrapper());
}

class AppLaunchWrapper extends StatefulWidget {
  const AppLaunchWrapper({super.key});

  @override
  State<AppLaunchWrapper> createState() => _AppLaunchWrapperState();
}

class _AppLaunchWrapperState extends State<AppLaunchWrapper> {
  bool _initialized = false;
  Object? _error;

  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    try {
      await Env.load();
      await SupabaseService.initialize();
      await DownloadService.init(); // Initialize Downloader
      if (mounted) {
        setState(() {
          _initialized = true;
        });
      }
    } catch (e) {
      print("FATAL INIT ERROR: $e");
      if (mounted) {
        setState(() {
          _error = e;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_error != null) {
      return MaterialApp(
        home: Scaffold(
          body: Center(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 60, color: Colors.red),
                  const SizedBox(height: 16),
                  const Text("App Initialization Failed", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(_error.toString(), textAlign: TextAlign.center, style: const TextStyle(color: Colors.red)),
                ],
              ),
            ),
          ),
        ),
      );
    }

    if (!_initialized) {
      return MaterialApp(
        home: Scaffold(
          backgroundColor: Colors.white,
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo
                Image.asset(
                  'assets/images/logo_full.png',
                  width: 200,
                  fit: BoxFit.contain,
                ),
                const SizedBox(height: 24),
                const CircularProgressIndicator(color: Color(0xFF1B5E20)),
              ],
            ),
          ),
        ),
      );
    }

    return MultiProvider(
      providers: [
        Provider<ApiService>(create: (_) => ApiService()),
      ],
      child: MaterialApp.router(
        title: 'Ayureva',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        routerConfig: AppRouter.router,
      ),
    );
  }
}
