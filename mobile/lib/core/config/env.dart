import 'package:flutter_dotenv/flutter_dotenv.dart';

class Env {
  static String get supabaseUrl => dotenv.env['SUPABASE_URL'] ?? '';
  static String get supabaseAnonKey => dotenv.env['SUPABASE_ANON_KEY'] ?? '';
  static String get jitsiServerUrl => dotenv.env['JITSI_SERVER_URL'] ?? 'https://meet.jit.si';

  static Future<void> load() async {
    await dotenv.load(fileName: ".env");
  }
}
