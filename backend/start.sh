#!/usr/bin/env bash
set -o errexit

echo "Démarrage du backend Maktaba CATK..."

# Migrations
echo "Application des migrations..."
python manage.py migrate --noinput

# Collecte des fichiers statiques
echo "Collecte des fichiers statiques..."
python manage.py collectstatic --noinput --clear

# Démarrage de Gunicorn
echo "Démarrage de Gunicorn..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -