# 🏗 Architecture Technique — Maktaba CATK

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Diagramme d'architecture](#diagramme-darchitecture)
- [Clean Architecture](#clean-architecture)
- [Repository Pattern](#repository-pattern)
- [Service Layer](#service-layer)
- [DTO Pattern](#dto-pattern)
- [Flux de données](#flux-de-données)
- [Sécurité](#sécurité)
- [Scalabilité](#scalabilité)

---

## Vue d'ensemble

Maktaba CATK adopte une architecture **multi-tier** découplée inspirée des principes de la **Clean Architecture** de Robert C. Martin. Le système est divisé en couches indépendantes qui communiquent via des interfaces définies, garantissant maintenabilité et testabilité.

### Principes directeurs

| Principe | Application |
|----------|-------------|
| **Séparation des préoccupations** | Backend API / Frontend SPA / Mobile |
| **Inversion de dépendances** | Repositories abstraits, injection de dépendances |
| **Single Responsibility** | Chaque app Django a une seule responsabilité |
| **DRY** | DTOs partagés, composants React réutilisables |
| **YAGNI** | Pas de sur-ingénierie, fonctionnalités itératives |

---

## Diagramme d'architecture

### Vue macroscopique

```
╔═══════════════════════════════════════════════════════════════════╗
║                    COUCHE PRÉSENTATION                            ║
║                                                                   ║
║  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ║
║  │   React Web     │  │  Flutter Mobile │  │  Django Admin   │  ║
║  │   (Vite + TS)   │  │  (iOS/Android)  │  │  (Backoffice)   │  ║
║  │   Port: 3000    │  │  App Store/Play │  │  /admin/        │  ║
║  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  ║
╚═══════════╪═══════════════════╪════════════════════╪════════════╝
            │                   │                    │
            └─────────────────┬─┴────────────────────┘
                               │
                         HTTPS/JSON API
                               │
╔══════════════════════════════╪════════════════════════════════════╗
║              COUCHE PASSERELLE (NGINX 1.27)                       ║
║                               │                                   ║
║  ┌────────────────────────────▼────────────────────────────────┐ ║
║  │  • Reverse Proxy         • Gzip compression                 │ ║
║  │  • SSL/TLS Termination   • Rate Limiting                    │ ║
║  │  • Load Balancing        • Static files serving             │ ║
║  │  • CORS headers          • Security headers (HSTS, CSP)     │ ║
║  └────────────────────────────┬────────────────────────────────┘ ║
╚═══════════════════════════════╪════════════════════════════════════╝
                                │
╔═══════════════════════════════╪════════════════════════════════════╗
║              COUCHE APPLICATION (Django 5 + DRF 3.15)             ║
║                               │                                   ║
║  ┌────────────────────────────▼────────────────────────────────┐ ║
║  │                    URL Router                               │ ║
║  │    /api/v1/auth/   /api/v1/teachings/   /api/v1/audios/    │ ║
║  │    /api/v1/videos/ /api/v1/questions/   /api/v1/search/    │ ║
║  └──────┬──────────────┬──────────────┬──────────────┬────────┘ ║
║         │              │              │              │           ║
║  ┌──────▼────┐  ┌──────▼────┐  ┌──────▼────┐  ┌──────▼────┐  ║
║  │  Auth     │  │ Teachings │  │  Audios/  │  │Questions  │  ║
║  │  App      │  │  App      │  │  Videos   │  │  App      │  ║
║  │           │  │           │  │  Apps     │  │           │  ║
║  │ ViewSets  │  │ ViewSets  │  │ ViewSets  │  │ ViewSets  │  ║
║  │ Services  │  │ Services  │  │ Services  │  │ Services  │  ║
║  │ Serializ. │  │ Serializ. │  │ Serializ. │  │ Serializ. │  ║
║  └──────┬────┘  └──────┬────┘  └──────┬────┘  └──────┬────┘  ║
║         └──────────────┴──────────────┴──────────────┘           ║
║                               │                                   ║
║  ┌────────────────────────────▼────────────────────────────────┐ ║
║  │                 Repository Layer                            │ ║
║  │   TeachingRepository | AudioRepository | UserRepository    │ ║
║  └────────────────────────────┬────────────────────────────────┘ ║
╚═══════════════════════════════╪════════════════════════════════════╝
                                │
╔═══════════════════════════════╪════════════════════════════════════╗
║              COUCHE DONNÉES                                       ║
║                               │                                   ║
║  ┌──────────────┐  ┌──────────▼───────┐  ┌─────────────────┐   ║
║  │   Redis 7    │  │  PostgreSQL 16   │  │    MinIO        │   ║
║  │              │  │                  │  │  (S3-compat.)   │   ║
║  │ • Cache API  │  │ • Données métier │  │                 │   ║
║  │ • Sessions   │  │ • Users          │  │ • PDFs          │   ║
║  │ • Celery     │  │ • Teachings      │  │ • Audios MP3    │   ║
║  │   broker     │  │ • Categories     │  │ • Images        │   ║
║  │ • Rate limit │  │ • Stats          │  │ • Cover arts    │   ║
║  └──────────────┘  └──────────────────┘  └─────────────────┘   ║
╚═══════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════╗
║              COUCHE TÂCHES ASYNCHRONES (Celery 5)                ║
║                                                                   ║
║  ┌─────────────────────────────────────────────────────────────┐ ║
║  │  Worker Queue: default | high_priority                      │ ║
║  │                                                             │ ║
║  │  • Envoi d'emails (vérification, reset password)           │ ║
║  │  • Génération thumbnails                                    │ ║
║  │  • Calcul statistiques agrégées                            │ ║
║  │  • Indexation recherche                                     │ ║
║  │  • Cleanup fichiers temporaires                            │ ║
║  └─────────────────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════════════╝
```

### Vue microscopique — Application Django

```
apps/
├── authentication/
│   ├── models.py          User (AbstractBaseUser)
│   ├── serializers.py     LoginSerializer, RegisterSerializer
│   ├── views.py           LoginView, RefreshView, RegisterView
│   ├── services.py        AuthService (logique métier)
│   ├── repositories.py    UserRepository
│   └── urls.py
│
├── teachings/
│   ├── models.py          Teaching (multilingual)
│   ├── serializers.py     TeachingListSerializer, TeachingDetailSerializer
│   ├── views.py           TeachingViewSet (CRUD + actions)
│   ├── services.py        TeachingService
│   ├── repositories.py    TeachingRepository
│   ├── filters.py         TeachingFilter (django-filter)
│   ├── permissions.py     IsAdminOrReadOnly
│   └── urls.py
│
└── ... (même structure pour audios, videos, questions, categories)
```

---

## Clean Architecture

### Les 4 couches

```
┌─────────────────────────────────────────────────┐
│              4. FRAMEWORKS & DRIVERS             │
│         Django, DRF, PostgreSQL, Redis           │
│  ┌────────────────────────────────────────────┐ │
│  │         3. INTERFACE ADAPTERS              │ │
│  │  ViewSets, Serializers, Repositories       │ │
│  │  ┌──────────────────────────────────────┐ │ │
│  │  │       2. APPLICATION USE CASES       │ │ │
│  │  │  Services: AuthService, TeachingSvc  │ │ │
│  │  │  ┌──────────────────────────────┐   │ │ │
│  │  │  │    1. ENTERPRISE ENTITIES    │   │ │ │
│  │  │  │  User, Teaching, Audio,      │   │ │ │
│  │  │  │  Video, Question, Answer     │   │ │ │
│  │  │  └──────────────────────────────┘   │ │ │
│  │  └──────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘

Règle de dépendance : les couches internes
ne dépendent JAMAIS des couches externes.
```

### Exemple concret : Téléchargement d'un PDF

```
Request: POST /api/v1/teachings/uuid/download/
    │
    ▼
TeachingViewSet.download_action()         [Interface Adapter]
    │ appelle
    ▼
TeachingService.record_download(id, user) [Use Case]
    │ appelle
    ▼
DownloadRepository.create(...)            [Interface Adapter]
    │ appelle
    ▼
Download.objects.create(...)              [Framework - Django ORM]
    │
    ▼
Response: 200 OK { "download_url": "..." }
```

---

## Repository Pattern

Le Repository Pattern abstrait l'accès aux données, permettant de changer d'ORM ou de base de données sans modifier la logique métier.

```python
# Interface abstraite (contrat)
class BaseRepository(ABC):
    @abstractmethod
    def get_by_id(self, id: UUID) -> Optional[Model]:
        pass

    @abstractmethod
    def list(self, filters: dict) -> QuerySet:
        pass

    @abstractmethod
    def create(self, data: dict) -> Model:
        pass

    @abstractmethod
    def update(self, id: UUID, data: dict) -> Model:
        pass

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        pass


# Implémentation concrète
class TeachingRepository(BaseRepository):
    def get_by_id(self, id: UUID) -> Optional[Teaching]:
        return Teaching.objects.select_related(
            'category', 'author'
        ).filter(id=id, status='published').first()

    def list(self, filters: dict) -> QuerySet:
        queryset = Teaching.objects.filter(status='published')
        if category := filters.get('category'):
            queryset = queryset.filter(category__slug=category)
        if language := filters.get('language'):
            queryset = queryset.filter(language=language)
        return queryset.order_by('-published_at')

    def get_featured(self, limit: int = 6) -> QuerySet:
        return Teaching.objects.filter(
            status='published',
            is_featured=True
        ).order_by('-published_at')[:limit]
```

---

## Service Layer

La couche Service encapsule toute la logique métier, indépendamment du framework HTTP.

```python
class TeachingService:
    def __init__(self, repository: TeachingRepository):
        self.repository = repository

    def get_teaching_detail(self, teaching_id: UUID, user=None) -> dict:
        """Récupère un enseignement et enregistre la vue."""
        teaching = self.repository.get_by_id(teaching_id)
        if not teaching:
            raise TeachingNotFoundError(teaching_id)

        # Enregistrer la vue (tâche asynchrone)
        record_view.delay(
            content_type='teaching',
            content_id=str(teaching_id),
            user_id=str(user.id) if user else None
        )

        return teaching

    def record_download(self, teaching_id: UUID, user=None, ip: str = None) -> str:
        """Enregistre un téléchargement et retourne l'URL signée."""
        teaching = self.repository.get_by_id(teaching_id)
        if not teaching:
            raise TeachingNotFoundError(teaching_id)

        # Incrémenter le compteur
        Teaching.objects.filter(id=teaching_id).update(
            downloads_count=F('downloads_count') + 1
        )

        # Générer URL signée MinIO (valide 1h)
        signed_url = minio_client.presigned_get_object(
            bucket_name=settings.MINIO_BUCKET_NAME,
            object_name=teaching.pdf_file.name,
            expires=timedelta(hours=1)
        )

        # Log asynchrone
        record_download_log.delay(
            content_type='teaching',
            content_id=str(teaching_id),
            user_id=str(user.id) if user else None,
            ip_address=ip
        )

        return signed_url
```

---

## DTO Pattern

Les **Data Transfer Objects** (DTOs) sont implémentés via les Serializers DRF. Ils garantissent la validation des données et séparent la représentation API du modèle de données.

```python
# DTO léger pour les listes
class TeachingListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name_fr', read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = Teaching
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar',
            'category_name', 'author_name',
            'cover_image', 'language',
            'views_count', 'downloads_count',
            'is_featured', 'published_at'
        ]


# DTO complet pour le détail
class TeachingDetailSerializer(TeachingListSerializer):
    category = CategorySerializer(read_only=True)
    related_teachings = serializers.SerializerMethodField()

    class Meta(TeachingListSerializer.Meta):
        fields = TeachingListSerializer.Meta.fields + [
            'description_fr', 'description_en', 'description_ar',
            'pdf_file', 'category', 'related_teachings'
        ]

    def get_related_teachings(self, obj):
        related = Teaching.objects.filter(
            category=obj.category,
            status='published'
        ).exclude(id=obj.id)[:3]
        return TeachingListSerializer(related, many=True).data


# DTO d'écriture avec validation
class TeachingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teaching
        fields = [
            'title_fr', 'title_en', 'title_ar',
            'description_fr', 'description_en', 'description_ar',
            'category', 'pdf_file', 'cover_image', 'language'
        ]

    def validate_pdf_file(self, value):
        if not value.name.endswith('.pdf'):
            raise serializers.ValidationError("Le fichier doit être un PDF.")
        if value.size > 50 * 1024 * 1024:  # 50 MB
            raise serializers.ValidationError("Taille maximale: 50 MB.")
        return value
```

---

## Flux de données

### Flux de lecture (GET)

```
Client
  │
  │ GET /api/v1/teachings/?category=fiqh&lang=fr&page=2
  ▼
Nginx                          ← Rate limit, cache headers
  │
  ▼
DRF Router
  │
  ▼
TeachingViewSet.list()
  │
  ├─ Authentication: JWTAuthentication (optionnel)
  ├─ Permissions: AllowAny
  ├─ Throttling: 100 req/min anonymous, 1000 req/min authenticated
  │
  ▼
TeachingFilter (django-filter)
  ├─ category__slug = 'fiqh'
  ├─ language = 'fr'
  └─ status = 'published'
  │
  ▼
QuerySet → PostgreSQL
  ├─ SELECT with JOIN (category, author)
  ├─ OFFSET 20 LIMIT 20  (page 2)
  └─ ORDER BY published_at DESC
  │
  ▼
Redis Cache (TTL: 5 min)       ← Check cache d'abord
  │
  ▼
TeachingListSerializer         ← Sérialisation / DTO
  │
  ▼
PaginatedResponse JSON
  └─ { count, next, previous, results: [...] }
  │
  ▼
Client
```

### Flux d'upload (POST admin)

```
Admin Client
  │
  │ POST /api/v1/teachings/ (multipart/form-data)
  ▼
JWTAuthentication + IsAdminUser
  │
  ▼
TeachingCreateSerializer.validate()
  ├─ Validation champs requis
  ├─ Validation type fichier PDF
  └─ Validation taille (≤ 50 MB)
  │
  ▼
TeachingService.create_teaching()
  │
  ├─ Upload PDF → MinIO (async via Celery)
  ├─ Génération thumbnail (Celery task)
  ├─ Teaching.objects.create()
  └─ Invalidation cache Redis
  │
  ▼
TeachingDetailSerializer       ← Réponse 201 Created
```

---

## Sécurité

### Modèle d'authentification

```
1. Inscription
   POST /auth/register/
   └─ Hash mot de passe (PBKDF2-SHA256)
   └─ Envoi email vérification (token 24h, Celery)
   └─ Compte inactif jusqu'à vérification

2. Connexion
   POST /auth/login/
   └─ Vérification credentials
   └─ Émission JWT:
      ├─ Access token  (1 heure)
      └─ Refresh token (7 jours, rotation)

3. Rafraîchissement
   POST /auth/refresh/
   └─ Validation refresh token
   └─ Nouveau pair de tokens (rotation)
   └─ Ancien refresh token blacklisté

4. Requêtes authentifiées
   Authorization: Bearer <access_token>
   └─ Validation signature JWT
   └─ Vérification expiration
   └─ Injection user dans request
```

### Contrôle d'accès (RBAC)

```python
# Rôles disponibles
ROLES = {
    'anonymous':   ['read_public_content'],
    'member':      ['read_public_content', 'add_favorite', 'view_history'],
    'editor':      ['member_permissions', 'create_content', 'edit_own_content'],
    'admin':       ['editor_permissions', 'manage_all_content', 'view_stats'],
    'superadmin':  ['admin_permissions', 'manage_users', 'manage_roles'],
}

# Exemple de permission personnalisée
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True  # GET, HEAD, OPTIONS → public
        return request.user.is_authenticated and request.user.is_staff
```

### Headers de sécurité (Nginx)

```nginx
add_header Strict-Transport-Security  "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options            "SAMEORIGIN" always;
add_header X-Content-Type-Options     "nosniff" always;
add_header X-XSS-Protection           "1; mode=block" always;
add_header Referrer-Policy            "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.youtube.com; frame-src https://www.youtube.com;" always;
```

---

## Scalabilité

### Stratégie de cache

```
L1: Redis (5-15 min)
    ├─ Liste enseignements par catégorie
    ├─ Enseignements en vedette
    ├─ Statistiques dashboard
    └─ Résultats de recherche fréquents

L2: CDN Cloudflare (1h+)
    ├─ Assets statiques (JS, CSS, images)
    └─ Réponses API publiques cachables

L3: PostgreSQL Query Cache
    └─ Requêtes fréquentes avec EXPLAIN ANALYZE
```

### Optimisations base de données

```python
# Indexes sur les champs filtrés fréquemment
class Teaching(models.Model):
    class Meta:
        indexes = [
            models.Index(fields=['status', 'published_at']),
            models.Index(fields=['category', 'language']),
            models.Index(fields=['is_featured', 'status']),
        ]

# Select_related pour éviter N+1
Teaching.objects.select_related('category', 'author') \
                .prefetch_related('tags') \
                .filter(status='published')
```

### Scalabilité horizontale

```
Pour ≥ 10 000 utilisateurs simultanés :

┌─────────────────────────────────────┐
│           Load Balancer             │
│         (Nginx / HAProxy)           │
└──────┬──────────────────┬───────────┘
       │                  │
┌──────▼──────┐    ┌──────▼──────┐
│  Backend 1  │    │  Backend 2  │
│  (Gunicorn) │    │  (Gunicorn) │
└─────────────┘    └─────────────┘
       │                  │
┌──────▼──────────────────▼──────────┐
│        PostgreSQL (Primary)         │
│  + Read Replicas pour SELECT        │
└─────────────────────────────────────┘
```
