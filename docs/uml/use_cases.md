# 📊 Diagrammes UML — Maktaba CATK

## Table des matières

- [Diagramme de cas d'utilisation](#diagramme-de-cas-dutilisation)
- [Diagramme de séquence — Authentification](#diagramme-de-séquence--authentification)
- [Diagramme de séquence — Téléchargement PDF](#diagramme-de-séquence--téléchargement-pdf)
- [Diagramme d'activité — Recherche](#diagramme-dactivité--recherche)
- [Diagramme de classes simplifié](#diagramme-de-classes-simplifié)
- [Diagramme d'état — Enseignement](#diagramme-détat--enseignement)

---

## Diagramme de cas d'utilisation

```mermaid
graph TB
    %% Acteurs
    Visiteur([👤 Visiteur])
    Membre([👥 Membre])
    Editeur([✏️ Éditeur])
    Admin([🔧 Admin])
    SuperAdmin([👑 SuperAdmin])

    %% Héritage des acteurs
    Membre -->|étend| Visiteur
    Editeur -->|étend| Membre
    Admin -->|étend| Editeur
    SuperAdmin -->|étend| Admin

    %% Cas d'utilisation — Visiteur
    subgraph UC_PUBLIC ["🌐 Contenus publics"]
        UC1[Consulter les enseignements]
        UC2[Lire un PDF en ligne]
        UC3[Télécharger un PDF]
        UC4[Écouter un audio]
        UC5[Regarder une vidéo YouTube]
        UC6[Consulter les Q&R]
        UC7[Écouter la réponse audio]
        UC8[Lire la transcription]
        UC9[Rechercher du contenu]
        UC10[Parcourir les catégories]
        UC11[Changer la langue FR/EN/AR]
    end

    %% Cas d'utilisation — Membre
    subgraph UC_MEMBRE ["🔐 Fonctionnalités membres"]
        UC20[S'inscrire]
        UC21[Se connecter]
        UC22[Vérifier son email]
        UC23[Réinitialiser son mot de passe]
        UC24[Gérer son profil]
        UC25[Ajouter aux favoris]
        UC26[Voir ses favoris]
        UC27[Voir son historique]
        UC28[Se connecter via Google]
    end

    %% Cas d'utilisation — Admin
    subgraph UC_ADMIN ["⚙️ Administration"]
        UC40[Créer un enseignement]
        UC41[Modifier un enseignement]
        UC42[Publier/Archiver un enseignement]
        UC43[Uploader un PDF]
        UC44[Gérer les audios]
        UC45[Gérer les vidéos YouTube]
        UC46[Gérer les Q&R]
        UC47[Uploader une réponse audio]
        UC48[Voir les statistiques dashboard]
        UC49[Gérer les catégories]
    end

    %% Cas d'utilisation — SuperAdmin
    subgraph UC_SUPERADMIN ["👑 Super Administration"]
        UC60[Gérer les utilisateurs]
        UC61[Modifier les rôles]
        UC62[Suspendre/Réactiver un compte]
        UC63[Voir les logs d'audit]
    end

    %% Associations Visiteur
    Visiteur --- UC1
    Visiteur --- UC2
    Visiteur --- UC3
    Visiteur --- UC4
    Visiteur --- UC5
    Visiteur --- UC6
    Visiteur --- UC7
    Visiteur --- UC8
    Visiteur --- UC9
    Visiteur --- UC10
    Visiteur --- UC11
    Visiteur --- UC20
    Visiteur --- UC21
    Visiteur --- UC28

    %% Associations Membre (en plus de Visiteur)
    Membre --- UC22
    Membre --- UC23
    Membre --- UC24
    Membre --- UC25
    Membre --- UC26
    Membre --- UC27

    %% Associations Admin
    Admin --- UC40
    Admin --- UC41
    Admin --- UC42
    Admin --- UC43
    Admin --- UC44
    Admin --- UC45
    Admin --- UC46
    Admin --- UC47
    Admin --- UC48
    Admin --- UC49

    %% Associations SuperAdmin
    SuperAdmin --- UC60
    SuperAdmin --- UC61
    SuperAdmin --- UC62
    SuperAdmin --- UC63

    %% Style
    style Visiteur fill:#E3F2FD,stroke:#1565C0
    style Membre fill:#E8F5E9,stroke:#2E7D32
    style Editeur fill:#FFF3E0,stroke:#E65100
    style Admin fill:#FCE4EC,stroke:#880E4F
    style SuperAdmin fill:#EDE7F6,stroke:#4527A0
```

---

## Diagramme de séquence — Authentification

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant C as Client (React/Flutter)
    participant N as Nginx
    participant A as API Django
    participant DB as PostgreSQL
    participant R as Redis
    participant E as Email Service

    Note over U,E: Inscription
    U->>C: Remplit formulaire inscription
    C->>N: POST /api/v1/auth/register/
    N->>A: Forward request
    A->>A: Valider données (email unique, password fort)
    A->>DB: INSERT User (is_active=False)
    DB-->>A: User créé
    A->>E: Envoyer email vérification (async Celery)
    A-->>C: 201 Created { "message": "Vérifiez votre email" }
    C-->>U: Afficher message de succès

    Note over U,E: Vérification email
    U->>U: Ouvre l'email et clique sur le lien
    U->>C: Visite /verify-email?token=xxx
    C->>A: POST /api/v1/auth/verify-email/ { token }
    A->>A: Vérifier token HMAC (valide 24h)
    A->>DB: UPDATE User (is_active=True)
    A-->>C: 200 OK { "message": "Email vérifié" }
    C-->>U: Redirection vers page connexion

    Note over U,E: Connexion
    U->>C: Saisit email + password
    C->>N: POST /api/v1/auth/login/
    N->>A: Forward (Rate limit: 5 req/min/IP)
    A->>DB: SELECT User WHERE email=...
    DB-->>A: User data
    A->>A: Vérifier hash password (PBKDF2)
    A->>A: Générer JWT (access: 1h, refresh: 7j)
    A->>R: Stocker refresh token hash
    A-->>C: 200 OK { access, refresh, user }
    C->>C: Stocker tokens (memory/SecureStorage)
    C-->>U: Redirection vers dashboard

    Note over U,E: Rafraîchissement automatique
    C->>C: Intercepteur : access token expiré
    C->>A: POST /api/v1/auth/refresh/ { refresh }
    A->>R: Vérifier refresh token (non blacklisté)
    A->>A: Générer nouveau pair de tokens
    A->>R: Blacklister ancien refresh token
    A-->>C: 200 OK { access, refresh }
    C->>C: Mettre à jour les tokens
    C->>A: Retenter la requête originale
```

---

## Diagramme de séquence — Téléchargement PDF

```mermaid
sequenceDiagram
    actor V as Visiteur
    participant C as Client
    participant A as API Django
    participant S as TeachingService
    participant DB as PostgreSQL
    participant M as MinIO
    participant Q as Celery Queue

    V->>C: Clique "Télécharger"
    C->>A: POST /api/v1/teachings/{id}/download/

    A->>A: JWTAuthentication (optionnel)
    A->>S: record_download(id, user, ip)

    S->>DB: SELECT Teaching WHERE id=... AND status='published'
    DB-->>S: Teaching { pdf_file: "teachings/piliers.pdf" }

    S->>DB: UPDATE downloads_count = downloads_count + 1
    DB-->>S: OK

    S->>M: presigned_get_object(bucket, "teachings/piliers.pdf", expires=3600)
    M-->>S: Signed URL (valide 1 heure)

    S->>Q: record_download_log.delay(content_type, id, user_id, ip)
    Note over Q: Tâche asynchrone (non bloquante)

    S-->>A: { download_url, expires_in: 3600, filename }
    A-->>C: 200 OK { download_url: "https://..." }

    C->>V: Ouvre URL dans un nouvel onglet / déclenche téléchargement
    V->>M: GET URL présignée
    M-->>V: Fichier PDF (streaming direct depuis MinIO)
```

---

## Diagramme d'activité — Recherche

```mermaid
flowchart TD
    Start([▶ Utilisateur tape dans la barre de recherche])
    Debounce{Délai 300ms\nécoule ?}
    MinLength{q.length >= 3 ?}
    BuildQuery[Construire requête:\n- q, lang, type, category, page]
    CheckCache{Résultats\nen cache Redis ?}
    QueryDB[Requête PostgreSQL\nFull-Text Search]
    Rank[Classer par pertinence\n+ boost popularité]
    CacheStore[Stocker en cache\nRedis TTL: 5 min]
    FormatResponse[Formater réponse:\nGroup par type]
    Empty{Résultats\nvides ?}
    ShowSuggestions[Afficher suggestions\nalternatives]
    ShowResults[Afficher résultats\ngroupés par type]
    LogSearch[Logger la recherche\nasync Celery]
    End([⏹ Fin])

    Start --> Debounce
    Debounce -->|Non| Start
    Debounce -->|Oui| MinLength
    MinLength -->|Non| End
    MinLength -->|Oui| BuildQuery
    BuildQuery --> CheckCache
    CheckCache -->|Oui - Cache hit| FormatResponse
    CheckCache -->|Non - Cache miss| QueryDB
    QueryDB --> Rank
    Rank --> CacheStore
    CacheStore --> FormatResponse
    FormatResponse --> Empty
    Empty -->|Oui| ShowSuggestions
    Empty -->|Non| ShowResults
    ShowSuggestions --> LogSearch
    ShowResults --> LogSearch
    LogSearch --> End
```

---

## Diagramme de classes simplifié

```mermaid
classDiagram
    class User {
        +UUID id
        +string email
        +string username
        +string role
        +string preferred_language
        +boolean is_email_verified
        +get_full_name() string
        +has_role(role) boolean
    }

    class Category {
        +UUID id
        +string name_fr
        +string name_en
        +string name_ar
        +string slug
        +Category parent
        +int order
        +get_localized_name(lang) string
        +get_children() QuerySet
    }

    class Teaching {
        +UUID id
        +string title_fr
        +string title_en
        +string title_ar
        +Category category
        +User author
        +string pdf_file
        +string status
        +int views_count
        +int downloads_count
        +boolean is_featured
        +publish() void
        +archive() void
        +get_signed_download_url() string
    }

    class Audio {
        +UUID id
        +string title_fr
        +string title_en
        +string title_ar
        +Category category
        +string audio_file
        +timedelta duration
        +int plays_count
        +get_stream_url() string
    }

    class Video {
        +UUID id
        +string title_fr
        +string youtube_url
        +string youtube_id
        +timedelta duration
        +int views_count
        +get_embed_url() string
        +get_thumbnail_url() string
    }

    class Question {
        +UUID id
        +string title_fr
        +string question_fr
        +Category category
        +string keywords
        +int views_count
    }

    class Answer {
        +UUID id
        +Question question
        +string audio_file
        +timedelta duration
        +string transcript_fr
        +string language
        +int order
    }

    class Favorite {
        +int id
        +User user
        +string content_type
        +UUID content_id
        +datetime created_at
    }

    class ContentView {
        +int id
        +string content_type
        +UUID content_id
        +User user
        +string ip_address
        +datetime created_at
    }

    User "1" --> "0..*" Teaching : crée
    User "1" --> "0..*" Favorite : possède
    User "1" --> "0..*" ContentView : génère
    Category "1" --> "0..*" Teaching : classifie
    Category "1" --> "0..*" Audio : classifie
    Category "1" --> "0..*" Question : classifie
    Category "0..1" --> "0..*" Category : parent de
    Question "1" --> "1..*" Answer : possède
```

---

## Diagramme d'état — Enseignement

```mermaid
stateDiagram-v2
    [*] --> Draft : Admin crée l'enseignement

    Draft --> Draft : Admin modifie les métadonnées
    Draft --> Draft : Admin uploade le PDF
    Draft --> Published : Admin publie (publish())

    Published --> Draft : Admin dépublie
    Published --> Archived : Admin archive (archive())
    Published --> Published : Vues/téléchargements incrémentés

    Archived --> Published : Admin restaure

    Published --> [*] : Suppression définitive (superadmin)

    note right of Draft
        - Visible seulement par les admins
        - status = "draft"
        - published_at = null
    end note

    note right of Published
        - Visible par tous les visiteurs
        - status = "published"
        - published_at = now()
        - Indexé dans la recherche
    end note

    note right of Archived
        - Masqué des listes publiques
        - status = "archived"
        - Accessible par URL directe (admin)
        - Conservé pour historique
    end note
```
