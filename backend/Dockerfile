FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Development stage
FROM base AS development
COPY requirements/ requirements/
RUN pip install -r requirements/development.txt
COPY . .
EXPOSE 8000

# Production stage
FROM base AS production
COPY requirements/ requirements/
RUN pip install -r requirements/production.txt
COPY . .
RUN python manage.py collectstatic --noinput
RUN addgroup --system appgroup && adduser --system --group appuser
USER appuser
EXPOSE 8000
