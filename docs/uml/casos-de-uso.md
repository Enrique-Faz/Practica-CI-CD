# Descripción de Casos de Uso — D&D Board

---

## Actores

| Actor             | Descripción                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Invitado**      | Usuario no autenticado. Solo puede registrarse o iniciar sesión.                                                                                 |
| **Jugador**       | Usuario autenticado con rol `normal`. Puede gestionar personajes, tableros y jugar.                                                              |
| **Administrador** | Usuario con rol `admin`. Hereda todas las capacidades del jugador y además puede gestionar usuarios y tableros desde el panel de administración. |

---

## Casos de Uso

### Autenticación

| ID    | Caso de Uso               | Actor    | Descripción                                                                                                                                                   | Precondiciones                                             | Postcondiciones                                                                                    |
| ----- | ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| UC-01 | Registrarse               | Invitado | El usuario crea una cuenta proporcionando nombre, apellido, email y contraseña.                                                                               | El email no debe estar registrado.                         | Se crea la cuenta y se devuelve un token de acceso.                                                |
| UC-02 | Iniciar sesión            | Invitado | El usuario se autentica con email y contraseña.                                                                                                               | La cuenta debe existir.                                    | Se devuelve un token de acceso. Si tiene 2FA activado, se requiere verificación adicional (UC-06). |
| UC-03 | Iniciar sesión con Google | Invitado | El usuario se autentica mediante OAuth con Google. Si no tiene cuenta, se crea automáticamente.                                                               | Tener cuenta de Google.                                    | Se redirige al frontend con el token de sesión.                                                    |
| UC-04 | Cerrar sesión             | Jugador  | El usuario revoca todos sus tokens de acceso.                                                                                                                 | Estar autenticado.                                         | Se eliminan los tokens y se cierra la sesión.                                                      |
| UC-05 | Configurar 2FA            | Jugador  | El usuario genera un secreto 2FA y escanea el código QR con una app autenticadora. Al verificar un código válido, se activa la autenticación en dos factores. | Estar autenticado. No tener 2FA activo.                    | Se activa 2FA en la cuenta. Los próximos inicios de sesión requerirán un código.                   |
| UC-06 | Verificar código 2FA      | Jugador  | El usuario introduce el código de 6 dígitos de su app autenticadora tras el login.                                                                            | Tener 2FA activado e iniciar sesión correctamente (UC-02). | Se emite el token de acceso definitivo.                                                            |

### Gestión de Personajes

| ID    | Caso de Uso        | Actor   | Descripción                                                                                                                                                                            | Precondiciones                    | Postcondiciones                                                               |
| ----- | ------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------- |
| UC-07 | Ver mis personajes | Jugador | El usuario ve la lista de todos sus personajes con nombre, clase y estadísticas.                                                                                                       | Estar autenticado.                | Se muestra la lista de personajes del usuario.                                |
| UC-08 | Crear personaje    | Jugador | El usuario crea un nuevo personaje eligiendo nombre, clase y asignando puntos a las 6 estadísticas (fuerza, destreza, constitución, inteligencia, sabiduría, carisma), HP y velocidad. | Estar autenticado.                | Se crea el personaje y aparece en la lista.                                   |
| UC-09 | Editar personaje   | Jugador | El usuario modifica los datos de un personaje existente.                                                                                                                               | Ser el propietario del personaje. | Se actualizan los datos del personaje.                                        |
| UC-10 | Eliminar personaje | Jugador | El usuario elimina permanentemente un personaje.                                                                                                                                       | Ser el propietario del personaje. | Se elimina el personaje y se retira de cualquier tablero en el que participe. |

### Gestión de Tableros

| ID    | Caso de Uso             | Actor   | Descripción                                                                                                                      | Precondiciones                                                                                       | Postcondiciones                                         |
| ----- | ----------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| UC-11 | Ver mis tableros        | Jugador | El usuario ve la lista de tableros donde es DM o tiene un personaje participando.                                                | Estar autenticado.                                                                                   | Se muestra la lista de tableros.                        |
| UC-12 | Crear tablero (como DM) | Jugador | El usuario crea un nuevo tablero eligiendo nombre y mapa de fondo. Se genera automáticamente un código de unión de 6 caracteres. | Estar autenticado.                                                                                   | Se crea el tablero y el usuario es asignado como DM.    |
| UC-13 | Editar tablero          | Jugador | El DM modifica el nombre, mapa de fondo, tamaño del grid u orden de iniciativa.                                                  | Ser el DM del tablero.                                                                               | Se actualizan los datos del tablero.                    |
| UC-14 | Eliminar tablero        | Jugador | El DM elimina permanentemente un tablero y todos sus datos de partida.                                                           | Ser el DM del tablero o ser administrador.                                                           | Se elimina el tablero.                                  |
| UC-15 | Unirse a tablero        | Jugador | El usuario introduce un código de 6 caracteres y selecciona un personaje para unirse al tablero de otro DM.                      | Tener al menos un personaje. El código debe ser válido. El personaje no debe estar ya en el tablero. | El personaje se añade al tablero en la posición (0, 0). |

### Juego en Tablero

| ID    | Caso de Uso                    | Actor   | Descripción                                                                                                                                     | Precondiciones                                                                                                                                     | Postcondiciones                                                 |
| ----- | ------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| UC-16 | Ver tablero de juego           | Jugador | El usuario accede al tablero y ve el grid con los personajes colocados, el panel de iniciativa y la ficha del personaje seleccionado.           | Estar en el tablero como DM o jugador.                                                                                                             | Se muestra el tablero con zoom/pan interactivo.                 |
| UC-17 | Mover personaje en el grid     | Jugador | El usuario mueve su personaje a una casilla alcanzable (dentro del rango de velocidad) durante su turno. El DM puede mover cualquier personaje. | Ser el propietario del personaje (o DM). Ser el turno del personaje en la iniciativa. La casilla destino debe estar dentro del rango de velocidad. | Se actualiza la posición del personaje en el tablero.           |
| UC-18 | Avanzar turno de iniciativa    | Jugador | El DM avanza al siguiente turno en el orden de iniciativa.                                                                                      | Ser el DM del tablero. Tener un orden de iniciativa definido.                                                                                      | Se actualiza el índice del turno actual.                        |
| UC-19 | Expulsar personaje del tablero | Jugador | El DM, el administrador o el propietario del personaje retira un personaje del tablero.                                                         | Tener permisos sobre el personaje o el tablero.                                                                                                    | Se elimina la relación del personaje con el tablero.            |
| UC-20 | Configurar grid                | Jugador | El DM configura el número de filas y columnas del grid del tablero.                                                                             | Ser el DM del tablero.                                                                                                                             | Se actualiza el tamaño del grid (entre 5 y 100 filas/columnas). |
| UC-21 | Tirar dados                    | Jugador | El usuario utiliza el tirador de dados integrado para generar resultados aleatorios durante la partida.                                         | Estar en un tablero.                                                                                                                               | Se muestra el resultado de la tirada.                           |

### Panel de Administración

| ID    | Caso de Uso              | Actor         | Descripción                                                                                                | Precondiciones                                                | Postcondiciones                                              |
| ----- | ------------------------ | ------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| UC-22 | Ver estadísticas         | Administrador | El administrador ve el total de usuarios, tableros y un gráfico de tableros creados en los últimos 7 días. | Tener rol `admin`.                                            | Se muestran las estadísticas.                                |
| UC-23 | Listar usuarios          | Administrador | El administrador ve la lista paginada de todos los usuarios con su email, nombre y rol.                    | Tener rol `admin`.                                            | Se muestra la lista de usuarios.                             |
| UC-24 | Eliminar usuario         | Administrador | El administrador elimina un usuario y todos sus datos asociados.                                           | Tener rol `admin`. No se puede eliminar a otro administrador. | Se elimina el usuario, sus personajes y tableros en cascada. |
| UC-25 | Listar tableros          | Administrador | El administrador ve la lista paginada de todos los tableros con su DM, jugadores y fecha de creación.      | Tener rol `admin`.                                            | Se muestra la lista de tableros.                             |
| UC-26 | Eliminar tablero (admin) | Administrador | El administrador elimina cualquier tablero del sistema.                                                    | Tener rol `admin`.                                            | Se elimina el tablero.                                       |

### Perfil

| ID    | Caso de Uso | Actor   | Descripción                                                                                  | Precondiciones     | Postcondiciones                   |
| ----- | ----------- | ------- | -------------------------------------------------------------------------------------------- | ------------------ | --------------------------------- |
| UC-27 | Ver perfil  | Jugador | El usuario ve sus datos personales (nombre, email, rol) y el estado de la autenticación 2FA. | Estar autenticado. | Se muestran los datos del perfil. |
