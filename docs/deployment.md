# 🚀 Guide de Déploiement — Maktaba CATK

## Table des matières

- [Prérequis serveur](#prérequis-serveur)
- [Clonage et configuration](#clonage-et-configuration)
- [Certificats SSL](#certificats-ssl)
- [Démarrage des containers](#démarrage-des-containers)
- [Configuration DNS](#configuration-dns)
- [Sauvegarde automatique](#sauvegarde-automatique)
- [Monitoring](#monitoring)
- [Mise à jour zero-downtime](#mise-à-jour-zero-downtime)
- [Rollback](#rollback)
- [Troubleshooting](#troubleshooting)

---

## Prérequis serveur

### Configuration minimale recommandée

| Ressource | Minimum | Recommandé |
|-----------|---------|------------|
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Stockage | 40 GB SSD | 100 GB NVMe |
| Bande passante | 100 Mbps | 1 Gbps |

### Installation des dépendances système

```bash
# Mise à jour système
sudo apt update && sudo apt upgrade -y

# Dépendances essentielles
sudo apt install -y \
    curl \
    git \
    make \
    ufw \
    fail2ban \
    unzip \
    htop

# Installation Docker
curl -fsSL https://get.docker.com | bash
sudo usermod -aG docker $USER
newgrp docker

# Vérification
docker --version           # >= 24.0
docker compose version     # >= 2.0

# Configuration du pare-feu
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

### Configuration fail2ban (protection brute-force)

```bash
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

```ini
[sshd]
enabled = true
port = ssh
maxretry = 5
bantime = 3600

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
findtime = 60
bantime = 600
```

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## Clonage et configuration

```bash
# 1. Cloner le dépôt
sudo mkdir -p /opt/maktaba-catk
sudo chown $USER:$USER /opt/maktaba-catk
cd /opt/maktaba-catk
git clone https://github.com/catk/Maktaba_CATK.git .

# 2. Configurer les variables d'environnement de production
cp .env.prod.example .env.prod
nano .env.prod
```

### Configuration de `.env.prod`

```bash
# === Django Core ===
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))")
DEBUG=False
ALLOWED_HOSTS=catk.org,www.catk.org

# === Base de données PostgreSQL ===
DB_NAME=maktaba_catk
DB_USER=maktaba_user
DB_PASSWORD=$(openssl rand -base64 32)
DATABASE_URL=postgres://maktaba_user:${DB_PASSWORD}@db:5432/maktaba_catk

# === Redis ===
REDIS_PASSWORD=$(openssl rand -base64 24)
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/0

# === MinIO ===
MINIO_ACCESS_KEY=$(openssl rand -hex 20)
MINIO_SECRET_KEY=$(openssl rand -base64 40)
MINIO_BUCKET_NAME=maktabacatk
MINIO_ENDPOINT=http://minio:9000
MINIO_EXTERNAL_URL=https://media.catk.org

# === Email (Gmail App Password) ===
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=contact@catk.org
EMAIL_HOST_PASSWORD=xxxx_xxxx_xxxx_xxxx
DEFAULT_FROM_EMAIL=Maktaba CATK <contact@catk.org>

# === CORS ===
CORS_ALLOWED_ORIGINS=https://catk.org,https://www.catk.org
CORS_ALLOW_ALL_ORIGINS=False

# === Sentry (Monitoring erreurs) ===
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# === Google OAuth ===
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
```

```bash
# Sécuriser le fichier d'environnement
chmod 600 .env.prod
```

---

## Certificats SSL

### Option 1 : Let's Encrypt avec Certbot (recommandé)

```bash
# Installation Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir les certificats (remplacer par votre domaine)
sudo certbot certonly --standalone \
    -d catk.org \
    -d www.catk.org \
    --email contact@catk.org \
    --agree-tos \
    --non-interactive

# Les certificats sont dans :
# /etc/letsencrypt/live/catk.org/fullchain.pem
# /etc/letsencrypt/live/catk.org/privkey.pem

# Renouvellement automatique
sudo crontab -e
# Ajouter :
# 0 3 * * * certbot renew --quiet --deploy-hook "docker compose -f /opt/maktaba-catk/docker-compose.prod.yml restart nginx"
```

### Option 2 : Certificat commercial (wildcard)

```bash
# Copier les fichiers dans le projet
sudo cp /path/to/catk.org.crt nginx/ssl/catk.org.crt
sudo cp /path/to/catk.org.key nginx/ssl/catk.org.key
sudo chmod 644 nginx/ssl/catk.org.crt
sudo chmod 600 nginx/ssl/catk.org.key
```

### Configuration Nginx SSL

Le fichier `nginx/nginx.prod.conf` est pré-configuré pour SSL. Vérifier les chemins :

```nginx
ssl_certificate     /etc/letsencrypt/live/catk.org/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/catk.org/privkey.pem;

# Paramètres SSL modernes (Mozilla Intermediate)
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:...;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;
```

---

## Démarrage des containers

```bash
cd /opt/maktaba-catk

# 1. Build des images
docker compose -f docker-compose.prod.yml build

# 2. Démarrer les services de données en premier
docker compose -f docker-compose.prod.yml up -d db redis minio

# Attendre que les services soient healthy
sleep 15
docker compose -f docker-compose.prod.yml ps

# 3. Initialiser MinIO (créer les buckets)
docker compose -f docker-compose.prod.yml run --rm backend \
    python scripts/create_buckets.py

# 4. Appliquer les migrations
docker compose -f docker-compose.prod.yml run --rm backend \
    python manage.py migrate --noinput

# 5. Collecter les fichiers statiques
docker compose -f docker-compose.prod.yml run --rm backend \
    python manage.py collectstatic --noinput

# 6. Charger les données initiales
docker compose -f docker-compose.prod.yml run --rm backend \
    python manage.py loaddata fixtures/categories.json

# 7. Créer le superadmin
docker compose -f docker-compose.prod.yml run --rm backend \
    python manage.py createsuperuser

# 8. Démarrer tous les services
docker compose -f docker-compose.prod.yml up -d

# 9. Vérifier l'état
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail=50
```

### Vérifications post-déploiement

```bash
# Tester l'API
curl -s https://catk.org/api/v1/teachings/ | python3 -m json.tool

# Tester la santé des services
curl -s https://catk.org/api/health/

# Vérifier le certificat SSL
echo | openssl s_client -connect catk.org:443 2>/dev/null | openssl x509 -noout -dates

# Tester les headers de sécurité
curl -I https://catk.org/
```

---

## Configuration DNS

### Enregistrements DNS requis (Cloudflare recommandé)

| Type | Nom | Valeur | TTL | Proxy |
|------|-----|--------|-----|-------|
| A | `catk.org` | `<IP_SERVEUR>` | Auto | ✅ Proxied |
| A | `www` | `<IP_SERVEUR>` | Auto | ✅ Proxied |
| A | `media` | `<IP_SERVEUR>` | Auto | ✅ Proxied |
| AAAA | `catk.org` | `<IPv6_SERVEUR>` | Auto | ✅ Proxied |
| MX | `@` | `mail.catk.org` | Auto | — |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` | Auto | — |
| CNAME | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:admin@catk.org` | Auto | — |

### Configuration Cloudflare

```
SSL/TLS → Full (Strict)
Security → WAF → Managed Rules actives
Speed → Auto Minify → CSS, JS activé
Cache → Browser Cache TTL → 4h pour assets
```

---

## Sauvegarde automatique

### Script de sauvegarde (`scripts/backup.sh`)

```bash
#!/bin/bash
set -e

BACKUP_DIR="/opt/backups/maktaba-catk"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

# === Sauvegarde PostgreSQL ===
echo "📦 Sauvegarde PostgreSQL..."
docker compose -f /opt/maktaba-catk/docker-compose.prod.yml exec -T db \
    pg_dump -U maktaba_user maktaba_catk \
    | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# === Sauvegarde MinIO (médias) ===
echo "📦 Sauvegarde MinIO..."
docker run --rm \
    --network maktaba_network \
    -v "$BACKUP_DIR:/backup" \
    minio/mc:latest \
    mirror minio/maktabacatk "/backup/media_$DATE/"

# Compresser les médias
tar -czf "$BACKUP_DIR/media_$DATE.tar.gz" "$BACKUP_DIR/media_$DATE/"
rm -rf "$BACKUP_DIR/media_$DATE/"

# === Nettoyage des vieilles sauvegardes ===
find "$BACKUP_DIR" -type f -mtime +$RETENTION_DAYS -delete
echo "🧹 Sauvegardes > $RETENTION_DAYS jours supprimées"

# === Rapport ===
echo "✅ Sauvegarde terminée : db_$DATE.sql.gz"
du -sh "$BACKUP_DIR"
```

### Planification cron

```bash
sudo crontab -e
```

```cron
# Sauvegarde quotidienne à 2h du matin
0 2 * * * /opt/maktaba-catk/scripts/backup.sh >> /var/log/maktaba-backup.log 2>&1

# Renouvellement SSL (3h du matin)
0 3 * * * certbot renew --quiet --deploy-hook "docker compose -f /opt/maktaba-catk/docker-compose.prod.yml restart nginx"
```

### Sauvegarde hors-site (recommandé)

```bash
# Synchronisation vers un bucket S3/Backblaze B2
pip install rclone
rclone config  # Configurer destination distante
rclone sync /opt/backups/maktaba-catk remote:maktabacatkbackups
```

---

## Monitoring

### Stack de monitoring recommandée

```yaml
# docker-compose.monitoring.yml
version: '3.9'

services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin_secure_password
    volumes:
      - grafana_data:/var/lib/grafana

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    ports:
      - "8080:8080"

  node_exporter:
    image: prom/node-exporter:latest
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    ports:
      - "9100:9100"
```

### Alertes essentielles (Grafana)

| Métrique | Seuil d'alerte | Sévérité |
|----------|----------------|----------|
| CPU usage | > 80% pendant 5 min | Warning |
| RAM usage | > 85% | Warning |
| Disk usage | > 90% | Critical |
| API response time (p95) | > 2000ms | Warning |
| Error rate (5xx) | > 1% | Critical |
| PostgreSQL connections | > 80% du max | Warning |
| SSL certificate expiry | < 30 jours | Critical |

### Commandes de monitoring rapide

```bash
# Santé des containers
docker compose -f docker-compose.prod.yml ps

# Utilisation des ressources
docker stats --no-stream

# Logs en temps réel
docker compose -f docker-compose.prod.yml logs -f backend

# Métriques PostgreSQL
docker compose -f docker-compose.prod.yml exec db \
    psql -U maktaba_user maktaba_catk \
    -c "SELECT COUNT(*), pg_size_pretty(pg_database_size('maktaba_catk'));"

# Connexions actives
docker compose -f docker-compose.prod.yml exec db \
    psql -U maktaba_user maktaba_catk \
    -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"
```

---

## Mise à jour zero-downtime

### Stratégie Blue-Green

```bash
#!/bin/bash
# scripts/deploy.sh
set -e

cd /opt/maktaba-catk

echo "🔄 Début du déploiement zero-downtime..."

# 1. Pull des nouvelles images
git pull origin main
docker compose -f docker-compose.prod.yml pull

# 2. Build des nouvelles images
docker compose -f docker-compose.prod.yml build backend frontend

# 3. Appliquer les migrations (backward compatible)
docker compose -f docker-compose.prod.yml run --rm backend \
    python manage.py migrate --noinput

# 4. Collecter les statiques
docker compose -f docker-compose.prod.yml run --rm backend \
    python manage.py collectstatic --noinput

# 5. Redémarrage progressif (un container à la fois)
docker compose -f docker-compose.prod.yml up -d --no-deps --scale backend=2 backend
sleep 10

# Vérifier la santé du nouveau container
curl -sf http://localhost:8000/api/health/ || exit 1

# 6. Supprimer l'ancien container
docker compose -f docker-compose.prod.yml up -d --no-deps --scale backend=1 backend

# 7. Redémarrer les workers Celery
docker compose -f docker-compose.prod.yml restart celery_worker celery_beat

# 8. Recharger Nginx (sans coupure)
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "✅ Déploiement terminé avec succès !"
echo "🕐 $(date)"
```

### Déploiement via CI/CD (automatique)

Le déploiement est automatisé via GitHub Actions lors d'un push sur `main`.
Voir `.github/workflows/ci.yml` pour la configuration complète.

```yaml
# Extrait du workflow
deploy:
  steps:
    - name: Deploy via SSH
      run: |
        cd /opt/maktaba-catk
        ./scripts/deploy.sh
```

---

## Rollback

En cas de problème après un déploiement :

```bash
# 1. Revenir à la version précédente (Git)
cd /opt/maktaba-catk
git log --oneline -10           # Trouver le commit précédent
git checkout <PREVIOUS_COMMIT>  # Ou git revert HEAD

# 2. Redéployer l'ancienne version
docker compose -f docker-compose.prod.yml build backend frontend
docker compose -f docker-compose.prod.yml up -d --no-deps backend frontend

# 3. Si migration problématique : rollback BDD
docker compose -f docker-compose.prod.yml run --rm backend \
    python manage.py migrate teachings 0005_previous_working_migration

# 4. Vérifier
curl -sf https://catk.org/api/health/
```

---

## Troubleshooting

### Problèmes courants

#### Le backend ne démarre pas

```bash
# Vérifier les logs
docker compose -f docker-compose.prod.yml logs backend --tail=100

# Vérifier la connexion DB
docker compose -f docker-compose.prod.yml exec backend \
    python manage.py dbshell -c "\dt"

# Tester la configuration
docker compose -f docker-compose.prod.yml run --rm backend \
    python manage.py check --deploy
```

#### Erreurs 502 Bad Gateway (Nginx)

```bash
# Vérifier que le backend répond
docker compose -f docker-compose.prod.yml exec nginx \
    curl -s http://backend:8000/api/health/

# Vérifier la configuration Nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -t

# Recharger Nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

#### Espace disque insuffisant

```bash
# Espace disque
df -h

# Espace utilisé par Docker
docker system df

# Nettoyage des images et volumes inutilisés
docker system prune -af --volumes

# Nettoyage des logs Docker (>100MB)
sudo find /var/lib/docker/containers/ -name "*.log" -size +100M \
    -exec truncate --size=0 {} \;
```

#### Base de données lente

```bash
# Vérifier les requêtes lentes
docker compose -f docker-compose.prod.yml exec db \
    psql -U maktaba_user maktaba_catk \
    -c "SELECT query, mean_exec_time, calls FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"

# ANALYZE pour mettre à jour les statistiques
docker compose -f docker-compose.prod.yml exec db \
    psql -U maktaba_user maktaba_catk -c "ANALYZE;"

# VACUUM pour récupérer l'espace
docker compose -f docker-compose.prod.yml exec db \
    psql -U maktaba_user maktaba_catk -c "VACUUM ANALYZE;"
```

### Contacts support

- 📧 **Infrastructure :** devops@catk.org
- 📧 **Sécurité :** security@catk.org
- 💬 **Slack :** #maktaba-catk-ops
