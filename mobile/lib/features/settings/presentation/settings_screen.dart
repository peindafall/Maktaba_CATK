import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/utils/language_helper.dart';
import '../../../core/widgets/language_selector.dart';

final themeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.system);
final localeProvider = StateProvider<String>((ref) => 'fr');

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() =>
      _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  @override
  void initState() {
    super.initState();
    _loadPrefs();
  }

  Future<void> _loadPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    final theme = prefs.getString(ApiConstants.themeKey) ?? 'system';
    final locale = prefs.getString(ApiConstants.localeKey) ?? 'fr';
    ref.read(localeProvider.notifier).state = locale;
    switch (theme) {
      case 'light':
        ref.read(themeProvider.notifier).state = ThemeMode.light;
        break;
      case 'dark':
        ref.read(themeProvider.notifier).state = ThemeMode.dark;
        break;
      default:
        ref.read(themeProvider.notifier).state = ThemeMode.system;
    }
  }

  Future<void> _setTheme(ThemeMode mode) async {
    ref.read(themeProvider.notifier).state = mode;
    final prefs = await SharedPreferences.getInstance();
    final key = mode == ThemeMode.light
        ? 'light'
        : mode == ThemeMode.dark
            ? 'dark'
            : 'system';
    await prefs.setString(ApiConstants.themeKey, key);
  }

  Future<void> _setLocale(String locale) async {
    ref.read(localeProvider.notifier).state = locale;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(ApiConstants.localeKey, locale);
  }

  @override
  Widget build(BuildContext context) {
    final themeMode = ref.watch(themeProvider);
    final locale = ref.watch(localeProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Paramètres'),
        backgroundColor: AppColors.primaryGreenDark,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          _SectionTitle(title: 'Apparence'),
          RadioListTile<ThemeMode>(
            value: ThemeMode.system,
            groupValue: themeMode,
            title: const Text('Automatique'),
            secondary: const Icon(Icons.brightness_auto),
            onChanged: (v) => _setTheme(v!),
          ),
          RadioListTile<ThemeMode>(
            value: ThemeMode.light,
            groupValue: themeMode,
            title: const Text('Clair'),
            secondary: const Icon(Icons.wb_sunny_outlined),
            onChanged: (v) => _setTheme(v!),
          ),
          RadioListTile<ThemeMode>(
            value: ThemeMode.dark,
            groupValue: themeMode,
            title: const Text('Sombre'),
            secondary: const Icon(Icons.nights_stay_outlined),
            onChanged: (v) => _setTheme(v!),
          ),
          const Divider(),
          _SectionTitle(title: 'Langue'),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: LanguageSelector(
              currentLocale: locale,
              onLocaleChanged: _setLocale,
            ),
          ),
          const Divider(),
          _SectionTitle(title: 'À propos'),
          ListTile(
            leading: const Icon(Icons.info_outline,
                color: AppColors.primaryGreen),
            title: const Text('Version'),
            trailing: const Text('1.0.0'),
          ),
          ListTile(
            leading: const Icon(Icons.privacy_tip_outlined,
                color: AppColors.primaryGreen),
            title: const Text('Politique de confidentialité'),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.description_outlined,
                color: AppColors.primaryGreen),
            title: const Text("Conditions d'utilisation"),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.contact_support_outlined,
                color: AppColors.primaryGreen),
            title: const Text('Nous contacter'),
            onTap: () {},
          ),
          const SizedBox(height: 32),
          Center(
            child: Column(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Text(
                      'م',
                      style: TextStyle(
                        fontFamily: 'Amiri',
                        fontSize: 30,
                        color: AppColors.goldLight,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Maktaba CATK',
                  style: TextStyle(fontWeight: FontWeight.w700),
                ),
                const Text(
                  'Bibliothèque numérique des enseignements\ndu Professeur Cheikh Ahmet Tidiane KEBE',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;

  const _SectionTitle({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 4),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w700,
          color: AppColors.primaryGreen,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
