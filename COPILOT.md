# Plan de Acción MVP: Tablero Virtual y Gestor de Partidas D&D

## 1. Stack Tecnológico y Arquitectura
*   **Frontend:** Angular 21 (Standalone components, Control Flow, `rxResource` para reactividad).
*   **Backend:** Laravel 11 (API REST).
*   **Autenticación:** Laravel Sanctum (API Tokens mediante cabecera `Bearer`).
*   **Base de Datos:** MySQL 8.
*   **Infraestructura:** Docker (Configuración manual con `Dockerfile` para la API y `docker-compose.yml` uniendo la App y MySQL).

---

## 2. Definición del Backend (Laravel 11)

### 2.1. Base de Datos (Migraciones)
*   `users`: Añadir campo booleano `is_admin` (default: false)[cite: 1].
*   `boards`: `id`, `name`, `dm_id` (foreign key a `users`), `background_image` (string para el asset local), `initiative_order` (JSON, guarda los IDs en orden de turno), `current_turn_index` (Integer, default 0)[cite: 1].
*   `characters`: `id`, `user_id` (dueño), `name`, `hp`, `strength`, `dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma`, `speed`[cite: 1].
*   `board_character` (Tabla Pivote): `board_id`, `character_id`, `position_x` (int), `position_y` (int)[cite: 1].

### 2.2. Autenticación (Sanctum API Tokens)
*   **Login:** Al verificar credenciales, Laravel genera un token: `$user->createToken('auth_token')->plainTextToken` y lo devuelve en el JSON.
*   **Middleware:** Proteger rutas con `auth:sanctum`.
*   **Admin Middleware:** Crear middleware `EnsureUserIsAdmin` que verifique `$request->user()->is_admin`.

### 2.3. Endpoints de la API
*   **Auth:** `POST /api/login`, `POST /api/register`, `POST /api/logout`, `GET /api/user`.
*   **Characters & Boards:** CRUDs básicos.
*   **Juego y Tablero:**
    *   `GET /api/boards/{id}`: Devuelve estado del tablero, tokens y turnos.
    *   `POST /api/boards/{id}/move`: Recibe `{character_id, x, y}`. Verifica si es DM o dueño del personaje para permitir el cambio en la tabla pivote.
*   **Sistema de Turnos:**
    *   `POST /api/boards/{id}/start`: El DM calcula la iniciativa (tirada de d20 + destreza de todos los personajes vinculados) y guarda el array en `initiative_order`.
    *   `POST /api/boards/{id}/next-turn`: Avanza `current_turn_index` + 1.

---

## 3. Definición del Frontend (Angular 21)

### 3.1. Configuración Core y Auth
*   **Interceptor HTTP:** Un `AuthInterceptor` que intercepte todas las peticiones a `/api/*` y añada la cabecera `Authorization: Bearer ${localStorage.getItem('token')}`.
*   **AuthService:** Maneja el login, guarda el token en `localStorage` y mantiene una señal (`Signal`) con los datos del usuario actual.

### 3.2. Vistas Generales
*   `/login` y `/register`: Acceso.
*   `/dashboard`: Panel personal para crear/ver personajes y partidas[cite: 1].
*   `/board/:id`: El tablero principal[cite: 1].
*   `/admin`: Panel de control (solo accesible si el usuario es admin)[cite: 1].

### 3.3. Tablero y Sistema de Turnos (`rxResource`)
*   **Sincronización Continua:** Usar `rxResource` vinculado a un temporizador o señal para hacer *polling* a `GET /api/boards/{id}` y mantener el estado actualizado de forma fluida.
*   **El Mapa:** Sistema CSS Grid sobre una imagen de fondo estática[cite: 1].
*   **Los Tokens:** Renderizado de las fichas en la cuadrícula leyendo sus atributos `x` e `y`[cite: 1].
*   **Interfaz Dinámica (Turnos):**
    *   Banner superior indicando de quién es el turno (`activeCharacterId`).
    *   Los botones de "Mover" y "Terminar Turno" solo se renderizan (`@if`) si el usuario logueado es el DM, o si es el turno de ese personaje y el usuario es su dueño.
*   **Dados:** Lógica local en TypeScript `Math.floor(Math.random() * 20) + 1` vinculada a un botón[cite: 1].

---

## 4. Fases del Sprint (96 Horas)

*   **Fase 1 (Día 1):** Escribir `Dockerfile` (ej. basado en `php:8.2-apache` o `8.3`) y `docker-compose.yml` (servicios: `app` y `db`). Levantar contenedores. Configurar migraciones de Laravel. Implementar API de Auth devolviendo los Tokens de Sanctum y probar con Postman. Crear un seeder de pruebas.
*   **Fase 2 (Día 2):** Proyecto Angular 21. Configurar Interceptor HTTP y AuthService (localStorage). Pantallas de Login/Register y Dashboard básico de creación de personajes.
*   **Fase 3 (Día 3):** Endpoints de tablero, cálculo de iniciativa y movimiento. En Angular, pintar el Grid CSS con la imagen de fondo y colocar los tokens en base a las coordenadas de la API.
*   **Fase 4 (Día 4):** Implementar el *polling* con `rxResource` en Angular, bloquear los controles según el turno, añadir el dado aleatorio y pulir el diseño del Panel Admin.