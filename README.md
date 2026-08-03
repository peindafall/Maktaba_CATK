```
 ██████╗ █████╗ ████████╗██╗  ██╗
██╔════╝██╔══██╗╚══██╔══╝██║ ██╔╝
██║     ███████║   ██║   █████╔╝
██║     ██╔══██║   ██║   ██╔═██╗
╚██████╗██║  ██║   ██║   ██║  ██╗
 ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝

███╗   ███╗ █████╗ ██╗  ██╗████████╗ █████╗ ██████╗  █████╗
████╗ ████║██╔══██╗██║ ██╔╝╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗
██╔████╔██║███████║█████╔╝    ██║   ███████║██████╔╝███████║
██║╚██╔╝██║██╔══██║██╔═██╗    ██║   ██╔══██║██╔══██╗██╔══██║
██║ ╚═╝ ██║██║  ██║██║  ██╗   ██║   ██║  ██║██████╔╝██║  ██║
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝
```

<div align="center">

# 🕌 Maktaba CATK

**Bibliothèque Islamique Numérique — Centre Al-Tarbiyya Al-Kamaliyya**

[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![DRF](https://img.shields.io/badge/DRF-3.15-red?style=for-the-badge&logo=django&logoColor=white)](https://django-rest-framework.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)

*Plateforme multilingue (FR 🇫🇷 · EN 🇬🇧 · AR 🇸🇦) pour la diffusion des enseignements islamiques*

[🌐 Demo](https://catk.org) · [📚 Documentation](docs/) · [🐛 Issues](../../issues) · [💬 Discussions](../../discussions)

</div>

---

## 📋 Table des matières

- [Description](#-description)
- [Architecture](#-architecture)
- [Stack technologique](#-stack-technologique)
- [Prérequis](#-prérequis)
- [Installation rapide](#-installation-rapide)
- [Configuration](#-configuration)
- [Structure du projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 📖 Description

**Maktaba CATK** est la bibliothèque numérique officielle du *Centre Al-Tarbiyya Al-Kamaliyya*. Cette plateforme centralise et diffuse l'ensemble des enseignements islamiques sous forme de :

| Type de contenu | Description |
|-----------------|-------------|
| 📄 **Enseignements PDF** | Livres, cours et documents en téléchargement |
| 🎵 **Audios** | Conférences, récitations et dhikrs |
| 🎬 **Vidéos** | Émissions YouTube intégrées |
| ❓ **Q&R** | Questions/Réponses avec transcriptions multilingues |

### Fonctionnalités clés

- 🌍 **Multilingue** : Français, Anglais, Arabe (RTL natif)
- 🔍 **Recherche avancée** : Recherche plein texte dans toutes les ressources
- 📱 **Mobile-first** : Application Flutter iOS/Android + PWA React
- 🔐 **Authentification** : JWT + Google OAuth avec vérification email
- ⭐ **Favoris & Historique** : Expérience personnalisée pour les membres
- 📊 **Dashboard admin** : Statistiques, CRUD, gestion des médias
- 🚀 **CI/CD** : Déploiement automatisé via GitHub Actions

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTS (Couche Présentation)             │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ React Web App│  │Flutter Mobile│  │  Admin Panel │      │
│  │  (Vite+TS)   │  │  (iOS/Android│  │  (Django)    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │ HTTPS / JSON REST
┌──────────────────────────▼─────────────────────────────────┐
│                        NGINX (Reverse Proxy)                 │
│              SSL Termination · Load Balancing                │
└──────────────────────────┬─────────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────────┐
│              DJANGO REST FRAMEWORK (API Gateway)            │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Auth App  │  │Content Apps │  │ Stats & Logs│        │
│  │  JWT + OAuth│  │Teach/Audio/ │  │  Celery     │        │
│  │             │  │Video/QA     │  │  Tasks      │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└──────────┬───────────────────────────────┬─────────────────┘
           │                               │
┌──────────▼────────┐          ┌───────────▼────────┐
│   PostgreSQL 16   │          │     Redis 7         │
│  (Données métier) │          │  (Cache + Celery)   │
└───────────────────┘          └────────────────────┘
           │
┌──────────▼────────┐
│    MinIO S3        │
│  (Fichiers médias) │
│  PDF · MP3 · IMG   │
└───────────────────┘
```

L'architecture suit les principes de la **Clean Architecture** :

- **Repository Pattern** : Abstraction de l'accès aux données
- **Service Layer** : Logique métier découplée des vues
- **DTO Pattern** : Sérialisation/désérialisation avec DRF Serializers
- **CQRS léger** : Séparation lecture/écriture

> 📐 [Documentation complète de l'architecture](docs/architecture.md)

---

## 🛠 Stack technologique

### Backend

| Technologie | Version | Rôle |
|-------------|---------|------|
| Python | 3.13 | Langage principal |
| Django | 5.x | Framework web |
| Django REST Framework | 3.15 | API REST |
| djangorestframework-simplejwt | 5.x | Authentification JWT |
| Celery | 5.x | Tâches asynchrones |
| django-celery-beat | 2.x | Planification des tâches |
| drf-spectacular | 0.27 | Documentation OpenAPI/Swagger |
| django-filter | 23.x | Filtrage avancé |
| Pillow | 10.x | Traitement d'images |
| pytest-django | 4.x | Tests |

### Frontend Web

| Technologie | Version | Rôle |
|-------------|---------|------|
| React | 18 | Framework UI |
| TypeScript | 5.x | Typage statique |
| Vite | 5.x | Build tool |
| React Router | 6.x | Navigation |
| TanStack Query | 5.x | State management serveur |
| Tailwind CSS | 3.x | Styling utility-first |
| i18next | 23.x | Internationalisation |
| Vitest | 1.x | Tests unitaires |

### Mobile

| Technologie | Version | Rôle |
|-------------|---------|------|
| Flutter | 3.x | Framework mobile cross-platform |
| Dart | 3.x | Langage |
| Riverpod | 2.x | State management |
| Dio | 5.x | Client HTTP |
| Just Audio | 0.9.x | Lecteur audio |
| Go Router | 13.x | Navigation |

### Infrastructure

| Technologie | Version | Rôle |
|-------------|---------|------|
| Docker | 24+ | Containerisation |
| Docker Compose | 2.x | Orchestration dev |
| PostgreSQL | 16 | Base de données |
| Redis | 7 | Cache & message broker |
| MinIO | Latest | Stockage objet S3-compatible |
| Nginx | 1.27 | Reverse proxy |

---

## 📋 Prérequis

```bash
# Vérifier les versions installées
docker --version          # >= 24.0
docker compose version    # >= 2.0
git --version             # >= 2.40
make --version            # any
```

> **Note :** Sur Windows, utilisez [Docker Desktop](https://www.docker.com/products/docker-desktop/) avec WSL2.

---

## ⚡ Installation rapide

### 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/catk/Maktaba_CATK.git
cd Maktaba_CATK
```

### 2️⃣ Configurer l'environnement

```bash
cp backend/.env.example backend/.env
# Éditez backend/.env si nécessaire (optionnel pour le dev)
```

### 3️⃣ Lancer l'environnement de développement

```bash
make dev
```

✅ C'est tout ! Les services sont disponibles :

| Service | URL | Identifiants |
|---------|-----|--------------|
| 🌐 Frontend React | http://localhost:3000 | — |
| 🔧 API Django | http://localhost:8000/api/v1/ | — |
| 📚 Swagger UI | http://localhost:8000/api/docs/ | — |
| ⚙️ Django Admin | http://localhost:8000/admin/ | admin / admin123 |
| 💾 MinIO Console | http://localhost:9001 | minioadmin / minioadmin123 |

---

## ⚙️ Configuration

### Variables d'environnement (`backend/.env`)

```bash
# === Django Core ===
SECRET_KEY=your-50-chars-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# === Base de données ===
DATABASE_URL=postgres://maktaba_user:maktaba_password_dev@db:5432/maktaba_catk

# === Redis (Cache + Celery) ===
REDIS_URL=redis://redis:6379/0

# === MinIO (Stockage fichiers) ===
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET_NAME=maktabacatk
MINIO_ENDPOINT=http://minio:9000

# === Email (optionnel en dev) ===
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

# === CORS ===
CORS_ALLOW_ALL_ORIGINS=True   # Dev uniquement !

# === Sentry (Production) ===
SENTRY_DSN=

# === Google OAuth (optionnel) ===
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Configuration production

```bash
cp .env.prod.example .env.prod
# Remplir TOUS les champs obligatoires
# Voir docs/deployment.md pour le guide complet
```

> 🔐 [Guide sécurité OWASP](docs/security.md) | 🚀 [Guide de déploiement](docs/deployment.md)

---

## 📁 Structure du projet

```
Maktaba_CATK/
│
├── 📂 backend/                    # Django REST Framework
│   ├── 📂 apps/
│   │   ├── 📂 authentication/     # JWT, OAuth, inscription
│   │   ├── 📂 teachings/          # Enseignements PDF
│   │   ├── 📂 audios/             # Fichiers audio
│   │   ├── 📂 videos/             # Vidéos YouTube
│   │   ├── 📂 questions/          # Q&R avec audio
│   │   ├── 📂 categories/         # Taxonomie
│   │   ├── 📂 users/              # Profils & favoris
│   │   └── 📂 stats/              # Vues, downloads, analytics
│   ├── 📂 config/
│   │   ├── settings/
│   │   │   ├── base.py            # Paramètres communs
│   │   │   ├── development.py     # Dev (DEBUG=True)
│   │   │   ├── production.py      # Prod (SSL, Sentry)
│   │   │   └── testing.py         # Tests (SQLite in-memory)
│   │   ├── urls.py
│   │   ├── celery.py
│   │   └── wsgi.py
│   ├── 📂 requirements/
│   │   ├── base.txt
│   │   ├── development.txt
│   │   └── production.txt
│   ├── Dockerfile
│   └── manage.py
│
├── 📂 frontend/                   # React + TypeScript
│   ├── 📂 src/
│   │   ├── 📂 api/                # Clients API (React Query)
│   │   ├── 📂 components/         # Composants réutilisables
│   │   ├── 📂 pages/              # Pages (route-level)
│   │   ├── 📂 hooks/              # Hooks personnalisés
│   │   ├── 📂 stores/             # État global (Zustand)
│   │   ├── 📂 i18n/               # Traductions FR/EN/AR
│   │   ├── 📂 types/              # Types TypeScript
│   │   └── 📂 utils/              # Helpers
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
├── 📂 mobile/                     # Flutter
│   ├── 📂 lib/
│   │   ├── 📂 features/           # Feature-first architecture
│   │   ├── 📂 shared/             # Widgets partagés
│   │   ├── 📂 core/               # Services, routing, DI
│   │   └── main.dart
│   └── pubspec.yaml
│
├── 📂 nginx/                      # Reverse proxy
│   ├── nginx.dev.conf
│   ├── nginx.prod.conf
│   └── ssl/
│
├── 📂 scripts/                    # Utilitaires
│   ├── init_db.sql                # Initialisation BDD
│   ├── create_buckets.py          # Création buckets MinIO
│   └── start.sh                   # Script de démarrage
│
├── 📂 docs/                       # Documentation
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   ├── security.md
│   ├── deployment.md
│   ├── backlog.md
│   ├── testing.md
│   └── uml/
│       └── use_cases.md
│
├── 📂 .github/
│   └── workflows/
│       └── ci.yml                 # CI/CD Pipeline
│
├── docker-compose.yml             # Dev
├── docker-compose.prod.yml        # Production
├── Makefile                       # Commandes utilitaires
└── README.md
```

---

## 🔌 API Endpoints

Base URL : `https://catk.org/api/v1/`

### Authentification

```
POST   /auth/login/            Obtenir tokens JWT
POST   /auth/refresh/          Rafraîchir le token access
POST   /auth/register/         Créer un compte
POST   /auth/verify-email/     Vérifier l'adresse email
POST   /auth/reset-password/   Réinitialiser le mot de passe
```

### Contenu

```
GET    /teachings/             Liste paginée des enseignements
GET    /teachings/{id}/        Détail d'un enseignement
GET    /teachings/featured/    Enseignements en vedette
GET    /teachings/popular/     Enseignements populaires
POST   /teachings/{id}/download/ Incrémenter les téléchargements

GET    /audios/                Liste paginée des audios
GET    /audios/{id}/           Détail d'un audio
POST   /audios/{id}/play/      Incrémenter les lectures

GET    /videos/                Liste paginée des vidéos
GET    /videos/{id}/           Détail d'une vidéo

GET    /questions/             Liste des questions/réponses
GET    /questions/{id}/        Détail avec réponses audio
```

### Utilitaires

```
GET    /categories/            Toutes les catégories
GET    /categories/{slug}/     Catégorie par slug
GET    /search/?q=...          Recherche globale
GET    /dashboard/stats/       Statistiques (admin)
GET    /users/me/              Mon profil
PATCH  /users/me/              Modifier mon profil
GET    /users/me/favorites/    Mes favoris
POST   /users/me/favorites/    Ajouter un favori
```

> 📖 [Documentation complète de l'API](docs/api.md) | 🔗 [Swagger UI](http://localhost:8000/api/docs/)

---

## 🖼 Screenshots

<div align="center">

| Page d'accueil | Bibliothèque | Lecteur Audio |
|:--------------:|:------------:|:-------------:|
| ![Home](docs/assets/screenshot-home.png) | ![Library](docs/assets/screenshot-library.png) | ![Player](docs/assets/screenshot-player.png) |

| Version Mobile | Admin Dashboard | Vue RTL Arabe |
|:--------------:|:---------------:|:-------------:|
| ![Mobile](docs/assets/screenshot-mobile.png) | ![Admin](docs/assets/screenshot-admin.png) | ![Arabic](docs/assets/screenshot-arabic.png) |

*Screenshots à venir après la version bêta publique*

</div>

---

## 🤝 Contributing

Nous accueillons chaleureusement toutes les contributions !

### Processus de contribution

1. **Fork** le dépôt
2. **Créez** une branche feature : `git checkout -b feature/ma-fonctionnalite`
3. **Committez** vos changements : `git commit -m 'feat: ajouter ma fonctionnalité'`
4. **Pushez** la branche : `git push origin feature/ma-fonctionnalite`
5. **Ouvrez** une Pull Request vers `develop`

### Convention de commits (Conventional Commits)

```
feat:     Nouvelle fonctionnalité
fix:      Correction de bug
docs:     Documentation uniquement
style:    Formatage (pas de changement de code)
refactor: Refactorisation
test:     Ajout ou modification de tests
chore:    Maintenance (deps, CI...)
```

### Standards de code

```bash
# Backend
cd backend
flake8 apps/ --max-line-length=100
isort apps/
black apps/
pytest apps/ -v

# Frontend
cd frontend
npm run lint
npm run type-check
npm test
```

### Guides supplémentaires

- 📋 [Backlog & User Stories](docs/backlog.md)
- 🧪 [Plan de tests](docs/testing.md)
- 🔐 [Checklist sécurité](docs/security.md)

---

## 📄 License

Ce projet est distribué sous la licence **MIT**.

```
MIT License

Copyright (c) 2024 Centre Al-Tarbiyya Al-Kamaliyya (CATK)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

Voir [LICENSE](LICENSE) pour le texte complet.

---

## 📬 Contact

<div align="center">

**Centre Al-Tarbiyya Al-Kamaliyya**

🌐 [catk.org](https://catk.org)
📧 [contact@catk.org](mailto:contact@catk.org)
📱 Application disponible sur App Store & Google Play *(bientôt)*

---

*بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ*

*Fait avec ❤️ pour la communauté musulmane francophone*

</div>
