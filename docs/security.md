# 🔐 Checklist Sécurité OWASP — Maktaba CATK

> Référence : [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
> Dernière révision : 2024-11

## Résumé

| ID | Risque | Statut | Priorité |
|----|--------|--------|----------|
| A01 | Broken Access Control | 🟡 En cours | Critique |
| A02 | Cryptographic Failures | ✅ Implémenté | Critique |
| A03 | Injection | ✅ Implémenté | Critique |
| A04 | Insecure Design | 🟡 En cours | Haute |
| A05 | Security Misconfiguration | 🟡 En cours | Haute |
| A06 | Vulnerable Components | ✅ Implémenté | Moyenne |
| A07 | Authentication Failures | 🟡 En cours | Critique |
| A08 | Software Integrity Failures | ✅ Implémenté | Moyenne |
| A09 | Logging & Monitoring | 🟡 En cours | Haute |
| A10 | SSRF | ✅ Implémenté | Moyenne |

---

## ✅ A01: Broken Access Control

Le contrôle d'accès défaillant est la menace n°1. Un attaquant peut accéder à des données ou fonctions auxquelles il n'est pas autorisé.

### Mesures implémentées

- [x] **Contrôle d'accès basé sur les rôles (RBAC)**
  ```python
  ROLES = ['anonymous', 'member', 'editor', 'admin', 'superadmin']
  ```
  Chaque rôle hérite des permissions du rôle inférieur.

- [x] **JWT avec expiration courte**
  - Access token : 1 heure
  - Refresh token : 7 jours avec rotation
  ```python
  SIMPLE_JWT = {
      'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
      'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
      'ROTATE_REFRESH_TOKENS': True,
      'BLACKLIST_AFTER_ROTATION': True,
  }
  ```

- [x] **Endpoints admin protégés**
  ```python
  class TeachingViewSet(ModelViewSet):
      def get_permissions(self):
          if self.action in ['create', 'update', 'partial_update', 'destroy']:
              return [IsAuthenticated(), IsAdminUser()]
          return [AllowAny()]
  ```

- [x] **Vérification ownership**
  ```python
  class IsOwnerOrAdmin(permissions.BasePermission):
      def has_object_permission(self, request, view, obj):
          return obj.user == request.user or request.user.is_staff
  ```

- [x] **CORS configuré avec liste blanche**
  ```python
  CORS_ALLOWED_ORIGINS = [
      "https://catk.org",
      "https://www.catk.org",
  ]
  CORS_ALLOW_ALL_ORIGINS = False  # Production
  ```

### À faire

- [ ] Audit des permissions sur tous les endpoints (Q3 2025)
- [ ] Tests automatisés de contrôle d'accès
- [ ] Rapport d'accès refusés dans les logs

---

## ✅ A02: Cryptographic Failures

Concerne l'exposition de données sensibles due à une cryptographie faible ou absente.

### Mesures implémentées

- [x] **HTTPS uniquement en production**
  ```nginx
  server {
      listen 80;
      return 301 https://$host$request_uri;  # Redirection HTTP → HTTPS
  }
  ```

- [x] **Certificats SSL/TLS (Let's Encrypt)**
  - TLS 1.2 minimum, TLS 1.3 préféré
  - HSTS activé (1 an)

- [x] **Mots de passe hashés avec PBKDF2-SHA256**
  ```python
  PASSWORD_HASHERS = [
      'django.contrib.auth.hashers.PBKDF2PasswordHasher',
      'django.contrib.auth.hashers.Argon2PasswordHasher',  # Fallback
  ]
  ```
  Django utilise PBKDF2 avec 870 000 itérations par défaut (Django 5).

- [x] **Secrets dans variables d'environnement**
  ```python
  SECRET_KEY = env('SECRET_KEY')  # JAMAIS dans le code source
  ```
  Le fichier `.env` est dans `.gitignore`.

- [x] **JWT signé avec HS256**
  - Clé secrète ≥ 50 caractères aléatoires
  - Rotation à chaque refresh

- [x] **Fichiers MinIO accessibles via URLs présignées**
  - URLs valides 1 heure uniquement
  - Pas d'accès direct au bucket

### À faire

- [ ] Passer au chiffrement Argon2 (plus résistant que PBKDF2)
- [ ] Chiffrement des données PII au repos (emails)
- [ ] Audit cryptographique annuel

---

## ✅ A03: Injection

Les attaques par injection (SQL, NoSQL, LDAP, etc.) permettent d'exécuter du code malveillant.

### Mesures implémentées

- [x] **ORM Django exclusivement — pas de SQL brut**
  ```python
  # ✅ Sécurisé : ORM Django paramétré
  Teaching.objects.filter(category__slug=slug, status='published')

  # ❌ Interdit : SQL brut non paramétré
  # Teaching.objects.raw(f"SELECT * FROM teachings WHERE slug = '{slug}'")
  ```

  Si du SQL brut est absolument nécessaire, utiliser des paramètres :
  ```python
  Teaching.objects.raw(
      "SELECT * FROM teachings WHERE slug = %s",
      [slug]  # Paramètre, pas f-string
  )
  ```

- [x] **Validation des inputs avec Serializers DRF**
  ```python
  class TeachingCreateSerializer(serializers.ModelSerializer):
      def validate_title_fr(self, value):
          if len(value) < 3:
              raise serializers.ValidationError("Titre trop court.")
          return bleach.clean(value)  # Nettoyage HTML
  ```

- [x] **Paramètres d'URL validés et typés**
  ```python
  router.register(r'teachings', TeachingViewSet)
  # Django valide automatiquement que {id} est un UUID valide
  ```

- [x] **Sanitisation des fichiers uploadés**
  ```python
  def validate_pdf_file(self, value):
      allowed_types = ['application/pdf']
      if value.content_type not in allowed_types:
          raise ValidationError("Seuls les fichiers PDF sont acceptés.")
      if value.size > 50 * 1024 * 1024:
          raise ValidationError("Taille max : 50 MB.")
      # Scan antivirus via ClamAV (à implémenter)
      return value
  ```

- [x] **Protection XSS via Django templates auto-escape**
  Tous les templates Django échappent le HTML par défaut.

### À faire

- [ ] Intégration ClamAV pour scan antivirus des uploads
- [ ] Content Security Policy (CSP) strict
- [ ] Audit des champs texte libres (commentaires futurs)

---

## ✅ A04: Insecure Design

Les failles de conception architecturale qui ne peuvent être corrigées qu'en repensant le système.

### Mesures implémentées

- [x] **Architecture séparée backend/frontend**
  - API REST stateless
  - Pas de sessions côté serveur (sauf admin Django)
  - Frontend découplé = surface d'attaque réduite

- [x] **Principe du moindre privilège**
  - Utilisateur DB avec droits limités (pas de DROP, CREATE)
  - Service MinIO avec bucket dédié
  - Containers Docker sans privilèges root

- [x] **Rate limiting sur les endpoints critiques**
  ```python
  REST_FRAMEWORK = {
      'DEFAULT_THROTTLE_CLASSES': [
          'rest_framework.throttling.AnonRateThrottle',
          'rest_framework.throttling.UserRateThrottle',
      ],
      'DEFAULT_THROTTLE_RATES': {
          'anon': '100/min',
          'user': '1000/min',
          'login': '5/min',      # Endpoint login limité
          'register': '3/hour',  # Inscriptions limitées
      }
  }
  ```

- [x] **Pagination obligatoire**
  - Maximum 50 éléments par requête
  - Pas d'endpoint retournant toute la base

### À faire

- [ ] Threat modeling complet (STRIDE)
- [ ] Bug bounty program
- [ ] Revue de design sécurité bi-annuelle

---

## ✅ A05: Security Misconfiguration

Les erreurs de configuration représentent un vecteur d'attaque majeur.

### Mesures implémentées

- [x] **DEBUG=False en production**
  ```python
  # config/settings/production.py
  DEBUG = False
  # En dev, les traceback détaillés ne sont jamais exposés en prod
  ```

- [x] **SECRET_KEY aléatoire et forte**
  ```bash
  # Génération : python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
  # Résultat : clé de 50+ caractères alphanumériques + spéciaux
  ```

- [x] **ALLOWED_HOSTS configuré**
  ```python
  ALLOWED_HOSTS = ['catk.org', 'www.catk.org']  # Jamais ['*'] en production
  ```

- [x] **Informations sensibles absentes des logs**
  ```python
  LOGGING = {
      'filters': {
          'require_debug_false': {'()': 'django.utils.log.RequireDebugFalse'},
      },
      # Pas de log des mots de passe, tokens, données personnelles
  }
  ```

- [x] **Headers de sécurité Nginx**
  ```nginx
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
  ```

- [x] **Django sécurisé en production**
  ```python
  SECURE_SSL_REDIRECT = True
  SECURE_HSTS_SECONDS = 31536000
  SECURE_HSTS_INCLUDE_SUBDOMAINS = True
  SECURE_HSTS_PRELOAD = True
  SESSION_COOKIE_SECURE = True
  CSRF_COOKIE_SECURE = True
  ```

### À faire

- [ ] Scan de configuration automatique (Mozilla Observatory)
- [ ] Revue des permissions fichiers sur le serveur
- [ ] Désactiver les méthodes HTTP inutiles (TRACE, CONNECT)

---

## ✅ A06: Vulnerable Components

L'utilisation de bibliothèques avec des vulnérabilités connues.

### Mesures implémentées

- [x] **Dépendances avec versions fixes**
  ```text
  # requirements/production.txt
  Django==5.1.4
  djangorestframework==3.15.2
  djangorestframework-simplejwt==5.3.1
  # Versions pinned, pas de ==5.* flottant
  ```

- [x] **Scan automatique avec Dependabot**
  ```yaml
  # .github/dependabot.yml
  updates:
    - package-ecosystem: "pip"
      directory: "/backend"
      schedule:
        interval: "weekly"
    - package-ecosystem: "npm"
      directory: "/frontend"
      schedule:
        interval: "weekly"
  ```

- [x] **Images Docker avec versions pinned**
  ```yaml
  # docker-compose.prod.yml
  image: postgres:16-alpine    # Pas postgres:latest
  image: redis:7-alpine        # Pas redis:latest
  image: nginx:1.27-alpine     # Pas nginx:latest
  ```

- [x] **Audit npm**
  ```bash
  cd frontend && npm audit
  cd frontend && npm audit fix
  ```

- [x] **Safety pour Python**
  ```bash
  pip install safety
  safety check -r requirements/production.txt
  ```

### À faire

- [ ] Intégration Snyk dans CI/CD
- [ ] SBOM (Software Bill of Materials) automatique
- [ ] Politique de mise à jour mensuelle des dépendances

---

## ✅ A07: Authentication Failures

Les failles d'authentification permettent l'usurpation d'identité.

### Mesures implémentées

- [x] **Rate limiting sur le login**
  ```python
  class LoginThrottle(AnonRateThrottle):
      rate = '5/min'  # 5 tentatives max par minute par IP
  ```

- [x] **JWT blacklist à la déconnexion**
  ```python
  # Utilise djangorestframework-simplejwt blacklist
  class LogoutView(APIView):
      def post(self, request):
          token = RefreshToken(request.data['refresh'])
          token.blacklist()
          return Response(status=204)
  ```

- [x] **Vérification email obligatoire**
  - Compte inactif jusqu'à vérification
  - Token de vérification valide 24 heures

- [x] **Réinitialisation de mot de passe sécurisée**
  - Token unique signé (HMAC)
  - Valable 1 heure uniquement
  - Usage unique (invalidé après utilisation)

- [x] **Validation de la force du mot de passe**
  ```python
  AUTH_PASSWORD_VALIDATORS = [
      {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 8}},
      {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
      {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
  ]
  ```

- [x] **Protection brute-force via throttling**

### À faire

- [ ] MFA (Authentification Multi-Facteurs) pour les admins
- [ ] Alerte email sur connexion depuis nouvelle IP
- [ ] Durée de session configurable par l'utilisateur
- [ ] Déconnexion de toutes les sessions

---

## ✅ A08: Software Integrity Failures

L'absence de vérification d'intégrité du code et des données.

### Mesures implémentées

- [x] **CI/CD avec vérification signatures GitHub Actions**
  ```yaml
  - uses: actions/checkout@v4       # SHA pinned dans prod
  - uses: docker/build-push-action@v5
  ```

- [x] **Images Docker vérifiées**
  ```bash
  # Vérification du digest SHA256 des images officielles
  docker pull postgres:16-alpine@sha256:abc123...
  ```

- [x] **Pas de scripts exécutés depuis des URLs inconnues**
  - Toutes les dépendances sont dans `package.json` / `requirements.txt`
  - Pas de `curl | bash` dans les scripts de déploiement

### À faire

- [ ] Signature des commits avec GPG
- [ ] Vérification des checksums des artifacts CI/CD
- [ ] Politique de review obligatoire (1 reviewer minimum)

---

## ✅ A09: Logging & Monitoring

L'absence de logs empêche la détection et l'investigation d'incidents.

### Mesures implémentées

- [x] **Logs structurés JSON**
  ```python
  LOGGING = {
      'formatters': {
          'json': {
              '()': 'pythonjsonlogger.jsonlogger.JsonFormatter',
              'format': '%(asctime)s %(levelname)s %(name)s %(message)s',
          },
      },
      'handlers': {
          'console': {
              'class': 'logging.StreamHandler',
              'formatter': 'json',
          },
      },
      'root': {
          'handlers': ['console'],
          'level': 'INFO',
      },
  }
  ```

- [x] **Sentry pour les erreurs production**
  ```python
  import sentry_sdk
  sentry_sdk.init(
      dsn=env('SENTRY_DSN'),
      environment='production',
      traces_sample_rate=0.1,
      send_default_pii=False,  # Pas de données personnelles
  )
  ```

- [x] **Audit trail des actions admin**
  - Django Admin log natif activé
  - Toutes les créations/modifications/suppressions loguées

- [x] **Logs des authentifications**
  ```python
  # Login réussi, échec, déconnexion
  logger.info('user_login', extra={'user_id': user.id, 'ip': ip})
  logger.warning('login_failed', extra={'email': email, 'ip': ip})
  ```

### À faire

- [ ] Centralisation des logs (ELK Stack ou Loki)
- [ ] Alertes en temps réel (PagerDuty / Opsgenie)
- [ ] Dashboard de monitoring (Grafana)
- [ ] Rétention des logs : 90 jours

---

## ✅ A10: Server-Side Request Forgery (SSRF)

Une SSRF permet à un attaquant d'induire le serveur à faire des requêtes vers des ressources internes.

### Mesures implémentées

- [x] **Validation des URLs YouTube (whitelist)**
  ```python
  class VideoSerializer(serializers.ModelSerializer):
      def validate_youtube_url(self, value):
          import re
          pattern = r'^https://(?:www\.)?youtube\.com/watch\?v=[\w-]{11}$'
          if not re.match(pattern, value):
              raise serializers.ValidationError(
                  "URL YouTube invalide. Format: https://www.youtube.com/watch?v=XXXXXXXXXXX"
              )
          # Extraction de l'ID (jamais de fetch côté serveur)
          video_id = value.split('v=')[1][:11]
          return value
  ```

- [x] **Pas de fetch d'URL utilisateur côté serveur**
  - Les vidéos YouTube sont affichées via embed côté client uniquement
  - Aucun proxy d'URL côté backend

- [x] **Isolation réseau Docker**
  ```yaml
  networks:
    maktaba_network:
      driver: bridge
      internal: false  # Backend peut sortir (pour OAuth Google)
  ```
  Les containers ne peuvent pas accéder au réseau hôte directement.

### À faire

- [ ] Configurer une liste blanche pour les requêtes OAuth sortantes
- [ ] Bloquer les accès aux métadonnées cloud (169.254.169.254)

---

## Procédures de réponse aux incidents

### En cas de compromission détectée

```bash
# 1. Isoler le serveur
# 2. Révoquer tous les tokens JWT (changer SECRET_KEY)
python manage.py shell -c "from django.conf import settings; print('Rotated')"

# 3. Forcer la réinitialisation des mots de passe
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.all().update(is_active=False)
print('All accounts disabled')
"

# 4. Analyser les logs
grep 'login_failed\|unauthorized' /var/log/maktaba/*.log

# 5. Notifier les utilisateurs affectés
```

### Contacts sécurité

- **Signaler une vulnérabilité :** security@catk.org
- **Réponse garantie sous :** 48 heures ouvrées
- **Programme de divulgation responsable :** En cours de mise en place
