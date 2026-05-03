BACKEND_DIR = backend/dnd-board
DC = docker-compose -f $(BACKEND_DIR)/docker-compose.yml --project-directory $(BACKEND_DIR)

.PHONY: help install up down logs shell migrate

help: ## Muestra la ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Instalación completa para profesores (Back + preparación)
	@echo "Iniciando instalación del backend..."
	$(DC) up -d --build
	@echo "Instalación en curso. Los contenedores se están configurando solos."
	@echo "Usa 'make logs' para ver el progreso del script entrypoint."

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
