import os

import dj_database_url
from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F401,F403
from .base import env

DEBUG = False

# --- CLÉ SECRÈTE : obligatoire en production ---
SECRET_KEY = os.environ.get('SECRET_KEY', '')
if not SECRET_KEY:
    raise ImproperlyConfigured('SECRET_KEY manquante : définissez-la dans « Environment » sur Render.')
if SECRET_KEY.startswith('django-insecure') or len(SECRET_KEY) < 40:
    import warnings

    warnings.warn('SECRET_KEY trop faible : remplacez-la par une clé aléatoire de 50 caractères sur Render.')

# ALLOWED_HOSTS depuis l'environnement (Render : ".onrender.com")
ALLOWED_HOSTS = [h.strip() for h in os.environ.get('ALLOWED_HOSTS', '.onrender.com').split(',') if h.strip()]

# --- BASE DE DONNÉES (Neon PostgreSQL) ---
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
        ssl_require=True,
    )
}

# --- SÉCURITÉ HTTP ---
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_SECONDS = 31536000
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
SECURE_CROSS_ORIGIN_OPENER_POLICY = 'same-origin'
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = 'DENY'

# --- CORS / CSRF (Netlify + Render) ---
CORS_ALLOWED_ORIGINS = [
    o.strip() for o in os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',') if o.strip()
]
CSRF_TRUSTED_ORIGINS = [
    o.strip() for o in os.environ.get('CSRF_TRUSTED_ORIGINS', '').split(',') if o.strip()
]
CORS_ALLOW_ALL_ORIGINS = False

# Swagger / documentation API : mettez ENABLE_API_DOCS=False sur Render pour la masquer au public
ENABLE_API_DOCS = env.bool('ENABLE_API_DOCS', default=True)

# --- FICHIERS MÉDIAS ---
# ⚠️ Le disque d'un service Render gratuit est EFFACÉ à chaque redéploiement / mise en veille :
# tout fichier envoyé depuis l'admin (couvertures, PDF, audios) finit par disparaître (=> erreurs 404).
# Solution : un stockage objet compatible S3 (Cloudflare R2, Supabase Storage, Backblaze B2, AWS S3...).
# Il suffit de définir les variables AWS_* ci-dessous sur Render ; sinon on garde le disque local.
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME', '')

if AWS_STORAGE_BUCKET_NAME:
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID', '')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY', '')
    AWS_S3_ENDPOINT_URL = os.environ.get('AWS_S3_ENDPOINT_URL') or None
    AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', 'auto')
    AWS_S3_CUSTOM_DOMAIN = os.environ.get('AWS_S3_CUSTOM_DOMAIN') or None  # domaine public du bucket
    AWS_S3_FILE_OVERWRITE = False
    AWS_DEFAULT_ACL = None
    AWS_QUERYSTRING_AUTH = not bool(AWS_S3_CUSTOM_DOMAIN)  # URLs signées si le bucket n'est pas public
    AWS_QUERYSTRING_EXPIRE = 6 * 3600
    AWS_S3_SIGNATURE_VERSION = 's3v4'
    AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}

    INSTALLED_APPS = INSTALLED_APPS + ['storages']  # noqa: F405
    STORAGES = {
        'default': {'BACKEND': 'storages.backends.s3.S3Storage'},
        'staticfiles': {'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage'},
    }
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/' if AWS_S3_CUSTOM_DOMAIN else '/media/'
else:
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.environ.get('MEDIA_ROOT', '/app/media/')
    STORAGES = {
        'default': {
            'BACKEND': 'django.core.files.storage.FileSystemStorage',
            'OPTIONS': {'location': MEDIA_ROOT, 'base_url': MEDIA_URL},
        },
        'staticfiles': {'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage'},
    }

# --- SENTRY (optionnel) ---
SENTRY_DSN = os.environ.get('SENTRY_DSN', '')
if SENTRY_DSN:
    import sentry_sdk

    sentry_sdk.init(dsn=SENTRY_DSN, traces_sample_rate=0.1, send_default_pii=False)

# --- LOGGING ---
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {'class': 'logging.StreamHandler', 'formatter': 'verbose'},
    },
    'root': {'handlers': ['console'], 'level': 'INFO'},
    'loggers': {
        'django': {'handlers': ['console'], 'level': 'INFO', 'propagate': False},
        # Les 404 de /favicon.ico etc. ne polluent plus les logs
        'django.request': {'handlers': ['console'], 'level': 'ERROR', 'propagate': False},
    },
}
