# 📋 Backlog Agile — Maktaba CATK

> **Méthodologie :** Scrum · **Durée sprint :** 2 semaines · **Vélocité estimée :** 30 points/sprint

## Légende

| Symbole | Signification |
|---------|---------------|
| ✅ | Terminé |
| 🔄 | En cours |
| 📅 | Planifié |
| ⏳ | Backlog |
| 🚫 | Bloqué |

---

## EPIC 1 — Gestion des Enseignements 📄

**Objectif :** Permettre à tout visiteur d'accéder aux enseignements PDF en ligne et de les télécharger.

### Sprint 1 — MVP Enseignements (30 pts)

| ID | User Story | Critères d'acceptation | Points | Statut |
|----|-----------|------------------------|--------|--------|
| US-001 | En tant que **visiteur**, je veux voir la liste des enseignements afin de trouver un contenu | - Affichage en grille/liste 20/page<br>- Tri par date, popularité<br>- Filtre par catégorie<br>- Thumbnail visible | 3 | ✅ |
| US-002 | En tant que **visiteur**, je veux lire un PDF en ligne afin d'éviter de le télécharger | - Viewer intégré (pdf.js)<br>- Zoom avant/arrière<br>- Navigation page par page<br>- Responsive mobile | 5 | ✅ |
| US-003 | En tant que **visiteur**, je veux télécharger un PDF afin de le lire hors ligne | - Bouton téléchargement visible<br>- Compteur incrémenté côté serveur<br>- Téléchargement direct (URL présignée)<br>- Nom de fichier lisible | 2 | ✅ |
| US-004 | En tant que **visiteur**, je veux voir les enseignements en vedette sur la page d'accueil | - Section "À la une" (max 6)<br>- Critère : is_featured=true<br>- Design mis en valeur | 3 | ✅ |
| US-005 | En tant que **visiteur**, je veux filtrer les enseignements par langue (FR/EN/AR) | - Filtres visibles (3 boutons)<br>- Résultats mis à jour sans rechargement<br>- Persistance dans l'URL (?lang=fr) | 2 | 📅 |
| US-006 | En tant que **visiteur**, je veux voir les enseignements les plus populaires | - Section "Populaires" (top 10)<br>- Basé sur downloads_count<br>- Mise à jour toutes les heures | 3 | 📅 |
| US-007 | En tant qu'**admin**, je veux créer un enseignement depuis le dashboard | - Formulaire CRUD complet<br>- Upload PDF (max 50 MB)<br>- Upload image de couverture<br>- Prévisualisation avant publication | 8 | ✅ |
| US-008 | En tant qu'**admin**, je veux modifier un enseignement existant | - Édition de tous les champs<br>- Remplacement du PDF<br>- Gestion du statut (brouillon/publié/archivé) | 4 | 📅 |

---

## EPIC 2 — Questions / Réponses ❓

**Objectif :** Mettre à disposition les questions fréquentes avec les réponses audio du Cheikh.

### Sprint 2 — Q&R (28 pts)

| ID | User Story | Critères d'acceptation | Points | Statut |
|----|-----------|------------------------|--------|--------|
| US-010 | En tant que **visiteur**, je veux voir la liste des Q&R sur la Tarikha | - Liste paginée avec titres multilingues<br>- Filtre par catégorie<br>- Recherche dans les questions | 3 | ✅ |
| US-011 | En tant que **visiteur**, je veux écouter la réponse audio du Cheikh | - Lecteur audio intégré (inline)<br>- Play/Pause/Seek<br>- Affichage durée<br>- Compteur de lectures | 5 | ✅ |
| US-012 | En tant que **visiteur**, je veux lire la transcription de la réponse | - Transcription FR/EN/AR<br>- Accordéon expand/collapse<br>- Copier le texte | 3 | 📅 |
| US-013 | En tant que **visiteur**, je veux rechercher une question par mots-clés | - Recherche dans titre + question + keywords<br>- Résultats surlignés<br>- "Aucun résultat" géré proprement | 5 | 📅 |
| US-014 | En tant qu'**admin**, je veux créer une Q&R avec réponse audio | - Formulaire Q&R multilingue<br>- Upload fichier audio (MP3, max 100 MB)<br>- Saisie transcription avec formatage<br>- Gestion de l'ordre des réponses | 8 | 🔄 |
| US-015 | En tant que **visiteur**, je veux voir les Q&R liées à une catégorie | - Page catégorie avec onglets (Enseignements / Audios / Q&R)<br>- Compteurs par type | 4 | ⏳ |

---

## EPIC 3 — Lecteur Audio 🎵

**Objectif :** Offrir une expérience d'écoute de qualité pour les conférences et dhikrs.

### Sprint 3 — Audio (34 pts)

| ID | User Story | Critères d'acceptation | Points | Statut |
|----|-----------|------------------------|--------|--------|
| US-020 | En tant que **visiteur**, je veux écouter un audio avec contrôles basiques | - Play/Pause/Stop<br>- Barre de progression avec seek<br>- Affichage temps écoulé / durée totale<br>- Volume | 5 | ✅ |
| US-021 | En tant que **visiteur**, je veux contrôler la vitesse de lecture | - Vitesses : 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x<br>- Mémorisation du choix<br>- Indicateur visuel de la vitesse active | 3 | 📅 |
| US-022 | En tant que **membre mobile**, je veux la lecture audio en arrière-plan | - Lecture continue si l'app passe en background<br>- Contrôles dans le notification center<br>- Reprise automatique après appel | 8 | ⏳ |
| US-023 | En tant que **visiteur**, je veux voir la liste de lecture d'une catégorie | - Playlist automatique par catégorie<br>- Navigation avant/arrière entre audios<br>- "Lecture aléatoire" | 5 | ⏳ |
| US-024 | En tant que **visiteur**, je veux télécharger un audio | - Bouton téléchargement<br>- Compteur incrémenté<br>- URL présignée 1 heure | 3 | 📅 |
| US-025 | En tant que **visiteur mobile**, je veux un mini-lecteur persistant | - Lecteur barre en bas de l'app<br>- Reste visible en naviguant<br>- Expand vers lecteur complet | 8 | ⏳ |
| US-026 | En tant qu'**admin**, je veux uploader un audio depuis le dashboard | - Formulaire CRUD audio<br>- Upload MP3 (max 200 MB)<br>- Génération automatique de la durée<br>- Upload image de couverture | 5 | 🔄 |

---

## EPIC 4 — Vidéos YouTube 🎬

**Objectif :** Intégrer les émissions YouTube du CATK dans la plateforme.

### Sprint 4 — Vidéos (20 pts)

| ID | User Story | Critères d'acceptation | Points | Statut |
|----|-----------|------------------------|--------|--------|
| US-030 | En tant que **visiteur**, je veux voir les émissions avec miniatures | - Grille de vidéos<br>- Miniature YouTube haute résolution<br>- Durée affichée<br>- Date de publication | 3 | ✅ |
| US-031 | En tant que **visiteur**, je veux regarder une vidéo YouTube intégrée | - Player YouTube embed (pas de popup)<br>- Mode plein écran disponible<br>- Compteur de vues local incrémenté | 5 | ✅ |
| US-032 | En tant que **visiteur**, je veux filtrer les vidéos par catégorie/année | - Filtres catégorie et année<br>- URL mise à jour (?year=2024)<br>- Résultats sans rechargement | 3 | 📅 |
| US-033 | En tant qu'**admin**, je veux ajouter une vidéo YouTube | - Saisir URL YouTube<br>- Extraction automatique de l'ID et miniature<br>- Validation URL (youtube.com uniquement)<br>- Ajout titre multilingue | 5 | ✅ |
| US-034 | En tant que **visiteur**, je veux voir les vidéos liées sur la page de détail | - Section "Voir aussi" (3 vidéos)<br>- Basée sur la même catégorie | 4 | ⏳ |

---

## EPIC 5 — Internationalisation 🌍

**Objectif :** Proposer la plateforme en français, anglais et arabe avec support RTL natif.

### Sprint 5 — i18n (22 pts)

| ID | User Story | Critères d'acceptation | Points | Statut |
|----|-----------|------------------------|--------|--------|
| US-040 | En tant que **visiteur**, je veux changer la langue de l'interface | - Sélecteur langue visible (drapeau + code)<br>- Toute l'interface se traduit instantanément<br>- Pas de rechargement de page | 5 | ✅ |
| US-041 | En tant que **visiteur arabophone**, je veux une interface RTL fluide | - Direction du texte `rtl` pour l'arabe<br>- Icônes et layouts mirrorés<br>- Police arabe adaptée (Noto Kufi) | 8 | 🔄 |
| US-042 | En tant que **visiteur**, je veux que mon choix de langue soit mémorisé | - Persistance dans localStorage<br>- Prise en compte de la langue navigateur (Accept-Language)<br>- Sync avec le profil si connecté | 3 | 📅 |
| US-043 | En tant que **visiteur**, je veux voir le contenu dans ma langue préférée | - Affichage title_fr si lang=fr<br>- Fallback vers FR si contenu manquant<br>- Indicateur de langue pour le contenu | 3 | 📅 |
| US-044 | En tant qu'**admin**, je veux saisir le contenu dans les 3 langues | - Tabs FR/EN/AR dans les formulaires admin<br>- Validation : FR obligatoire, EN/AR optionnels | 3 | ✅ |

---

## EPIC 6 — Authentification & Profil 🔐

**Objectif :** Permettre aux membres de s'inscrire et d'accéder à des fonctionnalités personnalisées.

### Sprint 6 — Auth (30 pts)

| ID | User Story | Critères d'acceptation | Points | Statut |
|----|-----------|------------------------|--------|--------|
| US-050 | En tant que **visiteur**, je veux créer un compte | - Formulaire email/username/password<br>- Validation temps réel<br>- Email de confirmation envoyé<br>- Feedback clair (succès/erreur) | 5 | ✅ |
| US-051 | En tant que **membre**, je veux me connecter avec email/password | - Formulaire de connexion<br>- "Se souvenir de moi" (7j vs 1h session)<br>- Redirection vers page précédente | 3 | ✅ |
| US-052 | En tant que **visiteur**, je veux me connecter via Google | - Bouton "Continuer avec Google"<br>- OAuth 2.0 PKCE flow<br>- Création automatique du compte si nouveau<br>- Fusion avec compte email existant si même email | 8 | 📅 |
| US-053 | En tant que **membre**, je veux réinitialiser mon mot de passe | - "Mot de passe oublié ?" visible<br>- Email avec lien de reset (1h valide)<br>- Formulaire nouveau mot de passe<br>- Connexion automatique après reset | 5 | ✅ |
| US-054 | En tant que **membre**, je veux modifier mon profil | - Modification prénom/nom/pseudo<br>- Changement avatar (upload)<br>- Changement langue préférée<br>- Changement email (re-vérification) | 5 | 📅 |
| US-055 | En tant que **membre**, je veux voir et gérer mes favoris | - Page "Mes favoris"<br>- Ajout/suppression en un clic<br>- Filtre par type (PDF, audio, vidéo)<br>- Export de la liste | 4 | 📅 |

---

## EPIC 7 — Administration 🛠

**Objectif :** Fournir aux administrateurs un dashboard complet pour gérer la plateforme.

### Sprint 7 — Admin (40 pts)

| ID | User Story | Critères d'acceptation | Points | Statut |
|----|-----------|------------------------|--------|--------|
| US-060 | En tant qu'**admin**, je veux voir les statistiques globales | - Compteurs : total enseignements, audios, vidéos, Q&R, utilisateurs<br>- Stats du mois : nouvelles inscriptions, vues, téléchargements<br>- Top 10 contenus les plus populaires<br>- Graphe des vues sur 30 jours | 8 | 🔄 |
| US-061 | En tant qu'**admin**, je veux gérer les enseignements (CRUD) | - Liste avec filtres et recherche<br>- Création/édition/suppression<br>- Actions en masse (publier/archiver)<br>- Prévisualisation PDF | 8 | ✅ |
| US-062 | En tant qu'**admin**, je veux uploader un PDF avec prévisualisation | - Drag & drop ou sélection fichier<br>- Barre de progression upload<br>- Prévisualisation inline (pdf.js)<br>- Compression automatique si > 10 MB | 5 | 📅 |
| US-063 | En tant qu'**admin**, je veux gérer les Q&R avec réponses audio | - CRUD questions multilangues<br>- Upload/remplacement audio<br>- Saisie transcription avec formatage Markdown<br>- Ordre des réponses drag & drop | 8 | 🔄 |
| US-064 | En tant qu'**admin**, je veux uploader et gérer les audios | - CRUD audios<br>- Upload MP3 avec extraction automatique durée<br>- Organisation par catégorie<br>- Lecteur de prévisualisation | 5 | 🔄 |
| US-065 | En tant que **superadmin**, je veux gérer les utilisateurs et leurs rôles | - Liste utilisateurs avec recherche<br>- Modification du rôle<br>- Suspension/réactivation de compte<br>- Historique des actions d'un user | 6 | 📅 |

---

## EPIC 8 — Recherche 🔍

**Objectif :** Permettre aux visiteurs de trouver rapidement le contenu souhaité.

### Sprint 8 — Recherche (18 pts)

| ID | User Story | Critères d'acceptation | Points | Statut |
|----|-----------|------------------------|--------|--------|
| US-070 | En tant que **visiteur**, je veux effectuer une recherche globale | - Barre de recherche accessible depuis toutes les pages<br>- Recherche dans : titres, descriptions, transcriptions, keywords<br>- Résultats groupés par type | 8 | ✅ |
| US-071 | En tant que **visiteur**, je veux des suggestions de recherche | - Suggestions en temps réel (debounce 300ms)<br>- Max 8 suggestions<br>- Navigation clavier (↑↓ Enter) | 5 | ⏳ |
| US-072 | En tant que **visiteur**, je veux filtrer les résultats de recherche | - Filtres : type, langue, catégorie, date<br>- Filtres cumulatifs<br>- Remise à zéro des filtres | 3 | 📅 |
| US-073 | En tant que **visiteur**, je veux une recherche phonétique en arabe | - Support de la translittération<br>- "salat" trouve "صلاة"<br>- Pas de distinction majuscules/minuscules | 8 | ⏳ |

---

## EPIC 9 — Performance & PWA 📱

**Objectif :** Garantir une expérience rapide, notamment sur connexions mobiles lentes.

### Sprint 9 — Perf (20 pts)

| ID | User Story | Critères d'acceptation | Points | Statut |
|----|-----------|------------------------|--------|--------|
| US-080 | En tant que **visiteur mobile**, je veux une expérience fluide | - Score Lighthouse ≥ 90<br>- LCP < 2.5s<br>- CLS < 0.1<br>- FID < 100ms | 5 | 📅 |
| US-081 | En tant que **visiteur**, je veux installer l'app sur mon téléphone (PWA) | - Manifest.json configuré<br>- Service Worker avec cache offline<br>- Prompt d'installation affiché<br>- Icône haute résolution | 8 | ⏳ |
| US-082 | En tant que **visiteur hors ligne**, je veux accéder aux contenus récents | - Cache des 20 derniers enseignements consultés<br>- Page offline explicative si pas de cache<br>- Sync automatique au retour en ligne | 7 | ⏳ |

---

## Releases planifiées

```
v0.1 — Alpha interne     (Sprint 1-2)    MVP : Enseignements + Q&R
v0.5 — Bêta fermée       (Sprint 3-4)    + Audio + Vidéos
v0.8 — Bêta publique     (Sprint 5-6)    + i18n + Auth
v1.0 — Release générale  (Sprint 7-8)    + Admin + Recherche
v1.5 — PWA               (Sprint 9)      + Performance + Offline
v2.0 — App mobile        (Sprint 10+)    Flutter iOS/Android
```

---

## EPIC 10 — Espace « Mon Compte » 👤

**Objectif :** Offrir un espace personnel sécurisé avec gestion du profil, préférences, historique et bibliothèque personnelle.

### Sprint 10 — Mon Compte (32 pts)

| ID | User Story | Critères d'acceptation | Points | Statut |
|----|-----------|------------------------|--------|--------|
| US-090 | En tant que **membre**, je veux voir mon tableau de bord personnel | - Affichage photo, nom, email, téléphone, pays, langue, date d'inscription, statut compte, type abonnement<br>- Mise en page responsive web/mobile | 5 | 📅 |
| US-091 | En tant que **membre**, je veux modifier mes informations de profil | - Edition nom/prénom/email/téléphone/avatar<br>- Changement mot de passe sécurisé<br>- Validation des champs + messages d'erreur clairs | 8 | 📅 |
| US-092 | En tant que **membre**, je veux gérer mes préférences | - Choix de langue préférée<br>- Paramètres notifications email/push/in-app<br>- Persistance cross-device | 4 | 📅 |
| US-093 | En tant que **membre**, je veux consulter mon historique d'activité | - Historique documents consultés/téléchargés, audios, vidéos, recherches<br>- Filtres par période/type<br>- Pagination | 6 | ⏳ |
| US-094 | En tant que **membre**, je veux ma bibliothèque personnelle synchronisée | - Favoris multi-contenu (PDF/audio/vidéo/Q&R)<br>- Collections personnalisées<br>- Synchronisation web/mobile | 9 | 📅 |

---

## EPIC 11 — Offres Premium & Paiements 💳

**Objectif :** Mettre en place un système d'abonnement premium, paiement multicanal et facturation.

### Sprint 11 — Premium (36 pts)

| ID | User Story | Critères d'acceptation | Points | Statut |
|----|-----------|------------------------|--------|--------|
| US-100 | En tant que **visiteur**, je veux comparer offre gratuite vs premium | - Page plans avec grille de fonctionnalités<br>- CTA abonnement clair | 3 | 📅 |
| US-101 | En tant que **membre**, je veux souscrire à un abonnement premium | - Parcours checkout complet<br>- Activation immédiate après paiement validé | 8 | ⏳ |
| US-102 | En tant que **membre premium**, je veux accéder aux fonctionnalités premium | - Téléchargements illimités<br>- Offline/mobile sync<br>- Qualité audio améliorée<br>- Recommandations personnalisées | 8 | ⏳ |
| US-103 | En tant que **membre**, je veux gérer mon abonnement | - Renouveler, changer de plan, résilier<br>- Affichage start/end date, statut, renouvellement automatique | 6 | 📅 |
| US-104 | En tant que **membre**, je veux voir mes paiements et factures | - Historique paiements (référence, date, montant, devise, statut, moyen)<br>- Téléchargement facture PDF | 6 | 📅 |
| US-105 | En tant qu'**admin**, je veux intégrer plusieurs passerelles de paiement | - International: Stripe, PayPal<br>- Afrique: Wave, Orange Money, Free Money, MTN MoMo, Moov Money<br>- Webhooks de confirmation | 5 | ⏳ |

---

## EPIC 12 — Programme de Soutien & Fidélisation 🌟

**Objectif :** Permettre le soutien communautaire durable et renforcer l'engagement utilisateur.

### Sprint 12 — Soutien & Badges (24 pts)

| ID | User Story | Critères d'acceptation | Points | Statut |
|----|-----------|------------------------|--------|--------|
| US-110 | En tant que **membre**, je veux faire un don unique | - Montant libre + montants suggérés<br>- Confirmation et reçu | 4 | 📅 |
| US-111 | En tant que **membre**, je veux activer un don récurrent | - Périodicité mensuelle/trimestrielle<br>- Gestion suspension/arrêt | 5 | 📅 |
| US-112 | En tant que **membre**, je veux parrainer la plateforme | - Lien de parrainage personnel<br>- Tracking des contributions générées | 4 | ⏳ |
| US-113 | En tant que **membre**, je veux télécharger mes reçus de soutien | - Historique des dons<br>- Export PDF | 3 | 📅 |
| US-114 | En tant que **membre**, je veux recevoir des badges de fidélité | - Badges : Lecteur actif, Auditeur fidèle, Passionné de savoir, Soutien Premium, Ambassadeur<br>- Règles d'attribution transparentes | 5 | 📅 |
| US-115 | En tant qu'**admin**, je veux piloter les KPI de fidélisation | - Dashboard conversion free→premium<br>- Rétention mensuelle<br>- Top contributeurs | 3 | ⏳ |

---

## Modèles supplémentaires (cible produit)

```
User
├── profile
├── preferences
├── subscription
├── favorites
└── history

Subscription
├── plan
├── start_date
├── end_date
├── status
└── renewal

Payment
├── reference
├── amount
├── currency
├── payment_method
├── status
└── invoice
```

---

## Addendum — Cahier des charges (Sections 22 à 26)

### 22. ESPACE « MON COMPTE »

Chaque utilisateur dispose d'un espace personnel sécurisé pour gérer son profil, ses préférences et ses abonnements.

**Tableau de bord personnel**
- Photo de profil
- Nom complet
- Adresse email
- Téléphone
- Pays
- Langue préférée
- Date d'inscription
- Statut du compte
- Type d'abonnement

**Gestion du profil**
- Modifier nom/prénom
- Modifier adresse email
- Modifier numéro de téléphone
- Modifier photo de profil
- Modifier mot de passe
- Choisir langue préférée
- Gérer notifications

**Historique personnel**
- Documents consultés
- Documents téléchargés
- Audios écoutés
- Vidéos visualisées
- Historique des recherches
- Favoris enregistrés

**Bibliothèque personnelle**
- Enregistrer des favoris
- Créer des collections personnelles
- Retrouver rapidement les ressources préférées
- Synchroniser les favoris entre mobile et web

### 23. OFFRES PREMIUM

Le système intègre une gestion d'abonnements premium.

**Offre gratuite**
- Consultation libre
- Recherche
- Lecture PDF
- Écoute audio standard
- Consultation des vidéos

**Offre Premium**
- Téléchargement illimité
- Lecture hors ligne
- Accès anticipé aux nouveaux contenus
- Création de playlists audio
- Collections privées
- Historique avancé
- Recommandations personnalisées
- Absence de publicité
- Qualité audio améliorée
- Synchronisation multi-appareils

**Gestion des abonnements**
- Souscrire à une offre
- Renouveler un abonnement
- Modifier un abonnement
- Résilier un abonnement
- Consulter l'historique de paiement
- Télécharger les factures

**Paiements (architecture cible)**
- International : Stripe, PayPal
- Afrique : Wave, Orange Money, Free Money, MTN Mobile Money, Moov Money

**Données de paiement**
- Référence
- Date
- Montant
- Devise
- Statut
- Moyen de paiement
- Facture PDF

### 24. Programme de Soutien

Pour les utilisateurs souhaitant soutenir la diffusion des enseignements.

**Fonctionnalités**
- Don unique
- Don récurrent
- Parrainage
- Contribution libre

**Affichage**
- Contribution mensuelle
- Historique
- Reçus téléchargeables

### 25. Fidélisation

Système de badges :
- 🏅 Lecteur actif
- 🎧 Auditeur fidèle
- 📚 Passionné de savoir
- 🌟 Soutien Premium
- 🤝 Ambassadeur

### 26. Modèles supplémentaires

```text
User
├── profile
├── preferences
├── subscription
├── favorites
└── history

Subscription
├── plan
├── start_date
├── end_date
├── status
└── renewal

Payment
├── reference
├── amount
├── currency
├── payment_method
├── status
└── invoice
```
