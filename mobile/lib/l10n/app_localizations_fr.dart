// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for French (`fr`).
class AppLocalizationsFr extends AppLocalizations {
  AppLocalizationsFr([String locale = 'fr']) : super(locale);

  @override
  String get appTitle => 'Maktaba CATK';

  @override
  String get navHome => 'Accueil';

  @override
  String get navTeachings => 'Enseignements';

  @override
  String get navAudios => 'Audios';

  @override
  String get navVideos => 'Émissions';

  @override
  String get navQuestions => 'Questions';

  @override
  String get navSearch => 'Recherche';

  @override
  String get heroTitle => 'Bibliothèque Numérique des Enseignements';

  @override
  String get heroSubtitle => 'Du Professeur Cheikh Ahmet Tidiane KEBE';

  @override
  String get loading => 'Chargement...';

  @override
  String get error => 'Une erreur s\'est produite';

  @override
  String get retry => 'Réessayer';

  @override
  String get seeAll => 'Voir tout';

  @override
  String get download => 'Télécharger';

  @override
  String get read => 'Lire';

  @override
  String get play => 'Écouter';

  @override
  String get watch => 'Regarder';

  @override
  String get search => 'Rechercher...';

  @override
  String get favorites => 'Favoris';

  @override
  String get share => 'Partager';

  @override
  String get login => 'Connexion';

  @override
  String get register => 'Inscription';

  @override
  String get logout => 'Déconnexion';

  @override
  String get email => 'Email';

  @override
  String get password => 'Mot de passe';

  @override
  String get forgotPassword => 'Mot de passe oublié ?';

  @override
  String get loginWithGoogle => 'Continuer avec Google';

  @override
  String get createAccount => 'Créer un compte';

  @override
  String get featuredTeachings => 'Enseignements en vedette';

  @override
  String get popularAudios => 'Audios populaires';

  @override
  String get latestVideos => 'Émissions récentes';

  @override
  String get categories => 'Catégories';

  @override
  String get profile => 'Mon Profil';

  @override
  String get settings => 'Paramètres';

  @override
  String get appearance => 'Apparence';

  @override
  String get language => 'Langue';

  @override
  String get darkMode => 'Mode sombre';

  @override
  String get lightMode => 'Mode clair';

  @override
  String get systemMode => 'Automatique';

  @override
  String get aboutApp => 'À propos';

  @override
  String get version => 'Version';

  @override
  String get noResults => 'Aucun résultat';

  @override
  String get searchHint => 'Rechercher enseignements, audios...';

  @override
  String views(int count) {
    return '$count vues';
  }

  @override
  String downloads(int count) {
    return '$count téléchargements';
  }

  @override
  String get questionAnsweredBy => 'Réponse du Professeur KEBE';

  @override
  String get continueWithoutAccount => 'Continuer sans compte';

  @override
  String get profileGuest => 'Visiteur';

  @override
  String get noInternet => 'Pas de connexion Internet';

  @override
  String get pdfReading => 'Lecture du document...';

  @override
  String get audioPlaying => 'Lecture en cours';

  @override
  String get backToHome => 'Retour à l\'accueil';
}
