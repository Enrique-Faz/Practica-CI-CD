# Diagramas de Clases — D&D Board

El sistema se ha dividido en **dos diagramas de clases independientes**, uno por cada capa de la arquitectura. Esta separación refleja la naturaleza desacoplada del proyecto: el backend expone una API REST y el frontend la consume de forma totalmente independiente.

---

## Backend (`diagrama-clases-backend.puml`)

El diagrama del backend modela la API Laravel y se organiza en **4 paquetes**:

### Models

Contiene los tres modelos de dominio de la aplicación:

- **User** — Representa a un usuario registrado. Tiene rol (`normal` o `admin`) y puede tener 2FA activado. Es el punto central del sistema: posee personajes y puede ser DM de tableros.
- **Board** — Representa un tablero de juego. Pertenece a un DM (User) y tiene muchos personajes mediante una relación muchos-a-muchos. Genera automáticamente un `join_code` único al crearse.
- **Character** — Representa un personaje con sus estadísticas D&D. Pertenece a un usuario y puede estar en múltiples tableros al mismo tiempo.
- **BoardCharacter** _(pivot)_ — Tabla intermedia de la relación muchos-a-muchos entre `Board` y `Character`. Añade datos de posición (`position_x`, `position_y`) sobre el grid al vínculo.

La relación central del sistema es:

```
User(1) ──── Character(N) ──── Board(N) ──── User(1, como DM)
```

### Enums

Agrupa los valores cerrados que usan los modelos:

- **Role** — Roles posibles de un usuario (`admin`, `normal`).
- **CharacterClass** — Las 11 clases de personaje disponibles.
- **BoardMap** — Los mapas de fondo disponibles para un tablero.

Se separan en su propio paquete porque son tipos compartidos por modelos y validaciones, no pertenecen exclusivamente a ninguno.

### Controllers

Contiene los cuatro controladores de la API, que implementan la lógica de cada recurso:

- **AuthController** — Registro, login, OAuth con Google, verificación 2FA y logout.
- **CharacterController** — CRUD de personajes, con control de propiedad.
- **BoardController** — CRUD de tableros, unirse con código, mover personajes, gestionar iniciativa.
- **AdminController** — Estadísticas y gestión de usuarios/tableros para administradores.
- **AdminMiddleware** — Se incluye aquí porque es la capa de autorización que protege las rutas del `AdminController`.

### Resources

Transforma los modelos Eloquent en la respuesta JSON que consume el frontend, desacoplando la representación interna de la externa:

- **UserResource**, **CharacterResource**, **BoardResource** — Uno por modelo principal.
- **AuthResource** — Agrupa el token y el UserResource en la respuesta de autenticación.

---

## Frontend (`diagrama-clases-frontend.puml`)

El diagrama del frontend modela la SPA Angular 21 y se organiza en **5 paquetes**:

### Tipos

Agrupa interfaces TypeScript y enums. No son clases instanciables: son contratos de datos que definen la forma de los objetos que circulan por la aplicación.

- Las interfaces de dominio (`User`, `Board`, `Character` y sus subtipos) representan directamente la respuesta JSON del backend.
- Las interfaces de admin (`AdminStats`, `AdminUser`, `AdminBoard`) modelan los datos del panel de administración.
- `PopupData` define la estructura de los datos que recibe el servicio de popups de confirmación.

### Services

Los servicios son los únicos responsables de comunicarse con la API y de mantener el estado compartido entre componentes. Se han modelado como clases porque Angular los instancia como singletons (`providedIn: 'root'`).

- **AuthService** — Estado de sesión global. Todos los guardias y el interceptor dependen de él.
- **BoardService** / **CharacterService** — Encapsulan el acceso a la API y exponen `HttpResource` reactivos.
- **AdminService** — Exclusivo para las páginas del panel de administración.
- **ProfileService** — Carga los datos del perfil del usuario autenticado.
- **ModalService** — Gestiona el sistema de modales: qué modal está abierto y qué datos recibe.
- **PopupService** — Gestiona los popups de confirmación (sí/no) de forma reactiva con `Observable<boolean>`.

### Core

Contiene los **guards** y el **interceptor HTTP**, que son funciones de Angular (no clases instanciables, pero se modelan como clases para representarlas en el diagrama):

- **authGuard** — Protege rutas privadas redirigiendo al login si no hay sesión.
- **guestGuard** — Protege rutas públicas (login, register) redirigiendo al dashboard si ya hay sesión.
- **adminGuard** — Protege rutas del panel de administración verificando el rol.
- **preventUnsavedGuard** — Impide salir de una página con el formulario sucio, mostrando un popup de confirmación.
- **authInterceptor** — Añade automáticamente el token Bearer a todas las peticiones HTTP salientes.

### Pages

Los componentes de página son **contenedores inteligentes** (smart components): inyectan servicios, gestionan el estado local con signals y computed, y orquestan a los componentes presentacionales hijos. No reciben `@input()` porque son el punto de entrada de cada ruta.

Se separan de los componentes presentacionales porque tienen responsabilidades distintas y una relación directa con el router.

### Components

Los componentes presentacionales son **componentes tontos** (dumb components): reciben datos como `@input()`, emiten eventos con `@output()`, y presentan datos o recogen interacciones del usuario. No conocen los servicios (salvo los modales, que necesitan `ModalService` para cerrarse).

Se subcategorizan implícitamente por feature:

- **Auth**: `Login`, `Register`
- **Board**: `BoardCard`, `BoardGrid`, `BoardToken`, `CharacterSheet`, `InitiativePanel`, `SideNavPanel`, `DiceRoller`, `GridConfigPanel`, `CreateBoardModal`, `JoinBoardModal`
- **Characters**: `CharacterCard`, `CharacterFormModal`
- **Profile**: `TwoFaModal`
- **Admin**: `UsersTable`, `BoardsTable`, `BoardsChart`
- **Shared**: `ConfirmPopup`

---

## Criterio de las relaciones

Para mantener los diagramas legibles, las relaciones se han reducido a las **arquitectónicamente relevantes**:

| Tipo de relación                      | Criterio                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------ |
| Model → Model (asociación `--`)       | Siempre: son las FK de la base de datos                                  |
| Model → Enum (`..>`)                  | Siempre: define los valores posibles                                     |
| Controller → Model / Resource (`..>`) | Siempre: es la razón de existir del controlador                          |
| Page → Service (`-->`)                | Solo los servicios que la página inyecta directamente                    |
| Component → Service (`-->`)           | Solo los modales que inyectan `ModalService`/servicios para funcionar    |
| Component → Component (`-->`)         | Solo composición directa (un componente renderiza a otro en su template) |

Las relaciones page → component presentacional se omiten deliberadamente: quedan implícitas por el nombre del paquete y añadirlas multiplicaría las flechas sin aportar información nueva.
