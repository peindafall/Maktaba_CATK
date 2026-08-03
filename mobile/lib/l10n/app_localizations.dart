import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ar.dart';
import 'app_localizations_en.dart';
import 'app_localizations_fr.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('ar'),
    Locale('en'),
    Locale('fr')
  ];

  /// No description provided for @appTitle.
  ///
  /// In fr, this message translates to:
  /// **'Maktaba CATK'**
  String get appTitle;

  /// No description provided for @navHome.
  ///
  /// In fr, this message translates to:
  /// **'Accueil'**
  String get navHome;

  /// No description provided for @navTeachings.
  ///
  /// In fr, this message translates to:
  /// **'Enseignements'**
  String get navTeachings;

  /// No description provided for @navAudios.
  ///
  /// In fr, this message translates to:
  /// **'Audios'**
  String get navAudios;

  /// No description provided for @navVideos.
  ///
  /// In fr, this message translates to:
  /// **'Émissions'**
  String get navVideos;

  /// No description provided for @navQuestions.
  ///
  /// In fr, this message translates to:
  /// **'Questions'**
  String get navQuestions;

  /// No description provided for @navSearch.
  ///
  /// In fr, this message translates to:
  /// **'Recherche'**
  String get navSearch;

  /// No description provided for @heroTitle.
  ///
  /// In fr, this message translates to:
  /// **'Bibliothèque Numérique des Enseignements'**
  String get heroTitle;

  /// No description provided for @heroSubtitle.
  ///
  /// In fr, this message translates to:
  /// **'Du Professeur Cheikh Ahmet Tidiane KEBE'**
  String get heroSubtitle;

  /// No description provided for @loading.
  ///
  /// In fr, this message translates to:
  /// **'Chargement...'**
  String get loading;

  /// No description provided for @error.
  ///
  /// In fr, this message translates to:
  /// **'Une erreur s\'est produite'**
  String get error;

  /// No description provided for @retry.
  ///
  /// In fr, this message translates to:
  /// **'Réessayer'**
  String get retry;

  /// No description provided for @seeAll.
  ///
  /// In fr, this message translates to:
  /// **'Voir tout'**
  String get seeAll;

  /// No description provided for @download.
  ///
  /// In fr, this message translates to:
  /// **'Télécharger'**
  String get download;

  /// No description provided for @read.
  ///
  /// In fr, this message translates to:
  /// **'Lire'**
  String get read;

  /// No description provided for @play.
  ///
  /// In fr, this message translates to:
  /// **'Écouter'**
  String get play;

  /// No description provided for @watch.
  ///
  /// In fr, this message translates to:
  /// **'Regarder'**
  String get watch;

  /// No description provided for @search.
  ///
  /// In fr, this message translates to:
  /// **'Rechercher...'**
  String get search;

  /// No description provided for @favorites.
  ///
  /// In fr, this message translates to:
  /// **'Favoris'**
  String get favorites;

  /// No description provided for @share.
  ///
  /// In fr, this message translates to:
  /// **'Partager'**
  String get share;

  /// No description provided for @login.
  ///
  /// In fr, this message translates to:
  /// **'Connexion'**
  String get login;

  /// No description provided for @register.
  ///
  /// In fr, this message translates to:
  /// **'Inscription'**
  String get register;

  /// No description provided for @logout.
  ///
  /// In fr, this message translates to:
  /// **'Déconnexion'**
  String get logout;

  /// No description provided for @email.
  ///
  /// In fr, this message translates to:
  /// **'Email'**
  String get email;

  /// No description provided for @password.
  ///
  /// In fr, this message translates to:
  /// **'Mot de passe'**
  String get password;

  /// No description provided for @forgotPassword.
  ///
  /// In fr, this message translates to:
  /// **'Mot de passe oublié ?'**
  String get forgotPassword;

  /// No description provided for @loginWithGoogle.
  ///
  /// In fr, this message translates to:
  /// **'Continuer avec Google'**
  String get loginWithGoogle;

  /// No description provided for @createAccount.
  ///
  /// In fr, this message translates to:
  /// **'Créer un compte'**
  String get createAccount;

  /// No description provided for @featuredTeachings.
  ///
  /// In fr, this message translates to:
  /// **'Enseignements en vedette'**
  String get featuredTeachings;

  /// No description provided for @popularAudios.
  ///
  /// In fr, this message translates to:
  /// **'Audios populaires'**
  String get popularAudios;

  /// No description provided for @latestVideos.
  ///
  /// In fr, this message translates to:
  /// **'Émissions récentes'**
  String get latestVideos;

  /// No description provided for @categories.
  ///
  /// In fr, this message translates to:
  /// **'Catégories'**
  String get categories;

  /// No description provided for @profile.
  ///
  /// In fr, this message translates to:
  /// **'Mon Profil'**
  String get profile;

  /// No description provided for @settings.
  ///
  /// In fr, this message translates to:
  /// **'Paramètres'**
  String get settings;

  /// No description provided for @appearance.
  ///
  /// In fr, this message translates to:
  /// **'Apparence'**
  String get appearance;

  /// No description provided for @language.
  ///
  /// In fr, this message translates to:
  /// **'Langue'**
  String get language;

  /// No description provided for @darkMode.
  ///
  /// In fr, this message translates to:
  /// **'Mode sombre'**
  String get darkMode;

  /// No description provided for @lightMode.
  ///
  /// In fr, this message translates to:
  /// **'Mode clair'**
  String get lightMode;

  /// No description provided for @systemMode.
  ///
  /// In fr, this message translates to:
  /// **'Automatique'**
  String get systemMode;

  /// No description provided for @aboutApp.
  ///
  /// In fr, this message translates to:
  /// **'À propos'**
  String get aboutApp;

  /// No description provided for @version.
  ///
  /// In fr, this message translates to:
  /// **'Version'**
  String get version;

  /// No description provided for @noResults.
  ///
  /// In fr, this message translates to:
  /// **'Aucun résultat'**
  String get noResults;

  /// No description provided for @searchHint.
  ///
  /// In fr, this message translates to:
  /// **'Rechercher enseignements, audios...'**
  String get searchHint;

  /// No description provided for @views.
  ///
  /// In fr, this message translates to:
  /// **'{count} vues'**
  String views(int count);

  /// No description provided for @downloads.
  ///
  /// In fr, this message translates to:
  /// **'{count} téléchargements'**
  String downloads(int count);

  /// No description provided for @questionAnsweredBy.
  ///
  /// In fr, this message translates to:
  /// **'Réponse du Professeur KEBE'**
  String get questionAnsweredBy;

  /// No description provided for @continueWithoutAccount.
  ///
  /// In fr, this message translates to:
  /// **'Continuer sans compte'**
  String get continueWithoutAccount;

  /// No description provided for @profileGuest.
  ///
  /// In fr, this message translates to:
  /// **'Visiteur'**
  String get profileGuest;

  /// No description provided for @noInternet.
  ///
  /// In fr, this message translates to:
  /// **'Pas de connexion Internet'**
  String get noInternet;

  /// No description provided for @pdfReading.
  ///
  /// In fr, this message translates to:
  /// **'Lecture du document...'**
  String get pdfReading;

  /// No description provided for @audioPlaying.
  ///
  /// In fr, this message translates to:
  /// **'Lecture en cours'**
  String get audioPlaying;

  /// No description provided for @backToHome.
  ///
  /// In fr, this message translates to:
  /// **'Retour à l\'accueil'**
  String get backToHome;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['ar', 'en', 'fr'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return AppLocalizationsAr();
    case 'en':
      return AppLocalizationsEn();
    case 'fr':
      return AppLocalizationsFr();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}
