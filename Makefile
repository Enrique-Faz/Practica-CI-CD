BACKEND_DIR = backend/dnd-board
DC = docker compose

.PHONY: help install install-prod up up-back down logs shell migrate clean fclean reset cache

help: ## Muestra la ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Instalación local completa (backend + frontend dockerizados)
	@echo "Preparando archivos de configuración..."
	@if [ ! -f $(BACKEND_DIR)/.env ]; then \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env; \
		echo "Archivo .env creado."; \
	fi
	@echo "Construyendo imágenes..."
	BUILD_CONFIG=development $(DC) --profile prod build
	@echo "Iniciando contenedores..."
	BUILD_CONFIG=development $(DC) --profile prod up -d
	@echo "Generando clave de aplicación..."
	$(DC) exec app php artisan key:generate
	@echo "✅ Todo listo — Backend :8000 | Frontend :8001"

install-prod: ## Instalación en VPS de producción
	@echo "Preparando archivos de configuración de producción..."
	@if [ ! -f $(BACKEND_DIR)/.env ]; then \
		cp $(BACKEND_DIR)/.env.example.prod $(BACKEND_DIR)/.env; \
		echo "Archivo .env de producción creado."; \
	fi
	@echo "Construyendo imágenes..."
	$(DC) --profile prod build
	@echo "Iniciando contenedores..."
	$(DC) --profile prod up -d
	@echo "Generando clave de aplicación..."
	$(DC) exec app php artisan key:generate
	@echo "✅ Producción lista — Backend :8000 | Frontend :8001"

up: ## Levanta todos los servicios (incluido frontend)
	$(DC) --profile prod up -d

up-back: ## Levanta solo backend + DB (para usar con ng serve)
	$(DC) up -d

down: ## Apaga todos los servicios
	$(DC) --profile prod down

logs: ## Muestra logs del backend
	$(DC) logs -f app

shell: ## Entra en la terminal de Laravel
	$(DC) exec app bash

migrate: ## Ejecuta migraciones manualmente
	$(DC) exec app php artisan migrate --seed

clean: ## Limpia cache de Laravel y apaga contenedores
	@echo "Limpiando cachés de Laravel..."
	-$(DC) exec app php artisan optimize:clear
	$(DC) --profile prod down

cache: ## Limpia la caché sin apagar los contenedores
	@echo "Limpiando cachés de Laravel..."
	$(DC) exec app php artisan optimize:clear

fclean: ## BORRADO TOTAL: Elimina contenedores, imágenes, volúmenes y el archivo .env
	@echo "⚠️  ATENCIÓN: Borrando todo..."
	$(DC) --profile prod down -v --rmi all
	@docker volume prune -f
	@if [ -f $(BACKEND_DIR)/.env ]; then rm $(BACKEND_DIR)/.env; fi
	@echo "✅ Sistema borrado por completo."

reset: fclean install ## Borra todo y vuelve a instalar desde cero
