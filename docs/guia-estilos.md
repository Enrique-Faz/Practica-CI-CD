# Guía de Estilos — D&D Board

Documento de referencia visual del proyecto. Define la paleta de colores, tipografía, componentes UI y patrones de interacción utilizados en toda la aplicación.

---

## 1. Paleta de Colores

La aplicación sigue una estética **dark fantasy** inspirada en D&D, usando la escala **Stone** de Tailwind como base y **Amber** como color de acento dorado.

### Colores base (fondo y texto)

| Uso                             | Color         | Tailwind    | Hex       |
| ------------------------------- | ------------- | ----------- | --------- |
| Fondo principal                 | Negro cálido  | `stone-950` | `#1c1917` |
| Fondo de tarjetas/paneles       | Gris oscuro   | `stone-900` | `#292520` |
| Bordes y divisores              | Gris medio    | `stone-700` | `#44403c` |
| Texto principal                 | Blanco cálido | `stone-100` | `#f5f5f4` |
| Texto secundario                | Gris claro    | `stone-400` | `#a8a29e` |
| Texto deshabilitado/placeholder | Gris          | `stone-600` | `#78716f` |

### Colores de acento

| Uso                          | Color            | Tailwind    | Hex       |
| ---------------------------- | ---------------- | ----------- | --------- |
| Botones principales (CTA)    | Ámbar oscuro     | `amber-600` | `#d97706` |
| Hover de botones             | Ámbar medio      | `amber-500` | `#f59e0b` |
| Encabezados, iconos, énfasis | Ámbar claro      | `amber-400` | `#fbbf24` |
| Bordes sutiles dorados       | Ámbar muy oscuro | `amber-900` | `#92400e` |

### Colores de estado

| Uso                      | Color       | Tailwind      | Hex       |
| ------------------------ | ----------- | ------------- | --------- |
| Error / Eliminar (fondo) | Rojo oscuro | `red-900`     | `#991b1b` |
| Error / Eliminar (texto) | Rojo claro  | `red-400`     | `#f87171` |
| Activo / Éxito           | Esmeralda   | `emerald-400` | `#047857` |

### Opacidad

Los colores se combinan frecuentemente con modificadores de opacidad de Tailwind para crear capas de profundidad visual:

- `/10` – `/30`: Fondos muy sutiles, bordes suaves
- `/40` – `/60`: Tarjetas semi-transparentes, overlays medios
- `/70` – `/90`: Modales, backdrops, paneles opacos

Ejemplo típico de tarjeta: `bg-stone-900/60 border border-amber-900/30`

---

## 2. Tipografía

Se utilizan las fuentes del sistema (system font stack) sin cargar fuentes externas, delegando al navegador la selección (Segoe UI, Roboto, Arial, etc.).

### Escala tipográfica

| Uso                           | Tamaño                | Peso                | Extras                       |
| ----------------------------- | --------------------- | ------------------- | ---------------------------- |
| Títulos de página             | `text-4xl` (2.25rem)  | `font-black` (900)  | `uppercase tracking-tighter` |
| Títulos de modal              | `text-3xl` (1.875rem) | `font-black` (900)  | `tracking-wider`             |
| Títulos de sección            | `text-2xl` (1.5rem)   | `font-black` (900)  | `uppercase`                  |
| Títulos de tarjeta            | `text-xl` (1.25rem)   | `font-black` (900)  | `tracking-wide`              |
| Texto de cuerpo               | `text-sm` (0.875rem)  | `font-medium` (500) | —                            |
| Etiquetas de formulario       | `text-xs` (0.75rem)   | `font-bold` (700)   | `uppercase tracking-wider`   |
| Botones                       | `text-sm` (0.875rem)  | `font-bold` (700)   | `uppercase tracking-wide`    |
| Micro texto (badges, errores) | `text-[10px]`         | `font-black` (900)  | `uppercase tracking-widest`  |
| Códigos (2FA)                 | `text-2xl` (1.5rem)   | `font-mono`         | `tracking-widest`            |

### Convenciones tipográficas

- Casi todos los elementos de interfaz (botones, etiquetas, badges) usan **`uppercase`** con algún nivel de `tracking`.
- El énfasis se marca con `italic font-black text-amber-400`.
- Los estados de carga usan `animate-pulse` sobre el texto.

---

## 3. Componentes UI

### 3.1 Tarjetas (Cards)

Componente base para agrupar contenido. Fondo semi-transparente con borde dorado sutil.

```
bg-stone-900/60
border border-amber-900/30
rounded-2xl
px-6 py-4
shadow-lg
```

Variante interactiva: añade `hover:border-amber-600/50 transition-all`.

### 3.2 Botones

**Primario (Amber CTA)**

```
px-6 py-2.5
bg-amber-600 hover:bg-amber-500
text-stone-900 text-sm font-bold
rounded-xl shadow-lg shadow-amber-900/30
hover:-translate-y-0.5 transition-all tracking-wide
```

**Secundario (Stone)**

```
px-4 py-3
bg-stone-800 border border-stone-700
text-stone-300 hover:bg-stone-700
font-bold rounded-lg uppercase tracking-widest text-xs
```

**Peligro (Red)**

```
px-4 py-3
bg-red-900/30 hover:bg-red-900/50
text-red-400 text-sm font-bold
rounded-lg uppercase tracking-wide
```

**Sutil (Amber translúcido)**

```
px-4 py-3
bg-amber-700/30 hover:bg-amber-700/50
text-amber-400 text-sm font-bold
rounded-lg uppercase tracking-wide
```

### 3.3 Inputs de formulario

```
w-full px-4 py-3
bg-stone-800/50
border border-amber-900/30
rounded-lg
text-stone-200 placeholder-stone-600
focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50
disabled:opacity-50 disabled:cursor-not-allowed
transition-all
```

Etiqueta: `text-xs font-bold uppercase text-stone-300 tracking-wider ml-1`
Error: `text-[10px] text-red-400 font-bold uppercase tracking-tighter ml-1`

### 3.4 Modales / Popups

Overlay a pantalla completa con efecto glassmorphism:

```
/* Backdrop */
fixed inset-0 z-[100]
flex items-center justify-center p-4
bg-stone-950/70 backdrop-blur-md

/* Contenedor del modal */
w-full max-w-md
bg-stone-900 border border-amber-900/40
rounded-2xl p-8
shadow-2xl shadow-black/50
```

Modales con formularios largos: `max-h-[90vh] overflow-y-auto`.

### 3.5 Tablas

Envueltas en una tarjeta con bordes redondeados y `overflow-hidden`.

- Cabecera: `text-xs font-black uppercase tracking-widest text-stone-500`
- Filas: `border-b border-stone-800/50 hover:bg-stone-800/30 transition-colors`
- Celdas: `p-4 text-stone-400 text-sm` (datos) / `font-bold text-stone-200` (datos destacados)

### 3.6 Badges / Pills

```
px-2 py-0.5
bg-red-900/30 border border-red-700/40
rounded
text-red-400 text-xs font-bold
```

Los colores del badge cambian según el rol/estado (red para admin, amber para DM, etc.).

### 3.7 Navegación (Header)

```
sticky top-0 z-50
bg-stone-900/95 backdrop-blur-md
border-b border-amber-900/50
shadow-lg shadow-black/30
```

Links activos con indicador animado:

- Texto: `text-stone-400 → text-amber-400` al activarse
- Subrayado: barra de `h-0.5 bg-amber-400` que anima de `w-0` a `w-full`

---

## 4. Animaciones y Transiciones

### Transiciones Tailwind

| Clase                  | Uso                            |
| ---------------------- | ------------------------------ |
| `transition-all`       | Cambios generales de estado    |
| `transition-colors`    | Solo cambios de color (hover)  |
| `transition-transform` | Escala, translate              |
| `duration-300`         | Duración estándar (300ms)      |
| `duration-[3000ms]`    | Zoom lento de imágenes en hero |

### Efectos de hover

- **Elevación**: `hover:-translate-y-0.5` en botones
- **Escala de imagen**: `group-hover:scale-105` en heros
- **Cambio de fondo**: `hover:bg-stone-700`
- **Feedback táctil**: `active:scale-95` al hacer click

### Animaciones personalizadas

- **`animate-fade-in-up`**: Aparición con desplazamiento vertical (0.8s, easing personalizado). Usada en el dashboard con `animation-delay` escalonado.
- **`animate-fade-in`**: Aparición simple (0.6s).
- **`animate-pulse`**: Indicador de turno activo y estados de carga.

---

## 5. Iconografía

Se usa **Font Awesome** (`@fortawesome/angular-fontawesome`) con iconos del pack gratuito.

Iconos principales: `faDiceD20` (logo/dado), `faUsers`, `faChessBoard`, `faPlay`, `faForwardStep`, `faChevronLeft/Right`, `faTrash`, `faShield`, `faXmark`.

---

## 6. Imágenes y Assets

Ubicados en `public/`:

| Directorio    | Contenido                                       |
| ------------- | ----------------------------------------------- |
| `logo.png`    | Logo de la aplicación (header, footer, modales) |
| `background/` | Imágenes hero (boards.jpg, characters.avif)     |
| `mapas/`      | Fondos de tablero de juego (1280×960)           |
| `Clases/`     | Imágenes de las clases de personaje             |

---

## 7. Responsive Design

La aplicación sigue un enfoque **mobile-first** con un único breakpoint principal:

- **Base** (< 768px): Layouts en columna, navegación oculta
- **`md:` (≥ 768px)**: Layouts en fila, navegación visible, grids de 2-3 columnas

Patrones responsive comunes:

- `hidden md:flex` — ocultar en móvil, mostrar en desktop
- `flex flex-col md:flex-row` — apilar en móvil, horizontal en desktop
- `grid grid-cols-1 md:grid-cols-2` — grid adaptativo
- `text-4xl md:text-6xl` — tamaño de fuente responsivo
