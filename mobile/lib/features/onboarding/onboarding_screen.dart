import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/api_constants.dart';
import '../../core/widgets/catk_button.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _controller = PageController();
  int _currentPage = 0;

  final List<_OnboardingPage> _pages = const [
    _OnboardingPage(
      icon: Icons.menu_book_rounded,
      title: 'Bibliothèque Numérique',
      subtitle:
          'Accédez à tous les enseignements du Professeur Cheikh Ahmet Tidiane KEBE en un seul endroit.',
      gradient: [AppColors.primaryGreen, AppColors.primaryGreenDark],
    ),
    _OnboardingPage(
      icon: Icons.headphones_rounded,
      title: 'Audios & Vidéos',
      subtitle:
          'Écoutez les cours audio et regardez les émissions YouTube directement dans l\'application.',
      gradient: [AppColors.goldPrimary, AppColors.goldDark],
    ),
    _OnboardingPage(
      icon: Icons.question_answer_rounded,
      title: 'Questions & Réponses',
      subtitle:
          'Consultez les réponses du Professeur aux questions posées par les apprenants.',
      gradient: [AppColors.primaryGreenDark, AppColors.brownPrimary],
    ),
  ];

  Future<void> _complete() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(ApiConstants.onboardingKey, true);
    if (mounted) context.go('/');
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          PageView.builder(
            controller: _controller,
            itemCount: _pages.length,
            onPageChanged: (i) => setState(() => _currentPage = i),
            itemBuilder: (context, index) =>
                _OnboardingPageWidget(page: _pages[index]),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: _buildBottomBar(),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar() {
    final isLast = _currentPage == _pages.length - 1;
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _pages.length,
                (i) => AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: i == _currentPage ? 24 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: i == _currentPage
                        ? Colors.white
                        : Colors.white38,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                if (!isLast)
                  Expanded(
                    child: TextButton(
                      onPressed: _complete,
                      child: const Text('Passer',
                          style: TextStyle(color: Colors.white70)),
                    ),
                  ),
                Expanded(
                  flex: 2,
                  child: CatkButton(
                    label: isLast ? 'Commencer' : 'Suivant',
                    onPressed: isLast
                        ? _complete
                        : () => _controller.nextPage(
                              duration:
                                  const Duration(milliseconds: 300),
                              curve: Curves.easeInOut,
                            ),
                    variant: CatkButtonVariant.gold,
                    fullWidth: true,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _OnboardingPage {
  final IconData icon;
  final String title;
  final String subtitle;
  final List<Color> gradient;

  const _OnboardingPage({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.gradient,
  });
}

class _OnboardingPageWidget extends StatelessWidget {
  final _OnboardingPage page;

  const _OnboardingPageWidget({required this.page});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: page.gradient,
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 160,
                height: 160,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.15),
                  shape: BoxShape.circle,
                ),
                child: Icon(page.icon,
                    size: 80, color: Colors.white),
              ),
              const SizedBox(height: 48),
              Text(
                page.title,
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                  height: 1.2,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                page.subtitle,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.white.withOpacity(0.85),
                  height: 1.6,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 120),
            ],
          ),
        ),
      ),
    );
  }
}
