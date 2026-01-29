import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/onboarding/screens/onboarding_screen.dart';
import '../features/auth/screens/login_screen.dart';
import '../features/auth/screens/signup_screen.dart';
import '../features/auth/screens/otp_screen.dart';
import '../features/home/screens/main_shell.dart';
import '../features/home/screens/home_screen.dart';
import '../features/courses/screens/courses_screen.dart';
import '../features/courses/screens/course_detail_screen.dart';
import '../features/learning/screens/learning_screen.dart';
import '../features/profile/screens/profile_screen.dart';
import '../features/profile/screens/about_instructor_screen.dart';
import '../features/video/screens/video_player_screen.dart';
import '../features/payment/screens/checkout_screen.dart';
import '../features/quiz/screens/quiz_screen.dart';
import '../features/live_class/screens/live_classes_screen.dart';
import '../features/live_class/screens/jitsi_meeting_screen.dart';
import '../features/notifications/screens/notifications_screen.dart';

class AppRouter {
  static final router = GoRouter(
    initialLocation: '/onboarding',
    routes: [
      // Onboarding
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      
      // Auth Routes
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: '/otp',
        builder: (context, state) {
          final phone = state.extra as String? ?? '';
          return OtpScreen(phone: phone);
        },
      ),
      
      // Main App Shell with Bottom Navigation
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: '/home',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/courses',
            builder: (context, state) => const CoursesScreen(),
          ),
          GoRoute(
            path: '/learning',
            builder: (context, state) => const LearningScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),
      
      // Course Detail (both paths for compatibility)
      GoRoute(
        path: '/course/:id',
        builder: (context, state) {
          final courseId = state.pathParameters['id'] ?? '';
          return CourseDetailScreen(courseId: courseId);
        },
      ),
      GoRoute(
        path: '/course-detail/:id',
        builder: (context, state) {
          final courseId = state.pathParameters['id'] ?? '';
          return CourseDetailScreen(courseId: courseId);
        },
      ),
      
      // Checkout / Payment
      GoRoute(
        path: '/checkout/:courseId',
        builder: (context, state) {
          final courseId = state.pathParameters['courseId'] ?? '';
          return CheckoutScreen(courseId: courseId);
        },
      ),
      
      // Video Player
      GoRoute(
        path: '/video-player/:videoId',
        builder: (context, state) {
          final videoId = state.pathParameters['videoId'] ?? '';
          return VideoPlayerScreen(courseId: '', lessonId: videoId);
        },
      ),
      GoRoute(
        path: '/video/:courseId/:lessonId',
        builder: (context, state) {
          final courseId = state.pathParameters['courseId'] ?? '';
          final lessonId = state.pathParameters['lessonId'] ?? '';
          return VideoPlayerScreen(courseId: courseId, lessonId: lessonId);
        },
      ),
      
      // Quiz
      GoRoute(
        path: '/quiz/:videoId',
        builder: (context, state) {
          final videoId = state.pathParameters['videoId'] ?? '';
          return QuizScreen(videoId: videoId);
        },
      ),
      
      // Live Classes
      GoRoute(
        path: '/live-classes',
        builder: (context, state) => const LiveClassesScreen(),
      ),
      GoRoute(
        path: '/live-meeting/:roomName',
        builder: (context, state) {
          final roomName = state.pathParameters['roomName'] ?? '';
          final title = state.uri.queryParameters['title'] ?? 'Live Class';
          return JitsiMeetingScreen(roomName: roomName, title: title);
        },
      ),
      
      // Notifications
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const NotificationsScreen(),
      ),
      
      // About Instructor
      GoRoute(
        path: '/about-instructor',
        builder: (context, state) => const AboutInstructorScreen(),
      ),
    ],
  );
}
