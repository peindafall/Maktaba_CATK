# 📡 Documentation API — Maktaba CATK

## Informations générales

| Propriété | Valeur |
|-----------|--------|
| **Base URL (prod)** | `https://catk.org/api/v1/` |
| **Base URL (dev)** | `http://localhost:8000/api/v1/` |
| **Format** | JSON (`Content-Type: application/json`) |
| **Authentification** | JWT Bearer Token |
| **Documentation interactive** | `/api/docs/` (Swagger UI) |
| **Schéma OpenAPI** | `/api/schema/` |
| **Pagination** | Offset-based, 20 éléments/page |
| **Langues supportées** | `fr`, `en`, `ar` |

## Authentification

Toutes les requêtes authentifiées doivent inclure le header :

```http
Authorization: Bearer <access_token>
```

### Codes de statut communs

| Code | Signification |
|------|---------------|
| `200 OK` | Succès |
| `201 Created` | Ressource créée |
| `204 No Content` | Succès sans corps de réponse |
| `400 Bad Request` | Données invalides |
| `401 Unauthorized` | Token manquant ou expiré |
| `403 Forbidden` | Permissions insuffisantes |
| `404 Not Found` | Ressource introuvable |
| `429 Too Many Requests` | Rate limit dépassé |
| `500 Internal Server Error` | Erreur serveur |

---

## 🔐 Authentication

### POST `/auth/login/`

Authentifie un utilisateur et retourne une paire de tokens JWT.

**Authentification requise :** Non

**Corps de la requête :**
```json
{
  "email": "utilisateur@exemple.com",
  "password": "monMotDePasse123"
}
```

**Réponse 200 OK :**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "utilisateur@exemple.com",
    "username": "ahmed_dupont",
    "full_name": "Ahmed Dupont",
    "role": "member",
    "preferred_language": "fr",
    "avatar": "https://catk.org/media/avatars/ahmed.jpg"
  }
}
```

**Réponse 401 Unauthorized :**
```json
{
  "detail": "Identifiants invalides. Vérifiez votre email et mot de passe."
}
```

**Paramètres de requête :** Aucun

---

### POST `/auth/refresh/`

Rafraîchit le token d'accès avec le token de rafraîchissement. L'ancien refresh token est invalidé (rotation).

**Authentification requise :** Non

**Corps de la requête :**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Réponse 200 OK :**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Réponse 401 Unauthorized :**
```json
{
  "detail": "Token invalide ou expiré.",
  "code": "token_not_valid"
}
```

---

### POST `/auth/register/`

Crée un nouveau compte utilisateur. Un email de vérification est envoyé automatiquement.

**Authentification requise :** Non

**Corps de la requête :**
```json
{
  "email": "nouveau@exemple.com",
  "username": "nouvel_utilisateur",
  "password": "MotDePasse#Securise1",
  "password_confirm": "MotDePasse#Securise1",
  "first_name": "Prénom",
  "last_name": "Nom",
  "preferred_language": "fr"
}
```

**Réponse 201 Created :**
```json
{
  "message": "Compte créé. Vérifiez votre email pour activer votre compte.",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "nouveau@exemple.com",
    "username": "nouvel_utilisateur"
  }
}
```

**Réponse 400 Bad Request :**
```json
{
  "email": ["Un compte avec cet email existe déjà."],
  "password": ["Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre."]
}
```

---

### POST `/auth/verify-email/`

Vérifie l'adresse email avec le token reçu par email.

**Authentification requise :** Non

**Corps de la requête :**
```json
{
  "token": "abc123def456..."
}
```

**Réponse 200 OK :**
```json
{
  "message": "Email vérifié avec succès. Vous pouvez maintenant vous connecter."
}
```

---

### POST `/auth/reset-password/`

Initie la réinitialisation du mot de passe (envoi email).

**Authentification requise :** Non

**Corps de la requête :**
```json
{
  "email": "utilisateur@exemple.com"
}
```

**Réponse 200 OK :**
```json
{
  "message": "Si cet email existe, un lien de réinitialisation a été envoyé."
}
```

### POST `/auth/reset-password/confirm/`

Confirme la réinitialisation avec le nouveau mot de passe.

**Corps de la requête :**
```json
{
  "token": "reset_token_from_email",
  "uid": "encoded_user_id",
  "new_password": "NouveauMotDePasse#1",
  "new_password_confirm": "NouveauMotDePasse#1"
}
```

**Réponse 200 OK :**
```json
{
  "message": "Mot de passe réinitialisé avec succès."
}
```

---

## 📄 Enseignements

### GET `/teachings/`

Retourne la liste paginée des enseignements publiés.

**Authentification requise :** Non

**Paramètres de requête :**

| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `page` | int | Numéro de page | `?page=2` |
| `page_size` | int | Éléments/page (max 50) | `?page_size=10` |
| `category` | string | Slug de la catégorie | `?category=fiqh` |
| `language` | string | Langue (`fr`, `en`, `ar`) | `?language=fr` |
| `search` | string | Recherche dans le titre | `?search=salat` |
| `ordering` | string | Tri (`-published_at`, `title_fr`, `-downloads_count`) | `?ordering=-downloads_count` |
| `is_featured` | bool | Uniquement en vedette | `?is_featured=true` |

**Réponse 200 OK :**
```json
{
  "count": 142,
  "next": "https://catk.org/api/v1/teachings/?page=3",
  "previous": "https://catk.org/api/v1/teachings/?page=1",
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "title_fr": "Les piliers de l'Islam",
      "title_en": "The Pillars of Islam",
      "title_ar": "أركان الإسلام",
      "category_name": "Fondements",
      "category_slug": "fondements",
      "author_name": "Cheikh Ibrahim",
      "cover_image": "https://catk.org/media/teachings/covers/piliers-islam.jpg",
      "language": "fr",
      "views_count": 1250,
      "downloads_count": 340,
      "is_featured": true,
      "published_at": "2024-03-15T10:30:00Z"
    }
  ]
}
```

---

### GET `/teachings/{id}/`

Retourne le détail complet d'un enseignement.

**Authentification requise :** Non (enregistre automatiquement la vue)

**Paramètres de chemin :**
- `id` — UUID de l'enseignement

**Réponse 200 OK :**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "title_fr": "Les piliers de l'Islam",
  "title_en": "The Pillars of Islam",
  "title_ar": "أركان الإسلام",
  "description_fr": "Un enseignement complet sur les cinq piliers de l'Islam...",
  "description_en": "A comprehensive teaching on the five pillars of Islam...",
  "description_ar": "تعليم شامل حول أركان الإسلام الخمسة...",
  "category": {
    "id": "cat-001",
    "name_fr": "Fondements",
    "name_en": "Foundations",
    "name_ar": "الأسس",
    "slug": "fondements",
    "icon": "book",
    "color": "#2E7D32"
  },
  "author_name": "Cheikh Ibrahim",
  "pdf_file": null,
  "language": "fr",
  "views_count": 1251,
  "downloads_count": 340,
  "is_featured": true,
  "published_at": "2024-03-15T10:30:00Z",
  "related_teachings": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "title_fr": "La prière en Islam",
      "cover_image": "...",
      "downloads_count": 215
    }
  ]
}
```

> **Note :** Le champ `pdf_file` retourne une URL présignée MinIO (valide 1h) lors d'un appel authentifié, sinon `null`. Pour télécharger, utilisez l'endpoint `/download/`.

---

### GET `/teachings/featured/`

Retourne les enseignements mis en avant (maximum 6).

**Authentification requise :** Non

**Réponse 200 OK :**
```json
{
  "results": [
    { "id": "...", "title_fr": "...", "cover_image": "...", "downloads_count": 340 }
  ]
}
```

---

### GET `/teachings/popular/`

Retourne les enseignements les plus téléchargés (30 derniers jours).

**Paramètres de requête :**
- `limit` — Nombre de résultats (défaut: 10, max: 20)

**Réponse 200 OK :** Même structure que `/teachings/`, triés par `downloads_count` décroissant.

---

### POST `/teachings/{id}/download/`

Incrémente le compteur de téléchargement et retourne l'URL de téléchargement.

**Authentification requise :** Non (mais enregistrée si authentifié)

**Corps de la requête :** Vide

**Réponse 200 OK :**
```json
{
  "download_url": "https://minio.catk.org/maktabacatk/teachings/piliers-islam.pdf?X-Amz-Signature=...",
  "expires_in": 3600,
  "filename": "piliers-islam.pdf"
}
```

---

## 🎵 Audios

### GET `/audios/`

Retourne la liste paginée des audios publiés.

**Authentification requise :** Non

**Paramètres de requête :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `page` | int | Numéro de page |
| `category` | string | Slug catégorie |
| `language` | string | `fr`, `en`, `ar` |
| `search` | string | Titre |
| `ordering` | string | `-created_at`, `-plays_count` |

**Réponse 200 OK :**
```json
{
  "count": 89,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": "audio-uuid-001",
      "title_fr": "Dhikr du matin",
      "title_en": "Morning Dhikr",
      "title_ar": "أذكار الصباح",
      "category_name": "Dhikr & Wird",
      "cover_image": "https://catk.org/media/audios/covers/dhikr-matin.jpg",
      "language": "ar",
      "duration": "00:15:30",
      "plays_count": 2890,
      "downloads_count": 150,
      "is_published": true,
      "created_at": "2024-01-10T08:00:00Z"
    }
  ]
}
```

---

### GET `/audios/{id}/`

Retourne le détail d'un audio avec l'URL de streaming.

**Authentification requise :** Non

**Réponse 200 OK :**
```json
{
  "id": "audio-uuid-001",
  "title_fr": "Dhikr du matin",
  "title_en": "Morning Dhikr",
  "title_ar": "أذكار الصباح",
  "category": { "id": "...", "name_fr": "Dhikr & Wird", "slug": "dhikr-wird" },
  "audio_stream_url": "https://minio.catk.org/maktabacatk/audios/dhikr-matin.mp3?...",
  "cover_image": "https://catk.org/media/audios/covers/dhikr-matin.jpg",
  "language": "ar",
  "duration": "00:15:30",
  "plays_count": 2891,
  "downloads_count": 150,
  "created_at": "2024-01-10T08:00:00Z"
}
```

---

### POST `/audios/{id}/play/`

Incrémente le compteur de lectures (appelé au démarrage de la lecture).

**Authentification requise :** Non

**Corps de la requête :** Vide

**Réponse 200 OK :**
```json
{
  "plays_count": 2892
}
```

---

## 🎬 Vidéos

### GET `/videos/`

Retourne la liste paginée des vidéos YouTube publiées.

**Authentification requise :** Non

**Paramètres de requête :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `page` | int | Numéro de page |
| `category` | string | Catégorie |
| `language` | string | Langue |
| `search` | string | Titre |
| `ordering` | string | `-published_at`, `-views_count` |

**Réponse 200 OK :**
```json
{
  "count": 45,
  "results": [
    {
      "id": "video-uuid-001",
      "title_fr": "Émission Mawlid 2024",
      "title_en": "Mawlid Broadcast 2024",
      "title_ar": "بث المولد النبوي 2024",
      "description_fr": "Célébration du Mawlid An-Nabawi 2024...",
      "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "youtube_id": "dQw4w9WgXcQ",
      "thumbnail_url": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "category": "evenements",
      "duration": "01:32:15",
      "views_count": 5420,
      "is_published": true,
      "published_at": "2024-09-15T20:00:00Z"
    }
  ]
}
```

---

### GET `/videos/{id}/`

Retourne le détail d'une vidéo (avec embed YouTube).

**Réponse 200 OK :**
```json
{
  "id": "video-uuid-001",
  "title_fr": "Émission Mawlid 2024",
  "description_fr": "Célébration du Mawlid An-Nabawi 2024...",
  "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "youtube_embed_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "youtube_id": "dQw4w9WgXcQ",
  "thumbnail_url": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "category": "evenements",
  "duration": "01:32:15",
  "views_count": 5420,
  "published_at": "2024-09-15T20:00:00Z"
}
```

---

## ❓ Questions / Réponses

### GET `/questions/`

Retourne la liste paginée des questions/réponses.

**Authentification requise :** Non

**Paramètres de requête :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `page` | int | Numéro de page |
| `category` | string | Slug catégorie |
| `language` | string | Langue de la réponse |
| `search` | string | Recherche titre/keywords |
| `ordering` | string | `-created_at`, `-views_count` |

**Réponse 200 OK :**
```json
{
  "count": 210,
  "results": [
    {
      "id": "qa-uuid-001",
      "title_fr": "Quelle est la règle du jeûne pour le diabétique ?",
      "title_en": "What is the ruling on fasting for a diabetic person?",
      "title_ar": "ما حكم صيام المريض بالسكري؟",
      "category_name": "Fiqh",
      "keywords": ["jeûne", "ramadan", "maladie", "diabète"],
      "answers_count": 1,
      "views_count": 890,
      "is_published": true,
      "created_at": "2024-02-20T14:00:00Z"
    }
  ]
}
```

---

### GET `/questions/{id}/`

Retourne le détail d'une question avec ses réponses audio.

**Authentification requise :** Non

**Réponse 200 OK :**
```json
{
  "id": "qa-uuid-001",
  "title_fr": "Quelle est la règle du jeûne pour le diabétique ?",
  "title_en": "What is the ruling on fasting for a diabetic person?",
  "title_ar": "ما حكم صيام المريض بالسكري؟",
  "question_fr": "Un frère demande : je suis diabétique insulino-dépendant...",
  "question_en": "A brother asks: I am insulin-dependent diabetic...",
  "question_ar": "يسأل أخ: أنا مريض بالسكري ويعتمد على الأنسولين...",
  "category": { "id": "cat-fiqh", "name_fr": "Fiqh", "slug": "fiqh" },
  "keywords": ["jeûne", "ramadan", "maladie", "diabète"],
  "views_count": 891,
  "created_at": "2024-02-20T14:00:00Z",
  "answers": [
    {
      "id": "answer-uuid-001",
      "audio_stream_url": "https://minio.catk.org/maktabacatk/answers/qa-001-fr.mp3?...",
      "duration": "00:08:45",
      "transcript_fr": "Bismillah. En ce qui concerne le jeûne du diabétique...",
      "transcript_en": "Bismillah. Regarding the fasting of the diabetic person...",
      "transcript_ar": "بسم الله. فيما يتعلق بصيام المريض بالسكري...",
      "language": "fr",
      "created_at": "2024-02-21T10:00:00Z"
    }
  ]
}
```

---

## 📂 Catégories

### GET `/categories/`

Retourne toutes les catégories actives avec leur hiérarchie.

**Authentification requise :** Non

**Paramètres de requête :**
- `flat` — `true` pour liste plate (sans hiérarchie)
- `language` — Langue de tri

**Réponse 200 OK :**
```json
[
  {
    "id": "cat-uuid-001",
    "name_fr": "Fondements de l'Islam",
    "name_en": "Foundations of Islam",
    "name_ar": "أسس الإسلام",
    "slug": "fondements",
    "icon": "kaaba",
    "color": "#1B5E20",
    "order": 1,
    "is_active": true,
    "teachings_count": 24,
    "audios_count": 15,
    "subcategories": [
      {
        "id": "cat-uuid-002",
        "name_fr": "Aqida",
        "slug": "aqida",
        "teachings_count": 12
      }
    ]
  }
]
```

---

### GET `/categories/{slug}/`

Retourne une catégorie par son slug avec les contenus associés.

**Paramètres de chemin :**
- `slug` — Slug unique de la catégorie (ex: `fiqh`, `fondements`)

**Réponse 200 OK :**
```json
{
  "id": "cat-uuid-fiqh",
  "name_fr": "Fiqh",
  "name_en": "Islamic Jurisprudence",
  "name_ar": "الفقه الإسلامي",
  "slug": "fiqh",
  "description_fr": "La jurisprudence islamique couvre l'ensemble des règles...",
  "icon": "scale",
  "color": "#1A237E",
  "teachings_count": 45,
  "audios_count": 32,
  "questions_count": 110
}
```

---

## 🔍 Recherche

### GET `/search/`

Recherche globale dans tous les types de contenu.

**Authentification requise :** Non

**Paramètres de requête :**

| Paramètre | Type | Requis | Description | Exemple |
|-----------|------|--------|-------------|---------|
| `q` | string | ✅ | Terme de recherche (min 3 chars) | `?q=salat` |
| `lang` | string | ❌ | Langue des résultats | `?lang=fr` |
| `type` | string | ❌ | Type de contenu | `?type=teaching` |
| `category` | string | ❌ | Slug catégorie | `?category=fiqh` |
| `page` | int | ❌ | Numéro de page | `?page=2` |

**Valeurs pour `type` :** `teaching`, `audio`, `video`, `question`

**Réponse 200 OK :**
```json
{
  "query": "salat",
  "total_count": 78,
  "results": {
    "teachings": {
      "count": 30,
      "items": [
        {
          "id": "teach-uuid-001",
          "type": "teaching",
          "title": "La prière (Salat) en Islam",
          "description": "Un enseignement complet sur la prière...",
          "category": "Fiqh",
          "url": "/teachings/teach-uuid-001/",
          "cover_image": "...",
          "score": 0.95
        }
      ]
    },
    "audios": {
      "count": 20,
      "items": [...]
    },
    "videos": {
      "count": 15,
      "items": [...]
    },
    "questions": {
      "count": 13,
      "items": [...]
    }
  }
}
```

**Réponse 400 Bad Request :**
```json
{
  "q": ["Le terme de recherche doit contenir au moins 3 caractères."]
}
```

---

## 📊 Dashboard (Admin)

### GET `/dashboard/stats/`

Retourne les statistiques globales de la plateforme.

**Authentification requise :** ✅ Oui (Admin uniquement)

**Réponse 200 OK :**
```json
{
  "overview": {
    "total_teachings": 142,
    "total_audios": 89,
    "total_videos": 45,
    "total_questions": 210,
    "total_users": 1580,
    "total_views": 125420,
    "total_downloads": 48320
  },
  "this_month": {
    "new_users": 45,
    "total_views": 12500,
    "total_downloads": 3200,
    "most_viewed_teaching": {
      "id": "...",
      "title_fr": "Les piliers de l'Islam",
      "views": 450
    }
  },
  "content_by_category": [
    { "category": "Fiqh", "teachings": 45, "audios": 32, "questions": 110 },
    { "category": "Fondements", "teachings": 24, "audios": 15, "questions": 45 }
  ],
  "views_last_30_days": [
    { "date": "2024-11-01", "views": 380 },
    { "date": "2024-11-02", "views": 410 }
  ],
  "top_teachings": [
    { "id": "...", "title_fr": "Les piliers de l'Islam", "downloads": 340 }
  ]
}
```

---

## 👤 Profil Utilisateur

### GET `/users/me/`

Retourne le profil de l'utilisateur connecté.

**Authentification requise :** ✅ Oui

**Réponse 200 OK :**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "ahmed@exemple.com",
  "username": "ahmed_dupont",
  "first_name": "Ahmed",
  "last_name": "Dupont",
  "full_name": "Ahmed Dupont",
  "role": "member",
  "preferred_language": "fr",
  "avatar": "https://catk.org/media/avatars/ahmed.jpg",
  "is_email_verified": true,
  "favorites_count": 12,
  "joined_at": "2024-01-15T09:00:00Z"
}
```

---

### PATCH `/users/me/`

Modifie le profil de l'utilisateur connecté.

**Authentification requise :** ✅ Oui

**Corps de la requête (champs modifiables) :**
```json
{
  "first_name": "Ahmed",
  "last_name": "Dupont",
  "preferred_language": "ar",
  "avatar": "<binary_file>"
}
```

**Réponse 200 OK :** Profil mis à jour (même structure que GET).

**Note :** L'email et le mot de passe ont leurs propres endpoints dédiés.

---

### GET `/users/me/favorites/`

Retourne la liste des favoris de l'utilisateur.

**Authentification requise :** ✅ Oui

**Paramètres de requête :**
- `type` — Filtrer par type (`teaching`, `audio`, `video`, `question`)
- `page` — Numéro de page

**Réponse 200 OK :**
```json
{
  "count": 12,
  "results": [
    {
      "id": 45,
      "content_type": "teaching",
      "content_id": "teach-uuid-001",
      "content": {
        "id": "teach-uuid-001",
        "title_fr": "Les piliers de l'Islam",
        "cover_image": "...",
        "category_name": "Fondements"
      },
      "added_at": "2024-11-10T15:30:00Z"
    }
  ]
}
```

---

### POST `/users/me/favorites/`

Ajoute un contenu aux favoris.

**Authentification requise :** ✅ Oui

**Corps de la requête :**
```json
{
  "content_type": "teaching",
  "content_id": "teach-uuid-001"
}
```

**Réponse 201 Created :**
```json
{
  "id": 46,
  "content_type": "teaching",
  "content_id": "teach-uuid-001",
  "added_at": "2024-11-20T10:00:00Z"
}
```

**Réponse 400 Bad Request (déjà en favoris) :**
```json
{
  "detail": "Ce contenu est déjà dans vos favoris."
}
```

### DELETE `/users/me/favorites/{id}/`

Supprime un favori.

**Authentification requise :** ✅ Oui

**Réponse :** `204 No Content`

---

## 📎 Notes techniques

### Pagination

```json
{
  "count": 142,
  "next": "https://catk.org/api/v1/teachings/?page=3&page_size=20",
  "previous": "https://catk.org/api/v1/teachings/?page=1&page_size=20",
  "results": [...]
}
```

### Internationalisation

Les champs multilangues (`title_fr`, `title_en`, `title_ar`) sont toujours retournés.
Le client doit choisir la langue appropriée selon `preferred_language`.

### Rate Limiting

| Type d'utilisateur | Limite |
|-------------------|--------|
| Anonyme | 100 req/min |
| Authentifié | 1000 req/min |
| Admin | 5000 req/min |

### Gestion des erreurs

Format uniforme pour toutes les erreurs :
```json
{
  "detail": "Message d'erreur lisible.",
  "code": "error_code_machine_readable",
  "errors": {
    "field_name": ["Message d'erreur spécifique au champ."]
  }
}
```
