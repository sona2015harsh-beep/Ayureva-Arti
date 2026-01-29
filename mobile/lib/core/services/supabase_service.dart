import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/env.dart';

class SupabaseService {
  static final SupabaseService _instance = SupabaseService._internal();
  factory SupabaseService() => _instance;
  SupabaseService._internal();

  static SupabaseClient get client => Supabase.instance.client;
  static GoTrueClient get auth => client.auth;

  static Future<void> initialize() async {
    if (Env.supabaseUrl.isEmpty || Env.supabaseAnonKey.isEmpty || Env.supabaseUrl.contains('YOUR_SUPABASE_URL')) {
      print('⚠️ Supabase credentials not found in env. Initialization skipped/mocked.');
      // We rely on error handling in UI if they try to login
      return;
    }

    await Supabase.initialize(
      url: Env.supabaseUrl,
      anonKey: Env.supabaseAnonKey,
    );
    print('✅ Supabase Initialized');
  }

  // Auth Helpers
  Future<AuthResponse> signUp({required String email, required String password, required String fullName}) async {
    return await auth.signUp(
      email: email,
      password: password,
      data: {'full_name': fullName},
    );
  }

  Future<AuthResponse> signIn({required String email, required String password}) async {
    return await auth.signInWithPassword(
      email: email,
      password: password,
    );
  }

  Future<void> signOut() async {
    await auth.signOut();
  }

  Future<void> resetPasswordForEmail({required String email}) async {
    await auth.resetPasswordForEmail(email);
  }

  // Session Helper
  Session? get currentSession => auth.currentSession;
  User? get currentUser => auth.currentUser;
}
