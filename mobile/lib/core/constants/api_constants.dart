class ApiConstants {
  ApiConstants._();

  static const String baseUrl = 'https://api.maktaba-catk.com/api/v1';
  static const String mediaBaseUrl = 'https://media.maktaba-catk.com';

  // Timeouts
  static const int connectTimeout = 30000;
  static const int receiveTimeout = 60000;

  // Endpoints – Auth
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh';
  static const String profile = '/auth/profile';

  // Endpoints – Teachings
  static const String teachings = '/enseignements';
  static const String teachingDetail = '/enseignements/{id}';

  // Endpoints – Audios
  static const String audios = '/audios';
  static const String audioDetail = '/audios/{id}';

  // Endpoints – Videos
  static const String videos = '/videos';
  static const String videoDetail = '/videos/{id}';

  // Endpoints – Questions
  static const String questions = '/questions';
  static const String questionDetail = '/questions/{id}';

  // Endpoints – Search
  static const String search = '/recherche';

  // Endpoints – Home
  static const String homeFeatured = '/accueil/vedette';
  static const String homeCategories = '/accueil/categories';

  // Storage keys
  static const String tokenKey = 'auth_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userKey = 'user_data';
  static const String themeKey = 'app_theme';
  static const String localeKey = 'app_locale';
  static const String onboardingKey = 'onboarding_done';
}
