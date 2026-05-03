BACKEND_DIR = backend/dnd-board
DC = docker compose -f $(BACKEND_DIR)/docker-compose.yml --project-directory $(BACKEND_DIR)

.PHONY: help install up down logs shell migrate clean fclean reset

help: ## Muestra la ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Instalación completa para profesores (Back + preparación)
	@echo "Preparando archivos de configuración..."
	@if [ ! -f $(BACKEND_DIR)/.env ]; then \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env; \
		echo "Archivo .env creado."; \
	fi
	@echo "Construyendo imágenes..."
	$(DC) build
	@echo "Iniciando contenedores..."
	$(DC) up -d
	@echo "Generando clave de aplicación..."
	$(DC) exec app php artisan key:generate
	@echo "El sistema se está configurando. Revisa los logs con 'make logs'."

up: ## Levanta todos los servicios
	$(DC) up -d

down: ## Apaga todos los servicios
	$(DC) down

logs: ## Muestra logs del backend
	$(DC) logs -f app

shell: ## Entra en la terminal de Laravel
	$(DC) exec app bash

migrate: ## Ejecuta migraciones manualmente
	$(DC) exec app php artisan migrate

clean: ## Detiene contenedores y limpia archivos temporales de Laravel
	$(DC) down
	@echo "Limpiando cachés de Laravel..."
	-$(DC) exec app php artisan optimize:clear

fclean: ## BORRADO TOTAL: Elimina contenedores, imágenes, volúmenes y el archivo .env
	@echo "⚠️  ATENCIÓN: Se van a borrar todos los datos, imágenes y el archivo .env"
	$(DC) down --rmi all
	@docker volume prune -f
	@if [ -f $(BACKEND_DIR)/.env ]; then \
		rm $(BACKEND_DIR)/.env; \
		echo "Archivo .env eliminado."; \
	fi
	@echo "✅ Sistema borrado por completo."

reset: fclean install ## Borra todo y vuelve a instalar desde cero
