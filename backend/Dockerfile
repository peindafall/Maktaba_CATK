FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

WORKDIR /app

# FIX : Configuration des dépôts Debian
RUN echo "deb http://deb.debian.org/debian/ bookworm main contrib non-free" > /etc/apt/sources.list && \
    echo "deb http://deb.debian.org/debian/ bookworm-updates main contrib non-free" >> /etc/apt/sources.list && \
    echo "deb http://security.debian.org/debian-security bookworm-security main contrib non-free" >> /etc/apt/sources.list

# Installation des dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Development stage
FROM base AS development
COPY requirements/ requirements/
RUN pip install -r requirements/development.txt
COPY . .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Production stage
FROM base AS production
COPY requirements/ requirements/
RUN pip install -r requirements/production.txt
COPY . .

# Créer l'utilisateur non-root
RUN addgroup --system appgroup && adduser --system --group appuser

# PAS de migrate ni collectstatic ICI
# Ils seront faits au démarrage via start.sh

USER appuser
EXPOSE 8000

CMD ["./start.sh"]