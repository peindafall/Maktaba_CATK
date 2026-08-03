import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../audio/presentation/widgets/mini_player.dart';
import 'home_provider.dart';
import 'widgets/hero_section.dart';
import 'widgets/featured_teachings.dart';
import 'widgets/popular_audios.dart';
import 'widgets/latest_videos.dart';
import 'widgets/categories_grid.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(homeProvider);

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () => ref.read(homeProvider.notifier).loadHome(),
        color: AppColors.primaryGreen,
        child: CustomScrollView(
          slivers: [
            _buildSliverAppBar(context),
            SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const HeroSection(),
                  const SizedBox(height: 8),
                  if (state.isLoading)
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.all(32),
                        child: CircularProgressIndicator(
                            color: AppColors.primaryGreen),
                      ),
                    )
                  else if (state.error != null)
                    _buildError(context, ref, state.error!)
                  else ...[
                    FeaturedTeachings(
                        teachings: state.data?.featuredTeachings ?? []),
                    const SizedBox(height: 24),
                    PopularAudios(audios: state.data?.popularAudios ?? []),
                    const SizedBox(height: 24),
                    LatestVideos(videos: state.data?.latestVideos ?? []),
                    const SizedBox(height: 24),
                    CategoriesGrid(
                        categories: state.data?.categories ?? []),
                    const SizedBox(height: 32),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  SliverAppBar _buildSliverAppBar(BuildContext context) {
    return SliverAppBar(
      floating: true,
      snap: true,
      backgroundColor: AppColors.primaryGreenDark,
      expandedHeight: 0,
      title: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: const Center(
              child: Text(
                'م',
                style: TextStyle(
                  fontFamily: 'Amiri',
                  fontSize: 18,
                  color: AppColors.goldLight,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          const Text(
            'Maktaba CATK',
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
        ],
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.search, color: Colors.white),
          onPressed: () => GoRouter.of(context).go('/recherche'),
        ),
        IconButton(
          icon: const Icon(Icons.settings_outlined, color: Colors.white),
          onPressed: () =>
              GoRouter.of(context).go('/parametres'),
        ),
      ],
    );
  }

  Widget _buildError(
      BuildContext context, WidgetRef ref, String error) {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: Center(
        child: Column(
          children: [
            const Icon(Icons.wifi_off,
                size: 64, color: AppColors.textSecondary),
            const SizedBox(height: 16),
            Text(error,
                style: const TextStyle(color: AppColors.textSecondary)),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () =>
                  ref.read(homeProvider.notifier).loadHome(),
              child: const Text('Réessayer'),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Main Scaffold with Bottom Navigation ─────────────────────────────────

class MainScaffold extends StatefulWidget {
  final Widget child;

  const MainScaffold({super.key, required this.child});

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int _selectedIndex = 0;

  static const _tabs = [
    _NavTab(
        icon: Icons.home_rounded,
        label: 'Accueil',
        path: '/'),
    _NavTab(
        icon: Icons.menu_book_rounded,
        label: 'Enseignements',
        path: '/enseignements'),
    _NavTab(
        icon: Icons.headphones_rounded,
        label: 'Audios',
        path: '/audios'),
    _NavTab(
        icon: Icons.play_circle_rounded,
        label: 'Émissions',
        path: '/videos'),
    _NavTab(
        icon: Icons.question_answer_rounded,
        label: 'Questions',
        path: '/questions'),
  ];

  void _onItemTapped(int index) {
    setState(() => _selectedIndex = index);
    context.go(_tabs[index].path);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const MiniPlayer(),
          BottomNavigationBar(
            currentIndex: _selectedIndex,
            onTap: _onItemTapped,
            type: BottomNavigationBarType.fixed,
            selectedFontSize: 11,
            unselectedFontSize: 11,
            iconSize: 22,
            items: _tabs
                .map((tab) => BottomNavigationBarItem(
                      icon: Icon(tab.icon),
                      label: tab.label,
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }
}

class _NavTab {
  final IconData icon;
  final String label;
  final String path;

  const _NavTab(
      {required this.icon, required this.label, required this.path});
}
