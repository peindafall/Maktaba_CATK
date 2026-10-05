#!/usr/bin/env bash
set -o errexit

pip install --upgrade pip
pip install -r requirements/production.txt

python manage.py collectstatic --no-input
python manage.py migrate

echo "✅ Build terminé."
ls -la /app/media/ || echo "⚠️ /app/media vide"