BACKEND_DIR = backend/dnd-board
DC = docker compose

.PHONY: help install install-prod up up-back down logs logs-front logs-db shell migrate seed clean cache fclean reset reset-prod lint lint-front lint-back

help: ## Muestra todos los comandos disponibles
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# ─── INSTALACIÓN ─────────────────────────────────────────────────────────────

install: ## [LOCAL] Primera instalación: backend + frontend + DB en localhost
	@echo "Preparando archivos de configuración..."
	@if [ ! -f $(BACKEND_DIR)/.env ]; then \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env; \
		echo "Archivo .env creado."; \
	fi
	@echo "Construyendo imágenes..."
	BUILD_CONFIG=development $(DC) --profile prod build
	@echo "Iniciando contenedores..."
	BUILD_CONFIG=development $(DC) --profile prod up -d
	@echo "✅ Contenedores iniciados — el entrypoint espera a MySQL y migra automáticamente."
	@echo "   Backend: localhost:8000 | Frontend: localhost:8001"

install-prod: ## [PROD] Primera instalación en VPS (polidnd.chickenkiller.com)
	@echo "Preparando archivos de configuración de producción..."
	@if [ ! -f $(BACKEND_DIR)/.env ]; then \
		cp $(BACKEND_DIR)/.env.example.prod $(BACKEND_DIR)/.env; \
		echo "Archivo .env de producción creado."; \
	fi
	@echo "Construyendo imágenes..."
	$(DC) --profile prod build
	@echo "Iniciando contenedores..."
	$(DC) --profile prod up -d
	@echo "✅ Contenedores iniciados — el entrypoint espera a MySQL y migra automáticamente."
	@echo "   Backend: :8000 | Frontend: :8001"

# ─── CICLO DE VIDA ───────────────────────────────────────────────────────────

up: ## Levanta todos los servicios (backend + frontend) sin reconstruir
	$(DC) --profile prod up -d

up-back: ## Levanta solo backend + DB, sin frontend (para desarrollo con ng serve)
	$(DC) up -d

down: ## Apaga todos los servicios
	$(DC) --profile prod down

# ─── LOGS ────────────────────────────────────────────────────────────────────

logs: ## Logs en tiempo real del backend (Laravel/PHP)
	$(DC) logs -f app

logs-front: ## Logs en tiempo real del frontend (nginx)
	$(DC) --profile prod logs -f frontend

logs-db: ## Logs en tiempo real de la base de datos (MySQL)
	$(DC) logs -f db

# ─── BASE DE DATOS ────────────────────────────────────────────────────────────

migrate: ## Ejecuta las migraciones de la base de datos
	$(DC) exec app php artisan migrate --force

seed: ## Ejecuta los seeders (datos de prueba) — solo para local
	$(DC) exec app php artisan db:seed --force

# ─── LINTING ─────────────────────────────────────────────────────────────────

lint: lint-back lint-front ## Ejecuta linters de backend y frontend

lint-back: ## Ejecuta Laravel Pint (fija el código automáticamente)
	cd $(BACKEND_DIR) && ./vendor/bin/pint

lint-front: ## Ejecuta ESLint en el frontend (modo check)
	cd frontend/dnd-board-front && npm run lint

# ─── MANTENIMIENTO ───────────────────────────────────────────────────────────

shell: ## Abre una terminal bash dentro del contenedor de Laravel
	$(DC) exec app bash

cache: ## Limpia la caché de Laravel sin apagar los contenedores
	$(DC) exec app php artisan optimize:clear

clean: ## Limpia caché de Laravel y apaga todos los contenedores
	@echo "Limpiando cachés de Laravel..."
	-$(DC) exec app php artisan optimize:clear
	$(DC) --profile prod down

fclean: ## BORRADO TOTAL: contenedores, imágenes, volúmenes y .env
	@echo "⚠️  ATENCIÓN: Borrando todo..."
	$(DC) --profile prod down -v --rmi all
	@docker volume prune -f
	@if [ -f $(BACKEND_DIR)/.env ]; then rm $(BACKEND_DIR)/.env; fi
	@echo "✅ Sistema borrado por completo."

# ─── RESET ───────────────────────────────────────────────────────────────────

reset: fclean install ## [LOCAL] Borra todo y reinstala desde cero en local

reset-prod: fclean install-prod ## [PROD] Borra todo y reinstala desde cero en producción
