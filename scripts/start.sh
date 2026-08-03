#!/bin/bash
set -e

echo "🕌 Maktaba CATK - Starting initialization..."

# Wait for database
echo "⏳ Waiting for database..."
python manage.py wait_for_db

# Apply migrations
echo "📦 Applying migrations..."
python manage.py migrate

# Create superuser if not exists
echo "👤 Creating superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@catk.org').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@catk.org',
        password='admin123catk',
        role='superadmin'
    )
    print('✅ Superuser created: admin@catk.org')
else:
    print('ℹ️ Superuser already exists')
"

# Load initial data
echo "📚 Loading initial categories..."
python manage.py loaddata fixtures/categories.json || echo "No fixtures found"

# Collect static files
echo "🎨 Collecting static files..."
python manage.py collectstatic --noinput

echo "🚀 Maktaba CATK is ready!"
