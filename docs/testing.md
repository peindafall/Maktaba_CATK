# 🧪 Plan de Tests — Maktaba CATK

## Table des matières

- [Stratégie de test](#stratégie-de-test)
- [Tests unitaires Backend](#1-tests-unitaires-backend-pytest-django)
- [Tests d'intégration API](#2-tests-dintégration-api-drf-testcase)
- [Tests Frontend](#3-tests-frontend-vitest--testing-library)
- [Tests Flutter](#4-tests-flutter-flutter_test)
- [Tests de performance](#5-tests-de-performance-locust)
- [Tests de sécurité](#6-tests-de-sécurité-owasp-zap)
- [Couverture de code](#couverture-de-code)
- [Intégration CI/CD](#intégration-cicd)

---

## Stratégie de test

### Pyramide de tests

```
        ▲
       /△\      Tests E2E (Playwright)        → 5%   — Lents, coûteux
      / △ \     Tests d'intégration API       → 25%  — Moyens
     /  △  \    Tests unitaires               → 70%  — Rapides, nombreux
    /________\
```

### Objectifs de couverture

| Composant | Couverture cible | Couverture actuelle |
|-----------|-----------------|---------------------|
| Backend (Python) | ≥ 85% | 🔄 En cours |
| Frontend (TS/React) | ≥ 75% | 🔄 En cours |
| Flutter | ≥ 70% | ⏳ Planifié |
| API Endpoints | 100% | ✅ Tous couverts |

---

## 1. Tests unitaires Backend (pytest-django)

### Configuration

```python
# backend/pytest.ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings.testing
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = --cov=apps --cov-report=xml --cov-report=term-missing -v
```

```python
# config/settings/testing.py
from .base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Cache en mémoire (pas Redis)
CACHES = {
    'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}
}

# Celery en mode synchrone (pas de broker)
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# Email vers console
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
```

### Structure des tests

```
backend/apps/
├── authentication/
│   └── tests/
│       ├── test_models.py
│       ├── test_serializers.py
│       ├── test_services.py
│       └── test_views.py
├── teachings/
│   └── tests/
│       ├── test_models.py
│       ├── test_filters.py
│       ├── test_services.py
│       └── test_views.py
└── ...
```

### Exemples de tests

#### Tests de modèles (`test_models.py`)

```python
import pytest
from django.utils import timezone
from apps.teachings.models import Teaching
from apps.categories.models import Category


@pytest.fixture
def category(db):
    return Category.objects.create(
        name_fr="Fiqh",
        name_en="Fiqh",
        name_ar="الفقه",
        slug="fiqh"
    )


@pytest.fixture
def teaching(db, category, admin_user):
    return Teaching.objects.create(
        title_fr="La prière",
        title_en="The Prayer",
        title_ar="الصلاة",
        category=category,
        author=admin_user,
        status="published",
        published_at=timezone.now()
    )


class TestTeachingModel:
    def test_teaching_str(self, teaching):
        assert str(teaching) == "La prière"

    def test_teaching_default_status_is_draft(self, db, category):
        t = Teaching.objects.create(
            title_fr="Test",
            title_en="Test",
            title_ar="Test",
            category=category
        )
        assert t.status == "draft"

    def test_teaching_views_count_defaults_to_zero(self, teaching):
        assert teaching.views_count == 0
        assert teaching.downloads_count == 0

    def test_teaching_is_published_when_status_is_published(self, teaching):
        assert teaching.status == "published"
        assert teaching.published_at is not None

    def test_category_slug_is_unique(self, db, category):
        with pytest.raises(Exception):
            Category.objects.create(
                name_fr="Autre",
                name_en="Other",
                name_ar="أخرى",
                slug="fiqh"  # Duplicate slug
            )
```

#### Tests de serializers (`test_serializers.py`)

```python
import pytest
from apps.teachings.serializers import TeachingCreateSerializer


class TestTeachingCreateSerializer:
    def test_valid_data_passes_validation(self, db, category):
        data = {
            'title_fr': 'Test enseignement',
            'title_en': 'Test teaching',
            'title_ar': 'اختبار',
            'category': str(category.id),
            'language': 'fr',
        }
        serializer = TeachingCreateSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

    def test_title_fr_is_required(self, db, category):
        data = {
            'title_en': 'Test teaching',
            'title_ar': 'اختبار',
            'category': str(category.id),
        }
        serializer = TeachingCreateSerializer(data=data)
        assert not serializer.is_valid()
        assert 'title_fr' in serializer.errors

    def test_pdf_file_must_be_pdf(self, db, category, mock_txt_file):
        data = {
            'title_fr': 'Test',
            'title_en': 'Test',
            'title_ar': 'Test',
            'category': str(category.id),
            'pdf_file': mock_txt_file,
        }
        serializer = TeachingCreateSerializer(data=data)
        assert not serializer.is_valid()
        assert 'pdf_file' in serializer.errors
```

#### Tests de services (`test_services.py`)

```python
import pytest
from unittest.mock import patch, MagicMock
from apps.teachings.services import TeachingService
from apps.teachings.repositories import TeachingRepository


class TestTeachingService:
    @pytest.fixture
    def service(self):
        return TeachingService(repository=TeachingRepository())

    def test_get_teaching_records_view(self, db, teaching, service):
        with patch('apps.teachings.services.record_view.delay') as mock_task:
            result = service.get_teaching_detail(teaching.id)
            mock_task.assert_called_once_with(
                content_type='teaching',
                content_id=str(teaching.id),
                user_id=None
            )
            assert result.id == teaching.id

    def test_get_teaching_not_found_raises_error(self, db, service):
        import uuid
        from apps.teachings.exceptions import TeachingNotFoundError
        with pytest.raises(TeachingNotFoundError):
            service.get_teaching_detail(uuid.uuid4())

    def test_record_download_increments_counter(self, db, teaching, service):
        with patch('apps.teachings.services.minio_client') as mock_minio:
            mock_minio.presigned_get_object.return_value = 'https://signed-url.example.com'
            service.record_download(teaching.id)
            teaching.refresh_from_db()
            assert teaching.downloads_count == 1
```

### Lancer les tests backend

```bash
# Tous les tests
cd backend && pytest apps/ -v

# Avec couverture
cd backend && pytest apps/ --cov=apps --cov-report=html

# Tests d'une app spécifique
cd backend && pytest apps/teachings/ -v

# Tests avec un marqueur spécifique
cd backend && pytest apps/ -m "not slow" -v

# Test en parallèle
cd backend && pytest apps/ -n auto -v
```

---

## 2. Tests d'intégration API (DRF TestCase)

### Exemples de tests d'intégration

```python
import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client(api_client, member_user, tokens):
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {tokens["access"]}')
    return api_client


class TestTeachingListAPI:
    def test_list_returns_200(self, api_client, db, published_teachings):
        url = reverse('teaching-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_list_is_paginated(self, api_client, db, published_teachings):
        url = reverse('teaching-list')
        response = api_client.get(url)
        assert 'count' in response.data
        assert 'results' in response.data
        assert 'next' in response.data

    def test_list_only_shows_published(self, api_client, db, draft_teaching, published_teaching):
        url = reverse('teaching-list')
        response = api_client.get(url)
        ids = [t['id'] for t in response.data['results']]
        assert str(published_teaching.id) in ids
        assert str(draft_teaching.id) not in ids

    def test_filter_by_category(self, api_client, db, teachings_by_category):
        url = reverse('teaching-list') + '?category=fiqh'
        response = api_client.get(url)
        assert response.status_code == 200
        for teaching in response.data['results']:
            assert teaching['category_slug'] == 'fiqh'

    def test_filter_by_language(self, api_client, db, teachings_by_language):
        url = reverse('teaching-list') + '?language=ar'
        response = api_client.get(url)
        for teaching in response.data['results']:
            assert teaching['language'] == 'ar'


class TestTeachingDownloadAPI:
    def test_download_increments_counter(self, api_client, db, published_teaching):
        url = reverse('teaching-download', args=[published_teaching.id])
        initial_count = published_teaching.downloads_count
        with patch('apps.teachings.views.minio_client') as mock_minio:
            mock_minio.presigned_get_object.return_value = 'http://signed.url'
            response = api_client.post(url)
        assert response.status_code == 200
        published_teaching.refresh_from_db()
        assert published_teaching.downloads_count == initial_count + 1

    def test_download_returns_signed_url(self, api_client, db, published_teaching):
        url = reverse('teaching-download', args=[published_teaching.id])
        with patch('apps.teachings.views.minio_client') as mock_minio:
            mock_minio.presigned_get_object.return_value = 'http://signed.url/file.pdf'
            response = api_client.post(url)
        assert 'download_url' in response.data
        assert 'expires_in' in response.data


class TestAuthAPI:
    def test_login_returns_tokens(self, api_client, db, member_user):
        url = reverse('auth-login')
        response = api_client.post(url, {
            'email': member_user.email,
            'password': 'testpassword123'
        })
        assert response.status_code == 200
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_login_wrong_password_returns_401(self, api_client, db, member_user):
        url = reverse('auth-login')
        response = api_client.post(url, {
            'email': member_user.email,
            'password': 'wrongpassword'
        })
        assert response.status_code == 401

    def test_protected_endpoint_requires_auth(self, api_client):
        url = reverse('user-me')
        response = api_client.get(url)
        assert response.status_code == 401

    def test_protected_endpoint_with_valid_token(self, authenticated_client):
        url = reverse('user-me')
        response = authenticated_client.get(url)
        assert response.status_code == 200
```

---

## 3. Tests Frontend (Vitest + Testing Library)

### Configuration

```typescript
// frontend/vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['node_modules', 'src/test'],
    },
  },
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
import { server } from './mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Tests de composants

```typescript
// src/components/TeachingCard/TeachingCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { TeachingCard } from './TeachingCard'
import { mockTeaching } from '../../test/fixtures'

describe('TeachingCard', () => {
  it('affiche le titre en français', () => {
    render(<TeachingCard teaching={mockTeaching} language="fr" />)
    expect(screen.getByText(mockTeaching.title_fr)).toBeInTheDocument()
  })

  it('affiche le titre en arabe', () => {
    render(<TeachingCard teaching={mockTeaching} language="ar" />)
    expect(screen.getByText(mockTeaching.title_ar)).toBeInTheDocument()
  })

  it('affiche le nombre de téléchargements', () => {
    render(<TeachingCard teaching={mockTeaching} language="fr" />)
    expect(screen.getByText(/340/)).toBeInTheDocument()
  })

  it('appelle onDownload au clic sur le bouton', () => {
    const onDownload = vi.fn()
    render(<TeachingCard teaching={mockTeaching} language="fr" onDownload={onDownload} />)
    fireEvent.click(screen.getByRole('button', { name: /télécharger/i }))
    expect(onDownload).toHaveBeenCalledWith(mockTeaching.id)
  })

  it('a le bon attribut lang pour le contenu arabe', () => {
    render(<TeachingCard teaching={mockTeaching} language="ar" />)
    const title = screen.getByText(mockTeaching.title_ar)
    expect(title).toHaveAttribute('dir', 'rtl')
  })
})
```

### Tests de hooks

```typescript
// src/hooks/useTeachings/useTeachings.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTeachings } from './useTeachings'
import { server } from '../../test/mocks/server'
import { rest } from 'msw'

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
)

describe('useTeachings', () => {
  it('retourne la liste des enseignements', async () => {
    const { result } = renderHook(() => useTeachings(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.results).toHaveLength(20)
    expect(result.current.data?.count).toBe(142)
  })

  it('filtre par catégorie', async () => {
    const { result } = renderHook(
      () => useTeachings({ category: 'fiqh' }),
      { wrapper }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    result.current.data?.results.forEach(teaching => {
      expect(teaching.category_slug).toBe('fiqh')
    })
  })

  it('gère les erreurs réseau', async () => {
    server.use(
      rest.get('*/teachings/', (req, res, ctx) => res(ctx.status(500)))
    )

    const { result } = renderHook(() => useTeachings(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
```

### Lancer les tests frontend

```bash
cd frontend

# Tests en mode watch
npm test

# Tests avec couverture
npm run test:coverage

# Tests UI interactif (Vitest UI)
npm run test:ui
```

---

## 4. Tests Flutter (flutter_test)

### Structure des tests Flutter

```
mobile/
├── test/
│   ├── unit/
│   │   ├── services/
│   │   │   └── teaching_service_test.dart
│   │   └── models/
│   │       └── teaching_test.dart
│   ├── widget/
│   │   ├── teaching_card_test.dart
│   │   └── audio_player_test.dart
│   └── integration/
│       └── teachings_page_test.dart
```

### Exemples de tests Flutter

```dart
// test/unit/models/teaching_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:maktaba_catk/features/teachings/data/models/teaching_model.dart';

void main() {
  group('TeachingModel', () {
    final json = {
      'id': '550e8400-e29b-41d4-a716-446655440010',
      'title_fr': 'Les piliers de l\'Islam',
      'title_en': 'The Pillars of Islam',
      'title_ar': 'أركان الإسلام',
      'downloads_count': 340,
      'is_featured': true,
      'published_at': '2024-03-15T10:30:00Z',
    };

    test('fromJson parse correctement le JSON', () {
      final teaching = TeachingModel.fromJson(json);
      expect(teaching.id, '550e8400-e29b-41d4-a716-446655440010');
      expect(teaching.titleFr, 'Les piliers de l\'Islam');
      expect(teaching.downloadsCount, 340);
      expect(teaching.isFeatured, true);
    });

    test('getLocalizedTitle retourne le bon titre selon la langue', () {
      final teaching = TeachingModel.fromJson(json);
      expect(teaching.getLocalizedTitle('fr'), 'Les piliers de l\'Islam');
      expect(teaching.getLocalizedTitle('en'), 'The Pillars of Islam');
      expect(teaching.getLocalizedTitle('ar'), 'أركان الإسلام');
    });

    test('getLocalizedTitle fallback vers FR si langue inconnue', () {
      final teaching = TeachingModel.fromJson(json);
      expect(teaching.getLocalizedTitle('es'), 'Les piliers de l\'Islam');
    });
  });
}
```

```dart
// test/widget/teaching_card_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:maktaba_catk/features/teachings/presentation/widgets/teaching_card.dart';

void main() {
  testWidgets('TeachingCard affiche le titre et les infos', (WidgetTester tester) async {
    final teaching = TeachingModel(
      id: '1',
      titleFr: 'Test Enseignement',
      titleEn: 'Test Teaching',
      titleAr: 'اختبار',
      downloadsCount: 100,
    );

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: TeachingCard(teaching: teaching, language: 'fr'),
        ),
      ),
    );

    expect(find.text('Test Enseignement'), findsOneWidget);
    expect(find.text('100'), findsOneWidget);
    expect(find.byIcon(Icons.download), findsOneWidget);
  });
}
```

### Lancer les tests Flutter

```bash
cd mobile

# Tous les tests
flutter test

# Avec couverture
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html

# Tests d'intégration (appareil/émulateur requis)
flutter test integration_test/

# Tests en mode verbose
flutter test --reporter verbose
```

---

## 5. Tests de performance (Locust)

### Installation et configuration

```bash
pip install locust
```

```python
# backend/tests/performance/locustfile.py
from locust import HttpUser, task, between


class AnonymousUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        """Appelé au démarrage de chaque utilisateur simulé."""
        self.client.get("/api/v1/categories/")

    @task(5)
    def browse_teachings(self):
        """Scénario principal : parcourir les enseignements."""
        self.client.get("/api/v1/teachings/")

    @task(3)
    def view_teaching_detail(self):
        """Voir le détail d'un enseignement."""
        self.client.get("/api/v1/teachings/550e8400-e29b-41d4-a716-446655440010/")

    @task(2)
    def search_content(self):
        """Recherche globale."""
        self.client.get("/api/v1/search/?q=salat&lang=fr")

    @task(1)
    def browse_audios(self):
        """Parcourir les audios."""
        self.client.get("/api/v1/audios/")


class AuthenticatedUser(HttpUser):
    wait_time = between(2, 5)

    def on_start(self):
        """Connexion au démarrage."""
        response = self.client.post("/api/v1/auth/login/", json={
            "email": "test@example.com",
            "password": "testpass123"
        })
        self.token = response.json()["access"]
        self.client.headers.update({"Authorization": f"Bearer {self.token}"})

    @task(3)
    def view_my_profile(self):
        self.client.get("/api/v1/users/me/")

    @task(2)
    def view_favorites(self):
        self.client.get("/api/v1/users/me/favorites/")
```

### Lancer les tests de performance

```bash
cd backend/tests/performance

# Interface web (http://localhost:8089)
locust -f locustfile.py --host=http://localhost:8000

# Mode headless (CI/CD)
locust -f locustfile.py \
    --host=http://localhost:8000 \
    --users=100 \
    --spawn-rate=10 \
    --run-time=5m \
    --headless \
    --html=reports/performance_report.html
```

### Seuils de performance acceptables

| Endpoint | p50 | p95 | p99 | Taux erreur max |
|----------|-----|-----|-----|-----------------|
| GET /teachings/ | < 200ms | < 500ms | < 1s | < 0.1% |
| GET /teachings/{id}/ | < 150ms | < 400ms | < 800ms | < 0.1% |
| GET /search/ | < 300ms | < 800ms | < 2s | < 0.5% |
| POST /auth/login/ | < 500ms | < 1s | < 2s | < 1% |
| GET /audios/ | < 200ms | < 500ms | < 1s | < 0.1% |

---

## 6. Tests de sécurité (OWASP ZAP)

### Scan automatisé

```bash
# Démarrer l'environnement de test
docker compose up -d

# Lancer OWASP ZAP en mode daemon
docker run -d -p 8080:8080 \
    --name owasp-zap \
    ghcr.io/zaproxy/zaproxy:stable zap.sh \
    -daemon -host 0.0.0.0 -port 8080

# Scan passif (analyse du trafic)
docker exec owasp-zap zap-cli quick-scan \
    --self-contained \
    --start-options '-config api.disablekey=true' \
    http://localhost:8000/api/v1/

# Génération du rapport
docker exec owasp-zap zap-cli report \
    -o /tmp/zap-report.html \
    -f html

# Scan actif de l'API (avec OpenAPI spec)
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-api-scan.py \
    -t http://localhost:8000/api/schema/ \
    -f openapi \
    -r zap-api-report.html \
    -J zap-api-report.json
```

### Tests de sécurité manuels

```bash
# Test injection SQL (doit retourner 400, pas 500)
curl -X GET "http://localhost:8000/api/v1/teachings/?category='; DROP TABLE teachings; --"

# Test XSS dans la recherche (doit être échappé)
curl -X GET "http://localhost:8000/api/v1/search/?q=<script>alert('xss')</script>"

# Test accès endpoint admin sans auth (doit retourner 401)
curl -X POST "http://localhost:8000/api/v1/teachings/" \
    -H "Content-Type: application/json" \
    -d '{"title_fr": "Test"}'

# Test CORS depuis domaine non autorisé
curl -X GET "http://localhost:8000/api/v1/teachings/" \
    -H "Origin: https://malicious-site.com" -v

# Test rate limiting (5 tentatives de login)
for i in {1..10}; do
    curl -X POST "http://localhost:8000/api/v1/auth/login/" \
        -H "Content-Type: application/json" \
        -d '{"email":"test@test.com","password":"wrong"}'
done
```

---

## Couverture de code

### Rapports de couverture

```bash
# Backend — rapport HTML
cd backend
pytest apps/ --cov=apps --cov-report=html
open htmlcov/index.html

# Frontend — rapport lcov
cd frontend
npm run test:coverage
open coverage/index.html

# Flutter
cd mobile
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html
```

### Intégration Codecov

```yaml
# .github/workflows/ci.yml (extrait)
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    files: ./backend/coverage.xml,./frontend/coverage/lcov.info
    fail_ci_if_error: true
    verbose: true
```

---

## Intégration CI/CD

Tous les tests s'exécutent automatiquement dans GitHub Actions à chaque push.
Voir [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) pour la configuration complète.

```
Push → CI Pipeline
         ├── test-backend       (pytest, flake8, isort)
         ├── test-frontend      (vitest, eslint, tsc)
         ├── security-scan      (safety, npm audit)
         └── build-and-push     (si tests passent + branche main)
                  └── deploy    (si build réussi)
```

### Commande globale (tous les tests)

```bash
# Via Make
make test

# Manuellement
cd backend && pytest apps/ -v
cd frontend && npm test -- --run
cd mobile && flutter test
```
