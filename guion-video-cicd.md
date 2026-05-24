# Guion para el video de defensa — Práctica CI/CD

## Intro (30 segundos)

- "Soy Enrique Faz Dionisio y esta es mi práctica de CI/CD con GitHub Actions."
- "El proyecto es una aplicación web de tableros de D&D con Angular 21 en el frontend y Laravel 13 en el backend, desplegada en un VPS propio."
- "He implementado dos workflows separados: uno de Integración Continua (CI) y otro de Despliegue Continuo (CD)."

---

## 1. Control de versiones (1 minuto)

**Mostrar:**

- El repositorio en GitHub (commits, ramas)
- Historial de commits con mensajes descriptivos (Conventional Commits: `feat:`, `fix:`, `chore:`)
- Mostrar que usamos Husky + Commitlint para validar los mensajes de commit
- Mostrar las ramas utilizadas: `main`, `develop`, `test1` (en el historial)
- Mostrar un ejemplo de Pull Request mergeada

**Decir:**

- "Usamos Conventional Commits validados con Husky y Commitlint."
- "El flujo de trabajo es: se desarrolla en ramas auxiliares, se abre PR a main, el CI valida la calidad, y al mergear se dispara el CD."

---

## 2. Pipeline CI — Integración Continua (3 minutos)

### 2.1 Disparadores

**Mostrar:** el archivo `ci.yml` en la sección `on:`

**Decir:**

- "El CI se ejecuta con 3 disparadores: PR a main (automático), cron cada lunes a las 3AM (periódico), y workflow_dispatch (manual con parámetros)."

### 2.2 Análisis de calidad del código

**Mostrar:** los logs del job `quality` en GitHub Actions, donde se ejecuta ESLint y Pint

**Decir:**

- "Usamos ESLint con angular-eslint y typescript-eslint para el frontend, y Laravel Pint (PSR-2) para el backend."
- "Ambos se ejecutan en modo check antes de los tests."

### 2.3 Tests y cobertura

**Mostrar:** los logs de ejecución de tests (Vitest con `--coverage` y PHPUnit con `--coverage-text`)

**Decir:**

- "En el frontend usamos Vitest con 13 tests: unitarios para las utilidades (case-converter) y de integración para servicios (ModalService)."
- "En el backend usamos PHPUnit con tests unitarios del modelo Board y tests de integración (Feature tests) de la API de autenticación."
- "Ambos generan informes de cobertura de código."

### 2.4 Parámetros de ejecución (CI)

**Mostrar:** el `workflow_dispatch` del CI con el input `run_build`

**Decir:**

- "El CI tiene un parámetro `run_build` que permite controlar si se ejecuta también el build Docker al lanzar manualmente."

---

## 3. Pipeline CD — Despliegue Continuo (4 minutos)

### 3.1 Disparadores

**Mostrar:** el archivo `cd.yml` en la sección `on:`

**Decir:**

- "El CD se ejecuta al hacer push/merge a main (automático) y manualmente con workflow_dispatch."
- "El dispatch tiene parámetros: `environment` (production/staging) y `skip_deploy` (boolean)."
- "En total entre CI y CD tenemos 4 disparadores distintos: push, pull_request, cron, y workflow_dispatch."

### 3.2 Build y publicación de imágenes Docker

**Mostrar:** el job `build-and-publish` en los logs de Actions + Docker Hub con las imágenes publicadas

**Decir:**

- "Se construyen dos imágenes Docker del frontend: una basada en Alpine y otra en Debian (bookworm)."
- "Ambas contienen la misma app Angular compilada, solo cambia el SO base de nginx."
- "Se publican automáticamente en Docker Hub con tags de versión (sha del commit) y `latest`."

### 3.3 Dockerfiles

**Mostrar:** abrir `Dockerfile` y `Dockerfile.debian` del frontend

**Decir:**

- "Ambos Dockerfiles incluyen todas las instrucciones requeridas: FROM, RUN, LABEL MAINTAINER, ENV, COPY, VOLUME, EXPOSE y CMD."
- "Usan multi-stage build: primero compilan con node:22, luego sirven con nginx. Se eliminan ficheros temporales para mantener la imagen limpia."
- "El Dockerfile Alpine usa `nginx:alpine` y el Debian usa `nginx:bookworm`."

**Mostrar:** también el Dockerfile del backend

**Decir:**

- "El backend también tiene su Dockerfile con PHP-FPM, con las mismas instrucciones obligatorias y ENTRYPOINT para el script de inicialización."

### 3.4 Escaneo de seguridad (ClamAV)

**Mostrar:** los logs del paso ClamAV en Actions

**Decir:**

- "Tras publicar las imágenes, se instala ClamAV en el runner, se actualizan las firmas con freshclam, se exporta la imagen a un .tar y se escanea buscando malware o código malicioso."

### 3.5 Despliegue automático

**Mostrar:** el job `deploy` en los logs + la web funcionando en polidnd.chickenkiller.com

**Decir:**

- "El despliegue se realiza automáticamente via SSH al VPS usando la action appleboy/ssh-action."
- "El script conecta por SSH, hace git pull del código nuevo, y usa el Makefile del proyecto: `make install-prod` la primera vez o `docker compose build` + `make up` + `make migrate` en actualizaciones."
- "No requiere intervención manual — al mergear a main se despliega solo."

### 3.6 Jobs enlazados

**Mostrar:** la vista de jobs en GitHub Actions donde se ve la cadena `build-and-publish → deploy → post-deploy`

**Decir:**

- "El CD tiene 3 jobs encadenados con `needs`: primero se construyen y publican las imágenes, luego se despliega en el VPS, y finalmente se ejecutan las pruebas post-despliegue."

---

## 4. Pruebas post-despliegue y monitorización (1 minuto)

**Mostrar:** los logs del job `post-deploy`

**Decir:**

- "Tras desplegar, se ejecutan pruebas funcionales: un health check al frontend (espera HTTP 200 en el puerto 8001) y otro a la API del backend."
- "También se conecta por SSH y ejecuta `docker compose ps` y `docker stats` para verificar que los contenedores están corriendo y monitorizar el uso de recursos."
- "Estos resultados sirven como reporte del estado del despliegue."

---

## 5. Notificaciones por email (30 segundos)

**Mostrar:** el email recibido (bandeja de entrada con el asunto "✅ Deploy exitoso - DnD Board")

**Decir:**

- "Se envía automáticamente un email via Gmail SMTP con el resultado."
- "En caso de éxito incluye los detalles del commit, actor y enlace al workflow."
- "En caso de fallo incluye el motivo del error y enlace a los logs para revisarlos."

---

## 6. Gestión de usuarios y parámetros (30 segundos)

**Mostrar:** GitHub Settings → Secrets and variables → Actions (sin revelar valores)

**Decir:**

- "Los usuarios y credenciales se gestionan mediante GitHub Secrets: Docker Hub, VPS (SSH key), y Gmail para notificaciones."
- "Cada servicio tiene sus propias credenciales segregadas."
- "Los parámetros de ejecución permiten elegir el entorno (production/staging) y saltar el deploy si solo quieres hacer build."

---

## 7. Ejecución manual (demo en vivo) (1 minuto)

**Hacer:**

1. Ir a Actions → CD - Despliegue Continuo → Run workflow
2. Seleccionar parámetros: `environment: production`, `skip_deploy: false`
3. Mostrar cómo arranca la ejecución

**Decir:**

- "Aquí demuestro la ejecución manual con workflow_dispatch. Puedo elegir el entorno y si quiero saltar el deploy."

---

## 8. Demostración del flujo completo PR → Merge (1 minuto)

**Hacer (o mostrar en el historial):**

1. Mostrar una PR cerrada donde el CI corrió (solo quality — lint + tests)
2. Mostrar el merge que disparó el CD (build + deploy + post-deploy + email)

**Decir:**

- "Al abrir la PR, el CI valida calidad y tests. Al mergear, se dispara el CD que construye, publica, despliega y notifica."

---

## Cierre (15 segundos)

- "En resumen: pipeline completo con CI separado del CD, 4 disparadores, tests con cobertura, 2 imágenes Docker publicadas en Docker Hub, despliegue automático, pruebas post-deploy, notificaciones email, y escaneo de seguridad con ClamAV."

---

## Tiempo total estimado: ~12 minutos

## Checklist antes de grabar

- [ ] La web funciona en polidnd.chickenkiller.com:8001
- [ ] Docker Hub tiene las imágenes con tags alpine/debian
- [ ] Hay al menos un email de notificación en la bandeja de entrada
- [ ] La PR en el historial muestra el CI ejecutado
- [ ] El merge muestra el CD ejecutado (build + deploy + post-deploy)
- [ ] El workflow_dispatch funciona al ejecutar manualmente
