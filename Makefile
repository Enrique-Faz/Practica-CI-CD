BACKEND_DIR = backend/dnd-board
DC = docker-compose -f $(BACKEND_DIR)/docker-compose.yml --project-directory $(BACKEND_DIR)

.PHONY: help install up down logs shell migrate clean fclean reset

help: ## Muestra la ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Instalación completa para profesores (Back + preparación)
	@echo "Preparando archivos de configuración..."
	@if [ ! -f $(BACKEND_DIR)/.env ]; then \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env; \
		echo "Archivo .env creado."; \
	fi
	@echo "Iniciando contenedores..."
	$(DC) up -d --build[cite: 2]
	@echo "Generando clave de aplicación..."[cite: 2]
	$(DC) exec app php artisan key:generate[cite: 2]
	@echo "El sistema se está configurando. Revisa los logs con 'make logs'."[cite: 2]

up: ## Levanta todos los servicios
	$(DC) up -d[cite: 2]

down: ## Apaga todos los servicios
	$(DC) down[cite: 2]

logs: ## Muestra logs del backend
	$(DC) logs -f app[cite: 2]

shell: ## Entra en la terminal de Laravel
	$(DC) exec app bash[cite: 2]

migrate: ## Ejecuta migraciones manualmente
	$(DC) exec app php artisan migrate[cite: 2]

clean: ## Detiene contenedores y limpia archivos temporales de Laravel
	$(DC) down[cite: 2]
	@echo "Limpiando cachés de Laravel..."[cite: 2]
	-$(DC) exec app php artisan optimize:clear[cite: 2]

fclean: ## BORRADO TOTAL: Elimina contenedores, imágenes, volúmenes y el archivo .env
	@echo "⚠️  ATENCIÓN: Se van a borrar todos los datos, imágenes y el archivo .env"[cite: 2]
	$(DC) down --rmi all --volumes --remove-orphans[cite: 2]
	@if [ -f $(BACKEND_DIR)/.env ]; then \
		rm $(BACKEND_DIR)/.env; \
		echo "Archivo .env eliminado."; \
	fi[cite: 2]
	@echo "✅ Sistema borrado por completo."[cite: 2]

reset: fclean install ## Borra todo y vuelve a instalar desde cero