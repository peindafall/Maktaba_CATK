"""
Tests de non-régression des retours testeurs.
Lancer :  python manage.py test apps.core
"""
import os
import shutil
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.audios.models import Audio
from apps.questions.models import Question
from apps.teachings.models import Teaching
from apps.users.models import User

TMP_MEDIA = tempfile.mkdtemp()


@override_settings(
    MEDIA_ROOT=TMP_MEDIA,
    CACHES={'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}},
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    REST_FRAMEWORK={
        **__import__('django.conf', fromlist=['settings']).settings.REST_FRAMEWORK,
        'DEFAULT_THROTTLE_CLASSES': [],
    },
)
class FeedbackRegressionTests(TestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TMP_MEDIA, ignore_errors=True)

    def setUp(self):
        self.client = APIClient()

    def register(self, email='Test@Example.com', username='manou', password='Sal4m-Aleykoum'):
        return self.client.post('/api/v1/auth/register/', {
            'email': email, 'username': username, 'password': password, 'password_confirm': password,
        }, format='json')

    # --- Inscription : plus de 500, message clair si l'email existe ---
    def test_register_ok_then_duplicate_email_is_400(self):
        r = self.register()
        self.assertEqual(r.status_code, 201, r.content)
        self.assertIn('access', r.json()['tokens'])
        r2 = self.register(email='test@example.com', username='autre')
        self.assertEqual(r2.status_code, 400)
        self.assertIn('email', r2.json())

    def test_login_is_case_insensitive_and_returns_user(self):
        self.register()
        r = self.client.post('/api/v1/auth/login/', {'email': 'TEST@example.COM', 'password': 'Sal4m-Aleykoum'}, format='json')
        self.assertEqual(r.status_code, 200, r.content)
        self.assertEqual(r.json()['user']['email'], 'test@example.com')

    def test_logout_blacklists_refresh(self):
        tokens = self.register().json()['tokens']
        self.assertEqual(self.client.post('/api/v1/auth/logout/', {'refresh': tokens['refresh']}, format='json').status_code, 205)
        r = self.client.post('/api/v1/auth/refresh/', {'refresh': tokens['refresh']}, format='json')
        self.assertEqual(r.status_code, 401)

    # --- Sécurité ---
    def test_anonymous_cannot_create_user_and_user_cannot_self_subscribe(self):
        self.assertIn(self.client.post('/api/v1/users/', {}, format='json').status_code, (401, 403))
        token = self.register().json()['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        r = self.client.post('/api/v1/subscriptions/', {'plan': 'x', 'status': 'active'}, format='json')
        self.assertEqual(r.status_code, 405)

    # --- Favoris génériques ---
    def test_favorites_toggle_and_detailed(self):
        t = Teaching.objects.create(title_fr='Fiqh', status='published')
        token = self.register().json()['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        r = self.client.post('/api/v1/favorites/toggle/', {'content_type': 'teaching', 'content_id': str(t.id)}, format='json')
        self.assertTrue(r.json()['is_favorited'])
        self.assertEqual(len(self.client.get('/api/v1/favorites/').json()), 1)
        self.assertEqual(self.client.get('/api/v1/favorites/detailed/').json()['total'], 1)
        r = self.client.post('/api/v1/favorites/toggle/', {'content_type': 'teaching', 'content_id': str(t.id)}, format='json')
        self.assertFalse(r.json()['is_favorited'])

    # --- Questions des visiteurs ---
    def test_visitor_can_ask_question_unpublished(self):
        r = self.client.post('/api/v1/questions/ask/', {
            'title': 'Question sur le wird', 'question': 'Quelles sont les conditions du wird ?',
            'email': 'visiteur@example.com', 'language': 'fr',
        }, format='json')
        self.assertEqual(r.status_code, 201, r.content)
        q = Question.objects.get()
        self.assertFalse(q.is_published)
        self.assertEqual(q.source, Question.SOURCE_PUBLIC)
        self.assertEqual(self.client.get('/api/v1/questions/').json()['count'], 0)

    def test_honeypot_blocks_bots(self):
        r = self.client.post('/api/v1/questions/ask/', {
            'title': 'Question sur le wird', 'question': 'Quelles sont les conditions ?',
            'email': 'bot@example.com', 'website': 'http://spam',
        }, format='json')
        self.assertEqual(r.status_code, 400)

    # --- Audio : Range (durée « Infinity:NaN ») + téléchargement en pièce jointe ---
    def test_media_supports_range_and_download_is_attachment(self):
        audio = Audio.objects.create(
            title_fr='Leçon 1', audio_file=SimpleUploadedFile('lecon.mp3', b'0123456789' * 100, content_type='audio/mpeg')
        )
        url = '/media/' + audio.audio_file.name
        r = self.client.get(url, HTTP_RANGE='bytes=0-99')
        self.assertEqual(r.status_code, 206)
        self.assertEqual(r['Content-Range'], 'bytes 0-99/1000')
        self.assertEqual(r['Accept-Ranges'], 'bytes')
        self.assertEqual(self.client.get('/media/../settings.py').status_code, 404)

        r = self.client.get(f'/api/v1/audios/{audio.id}/download/')
        self.assertEqual(r.status_code, 200)
        self.assertIn('attachment', r['Content-Disposition'])
        audio.refresh_from_db()
        self.assertEqual(audio.downloads_count, 1)

    def test_health(self):
        self.assertEqual(self.client.get('/api/v1/health/').json(), {'status': 'ok'})
