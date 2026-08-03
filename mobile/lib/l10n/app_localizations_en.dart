// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'Maktaba CATK';

  @override
  String get navHome => 'Home';

  @override
  String get navTeachings => 'Teachings';

  @override
  String get navAudios => 'Audios';

  @override
  String get navVideos => 'Videos';

  @override
  String get navQuestions => 'Q&A';

  @override
  String get navSearch => 'Search';

  @override
  String get heroTitle => 'Digital Library of Teachings';

  @override
  String get heroSubtitle => 'By Professor Cheikh Ahmet Tidiane KEBE';

  @override
  String get loading => 'Loading...';

  @override
  String get error => 'An error occurred';

  @override
  String get retry => 'Retry';

  @override
  String get seeAll => 'See all';

  @override
  String get download => 'Download';

  @override
  String get read => 'Read';

  @override
  String get play => 'Listen';

  @override
  String get watch => 'Watch';

  @override
  String get search => 'Search...';

  @override
  String get favorites => 'Favorites';

  @override
  String get share => 'Share';

  @override
  String get login => 'Login';

  @override
  String get register => 'Sign Up';

  @override
  String get logout => 'Logout';

  @override
  String get email => 'Email';

  @override
  String get password => 'Password';

  @override
  String get forgotPassword => 'Forgot password?';

  @override
  String get loginWithGoogle => 'Continue with Google';

  @override
  String get createAccount => 'Create an account';

  @override
  String get featuredTeachings => 'Featured Teachings';

  @override
  String get popularAudios => 'Popular Audios';

  @override
  String get latestVideos => 'Latest Videos';

  @override
  String get categories => 'Categories';

  @override
  String get profile => 'My Profile';

  @override
  String get settings => 'Settings';

  @override
  String get appearance => 'Appearance';

  @override
  String get language => 'Language';

  @override
  String get darkMode => 'Dark Mode';

  @override
  String get lightMode => 'Light Mode';

  @override
  String get systemMode => 'System Default';

  @override
  String get aboutApp => 'About';

  @override
  String get version => 'Version';

  @override
  String get noResults => 'No results found';

  @override
  String get searchHint => 'Search teachings, audios...';

  @override
  String views(int count) {
    return '$count views';
  }

  @override
  String downloads(int count) {
    return '$count downloads';
  }

  @override
  String get questionAnsweredBy => 'Answer by Professor KEBE';

  @override
  String get continueWithoutAccount => 'Continue without account';

  @override
  String get profileGuest => 'Guest';

  @override
  String get noInternet => 'No Internet connection';

  @override
  String get pdfReading => 'Loading document...';

  @override
  String get audioPlaying => 'Now playing';

  @override
  String get backToHome => 'Back to Home';
}
