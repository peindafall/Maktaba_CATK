.PHONY: help dev prod stop logs clean migrate seed test

help:
	@echo "🕌 Maktaba CATK - Available commands:"
	@echo ""
	@echo "  make dev      - Start development environment"
	@echo "  make prod     - Start production environment"
	@echo "  make stop     - Stop all containers"
	@echo "  make logs     - Show logs"
	@echo "  make migrate  - Run database migrations"
	@echo "  make seed     - Load initial data"
	@echo "  make test     - Run all tests"
	@echo "  make clean    - Remove all containers and volumes"

dev:
	docker compose up -d --build
	@echo "✅ Development environment started"
	@echo "📱 Frontend: http://localhost:3000"
	@echo "🔧 Backend API: http://localhost:8000/api/v1/"
	@echo "📚 Swagger: http://localhost:8000/api/docs/"
	@echo "⚙️ Django Admin: http://localhost:8000/admin/"
	@echo "💾 MinIO Console: http://localhost:9001"

prod:
	docker compose -f docker-compose.prod.yml up -d
	@echo "✅ Production environment started"

stop:
	docker compose down

logs:
	docker compose logs -f

migrate:
	docker compose exec backend python manage.py migrate

seed:
	docker compose exec backend python manage.py loaddata fixtures/categories.json

test:
	docker compose exec backend pytest apps/ -v
	cd frontend && npm test

shell:
	docker compose exec backend python manage.py shell

clean:
	docker compose down -v --rmi all
	@echo "🧹 All containers and volumes removed"

createsuperuser:
	docker compose exec backend python manage.py createsuperuser
