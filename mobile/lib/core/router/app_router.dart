import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/splash/splash_screen.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/register_screen.dart';
import '../../features/home/presentation/home_screen.dart';
import '../../features/teachings/presentation/teachings_screen.dart';
import '../../features/teachings/presentation/teaching_detail_screen.dart';
import '../../features/audio/presentation/audios_screen.dart';
import '../../features/audio/presentation/audio_detail_screen.dart';
import '../../features/videos/presentation/videos_screen.dart';
import '../../features/videos/presentation/video_detail_screen.dart';
import '../../features/questions/presentation/questions_screen.dart';
import '../../features/questions/presentation/question_detail_screen.dart';
import '../../features/search/presentation/search_screen.dart';
import '../../features/profile/presentation/profile_screen.dart';
import '../../features/settings/presentation/settings_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/splash',
    debugLogDiagnostics: false,
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) =>
            MainScaffold(child: child),
        routes: [
          GoRoute(
            path: '/',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/enseignements',
            builder: (context, state) => const TeachingsScreen(),
          ),
          GoRoute(
            path: '/enseignements/:id',
            builder: (context, state) => TeachingDetailScreen(
                id: state.pathParameters['id']!),
          ),
          GoRoute(
            path: '/audios',
            builder: (context, state) => const AudiosScreen(),
          ),
          GoRoute(
            path: '/audios/:id',
            builder: (context, state) =>
                AudioDetailScreen(id: state.pathParameters['id']!),
          ),
          GoRoute(
            path: '/videos',
            builder: (context, state) => const VideosScreen(),
          ),
          GoRoute(
            path: '/videos/:id',
            builder: (context, state) =>
                VideoDetailScreen(id: state.pathParameters['id']!),
          ),
          GoRoute(
            path: '/questions',
            builder: (context, state) => const QuestionsScreen(),
          ),
          GoRoute(
            path: '/questions/:id',
            builder: (context, state) => QuestionDetailScreen(
                id: state.pathParameters['id']!),
          ),
          GoRoute(
            path: '/recherche',
            builder: (context, state) => const SearchScreen(),
          ),
          GoRoute(
            path: '/profil',
            builder: (context, state) => const ProfileScreen(),
          ),
          GoRoute(
            path: '/parametres',
            builder: (context, state) => const SettingsScreen(),
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64),
            const SizedBox(height: 16),
            Text('Page introuvable: ${state.uri}'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => context.go('/'),
              child: const Text("Retour à l'accueil"),
            ),
          ],
        ),
      ),
    ),
  );
});
