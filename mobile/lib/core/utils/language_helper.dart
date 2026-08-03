import 'dart:ui';

class LanguageHelper {
  LanguageHelper._();

  static bool isRtl(String languageCode) {
    return languageCode == 'ar';
  }

  static String getLanguageName(String languageCode) {
    switch (languageCode) {
      case 'fr':
        return 'Français';
      case 'en':
        return 'English';
      case 'ar':
        return 'العربية';
      default:
        return languageCode.toUpperCase();
    }
  }

  static String getLanguageFlag(String languageCode) {
    switch (languageCode) {
      case 'fr':
        return '🇫🇷';
      case 'en':
        return '🇬🇧';
      case 'ar':
        return '🇸🇳';
      default:
        return '🌐';
    }
  }

  static Locale localeFromCode(String code) {
    switch (code) {
      case 'fr':
        return const Locale('fr');
      case 'en':
        return const Locale('en');
      case 'ar':
        return const Locale('ar');
      default:
        return const Locale('fr');
    }
  }

  static const List<String> supportedLocales = ['fr', 'en', 'ar'];
}
