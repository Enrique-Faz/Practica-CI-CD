# Patrones de Diseño Web — D&D Board

Documento que describe los patrones de diseño web utilizados en la aplicación, con justificación de cada elección y ejemplos de dónde se aplican.

---

## 1. Dark Mode Nativo

**Descripción**: Toda la interfaz utiliza un esquema de colores oscuro por defecto, sin opción de cambio a modo claro.

**Justificación**: La temática de D&D/fantasía se asocia con ambientes oscuros y épicos (mazmorras, noches de campaña). Un fondo oscuro reduce la fatiga visual durante sesiones largas de juego y permite que los acentos dorados (amber) destaquen como elementos de acción.

**Implementación**: Fondo `stone-950` como base, tarjetas en `stone-900/60`, texto en `stone-100/400`.

---

## 2. Glassmorphism

**Descripción**: Efecto de "cristal esmerilado" que combina fondos semi-transparentes con desenfoque (blur), creando capas de profundidad visual.

**Justificación**: Aporta una estética moderna y elegante sin perder la coherencia con el tema oscuro. Permite que el contenido se superponga visualmente sin ocultar completamente el contexto.

**Dónde se aplica**:

- **Header**: `bg-stone-900/95 backdrop-blur-md` — navegación siempre visible con transparencia
- **Modales**: `bg-stone-950/70 backdrop-blur-md` — overlay que permite intuir el fondo
- **Sidebar del tablero**: `bg-stone-900/80 backdrop-blur-sm` — panel lateral que no bloquea completamente la vista del mapa

---

## 3. Card-Based Layout

**Descripción**: El contenido se organiza dentro de tarjetas (cards) con bordes sutiles, esquinas redondeadas y sombras.

**Justificación**: Las tarjetas crean una jerarquía visual clara, agrupan información relacionada y son naturalmente responsive (se apilan verticalmente en móvil).

**Dónde se aplica**:

- **Tarjetas de personaje**: ficha horizontal con imagen + estadísticas
- **Tarjetas de tablero**: vista previa con imagen de fondo + información del tablero
- **Tarjetas de estadísticas (admin)**: icono + dato numérico destacado
- **Formularios**: envueltos en contenedores tipo tarjeta dentro de modales

**Patrón base**: `bg-stone-900/60 border border-amber-900/30 rounded-2xl px-6 py-4 shadow-lg`

---

## 4. Hero Section (Split Screen)

**Descripción**: El dashboard utiliza una sección hero a pantalla completa dividida en dos mitades verticales, cada una con imagen de fondo, overlay degradado y texto superpuesto.

**Justificación**: Ofrece al usuario dos rutas de navegación principales (tableros y personajes) de forma visual e inmediata, creando un punto de entrada impactante tras el login.

**Dónde se aplica**: Página de dashboard (`dashboard-page`).

**Técnicas**:

- Imágenes con `object-cover` y opacidad reducida (`opacity-40`, `hover:opacity-60`)
- Degradado de abajo hacia arriba: `bg-gradient-to-t from-stone-950 via-transparent to-transparent`
- Zoom sutil al hover: `scale-110 group-hover:scale-105` con `duration-[3000ms]`
- Texto con animación de entrada escalonada (`animation-delay`)

---

## 5. Modal Pattern (Overlay)

**Descripción**: Diálogos que se superponen a la interfaz con un fondo oscuro semi-transparente, centrados en pantalla.

**Justificación**: Permite al usuario realizar acciones (crear, editar, confirmar) sin abandonar el contexto de la página actual. El blur del fondo mantiene la orientación espacial.

**Tipos de modal**:

- **Confirmación**: Texto + dos botones (cancelar/confirmar). Ancho `max-w-sm`.
- **Formulario**: Campos de entrada con validación. Ancho `max-w-md` o `max-w-lg`. Scroll interno con `max-h-[90vh] overflow-y-auto`.
- **2FA**: QR code + campo de código de verificación.

**Dónde se aplica**: Crear/editar personaje, crear/unirse a tablero, eliminar elementos, configurar 2FA.

---

## 6. Sticky Navigation

**Descripción**: La barra de navegación permanece fija en la parte superior de la pantalla al hacer scroll.

**Justificación**: Garantiza acceso constante a la navegación principal sin importar la posición del scroll. El efecto de blur refuerza la sensación de que flota sobre el contenido.

**Implementación**: `sticky top-0 z-50` con `backdrop-blur-md` y `shadow-lg`.

**Indicador activo**: Subrayado animado que crece de `w-0` a `w-full` bajo el link activo, con cambio de color de `stone-400` a `amber-400`.

---

## 7. Responsive Mobile-First

**Descripción**: Los estilos base están diseñados para pantallas pequeñas y se amplían progresivamente para pantallas mayores.

**Justificación**: La mayoría del tráfico web actual proviene de dispositivos móviles. Diseñar primero para móvil asegura una experiencia funcional en todos los dispositivos.

**Breakpoint principal**: `md:` (768px)

- Navegación: oculta en móvil (`hidden`), visible en desktop (`md:flex`)
- Layouts: columna en móvil (`flex-col`), fila en desktop (`md:flex-row`)
- Grids: 1 columna en móvil, 2-3 en desktop (`grid-cols-1 md:grid-cols-2`)

## 8. Off-Canvas Sidebar

**Descripción**: Panel lateral que se desliza desde fuera de la pantalla y se superpone al contenido principal.

**Justificación**: En la vista de tablero de juego, maximiza el espacio del mapa/grid mientras ofrece acceso al panel de iniciativa y fichas de personaje sin cambiar de página.

**Dónde se aplica**: Tablero de juego (`board-page`), panel de iniciativa y ficha de personaje.

**Implementación**: Posición `absolute`, animación con `translate-x-full` ↔ `translate-x-0`, botón toggle que cambia icono según el estado.

---

## 9. Infinite Canvas (Pan & Zoom)

**Descripción**: El tablero de juego funciona como un lienzo infinito que el usuario puede desplazar (pan) y ampliar/reducir (zoom) con gestos de ratón.

**Justificación**: Los mapas de D&D pueden ser de cualquier tamaño. Un canvas con pan y zoom permite a los jugadores explorar el mapa libremente y focalizarse en las zonas relevantes del combate.

**Dónde se aplica**: Grid del tablero de juego (`board-grid`).

**Técnicas**:

- CSS Grid dinámico: `grid-template-columns: repeat(N, 1fr)` donde N viene del backend
- Transform CSS para pan/zoom: `translate(-50%, -50%) translate(Xpx, Ypx) scale(Z)`
- Cursor contextual: `cursor-grab` en reposo, `cursor-grabbing` al arrastrar
- Celdas alcanzables resaltadas: `bg-amber-400/30`

---

## 10. Progressive Disclosure

**Descripción**: La información se revela progresivamente según el contexto y las acciones del usuario, en lugar de mostrar todo de golpe.

**Justificación**: Reduce la carga cognitiva. El usuario ve solo lo relevante en cada momento.

**Dónde se aplica**:

- **Dashboard**: Solo dos opciones grandes (tableros/personajes), no un panel con todo
- **Sidebar del tablero**: Se oculta por defecto, el usuario la abre cuando necesita ver la ficha
- **Formularios**: Errores de validación solo aparecen tras interactuar con el campo (`touched`)
- **Admin**: Separado en dos vistas (estadísticas y gestión), no todo junto
- **Modales**: Acciones de creación/edición aparecen solo cuando el usuario las solicita

---

## 11. Data Tables con acciones inline

**Descripción**: Tablas de datos (admin) con acciones (eliminar) integradas en cada fila.

**Justificación**: El usuario puede actuar directamente sobre un registro sin navegar a otra vista. Las acciones inline son más eficientes para operaciones CRUD masivas.

**Dónde se aplica**: Tabla de usuarios y tabla de tableros en el panel de administración.

**Técnicas**:

- Hover de fila: `hover:bg-stone-800/30` para indicar interactividad
- Botón de acción con confirmación vía modal popup antes de ejecutar
- Badges de rol/estado visual en cada fila

---

## 12. Microinteracciones

**Descripción**: Pequeñas animaciones y cambios visuales que dan feedback inmediato al usuario.

**Justificación**: Hacen que la interfaz se sienta viva y responsive. Cada acción del usuario tiene una respuesta visual que confirma que el sistema ha registrado la interacción.

**Ejemplos**:

- **Elevación de botón al hover**: `hover:-translate-y-0.5` — el botón "sube" ligeramente
- **Feedback al click**: `active:scale-95` — el botón se comprime momentáneamente
- **Indicador de turno pulsante**: `animate-pulse` — punto ámbar que pulsa en el turno actual
- **Transición de colores**: `transition-colors` — cambios suaves de color en hover/focus
- **Zoom de imágenes hero**: `group-hover:scale-105` con transición de 3 segundos

---

## 13. Entrada animada (Staggered Animations)

**Descripción**: Los elementos de una sección aparecen secuencialmente con un delay entre cada uno, creando un efecto de cascada.

**Justificación**: Guía la atención del usuario a través del contenido de forma natural y añade un efecto de "construcción" progresiva de la interfaz.

**Dónde se aplica**: Sección hero del dashboard — cada bloque de texto aparece con un `animation-delay` diferente (200ms, 400ms, 600ms).

**Implementación**: Clase `animate-fade-in-up` combinada con `[animation-delay:400ms]` (valor arbitrario de Tailwind).

---

## 14. Formularios con validación contextual

**Descripción**: Los campos de formulario muestran mensajes de error solo cuando el usuario ha interactuado con ellos y el valor es inválido.

**Justificación**: No se penaliza al usuario con errores antes de que intente rellenar el campo. Mejora la experiencia de onboarding y reduce la frustración.

**Implementación**: Condición `@if (field().invalid() && field().touched())` que muestra el mensaje de error en texto rojo micro (`text-[10px]`) debajo del input afectado.
