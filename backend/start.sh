#!/usr/bin/env bash
set -o errexit

echo "Démarrage du backend Maktaba CATK..."

echo "Application des migrations..."
python manage.py migrate --noinput

# Table du cache en base (utilisée quand REDIS_URL n'est pas défini) — sans elle, l'inscription plantait
echo "Création de la table de cache..."
python manage.py createcachetable

echo "Collecte des fichiers statiques..."
python manage.py collectstatic --noinput --clear -v 0

echo "Démarrage de Gunicorn..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers ${WEB_CONCURRENCY:-2} \
    --threads 4 \
    --worker-class gthread \
    --timeout 120 \
    --forwarded-allow-ips="*" \
    --access-logfile - \
    --error-logfile -
