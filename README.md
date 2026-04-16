# ✅ Mis Tareas

Una aplicación web moderna para gestionar tareas diarias, construida con Angular 21 y Tailwind CSS. Diseñada con una interfaz limpia, responsiva y con soporte para modo oscuro.

---

## 📋 Índice

- [Descripción](#descripción)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Arquitectura](#arquitectura)
- [Servicios](#servicios)
- [Componentes](#componentes)
- [Persistencia de Datos](#persistencia-de-datos)

---

## Descripción

**Mis Tareas** es una SPA (Single Page Application) que permite al usuario crear, organizar y hacer seguimiento de sus tareas diarias. Cuenta con sistema de categorías/prioridades, filtros, modo oscuro y persistencia automática en `localStorage`.

---

## Funcionalidades

| Funcionalidad | Descripción |
|---|---|
| ➕ **Crear tareas** | Agrega nuevas tareas con texto y categoría de prioridad |
| ✏️ **Editar tareas** | Modifica el texto y categoría de una tarea existente |
| 🗑️ **Eliminar tareas** | Elimina tareas con confirmación inline para evitar borrados accidentales |
| ✅ **Completar tareas** | Marca tareas como completadas o las reactiva, registrando la fecha y hora |
| 🔍 **Filtrar por estado** | Filtra tareas por: Todas / Pendientes / Completadas |
| 🏷️ **Filtrar por prioridad** | Filtra tareas por categoría: Prioritario, Urgente, Importante, Normal, Otro |
| 📅 **Fechas de creación y completado** | Cada tarea registra cuándo fue creada y cuándo fue completada |
| 💾 **Persistencia en localStorage** | Todos los datos (tareas, perfil, ajustes, tema) se guardan automáticamente |
| 🌙 **Modo oscuro** | Alterna entre tema claro y oscuro, respetando la preferencia del sistema |
| 📱 **Diseño responsive** | Funciona correctamente en móvil, tablet y escritorio |
| ⚙️ **Ajustes de perfil** | Configura nombre, apellidos y foto de perfil |
| 🤖 **Borrado automático** | Opción para eliminar tareas al marcarlas como completadas (con confirmación) |

---

## Tecnologías

- **[Angular 21](https://angular.dev/)** — Framework principal con SSR (Server-Side Rendering)
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Estilos y diseño responsivo
- **[TypeScript 5.9](https://www.typescriptlang.org/)** — Tipado estático
- **[RxJS 7.8](https://rxjs.dev/)** — Programación reactiva
- **[Angular Signals](https://angular.dev/guide/signals)** — Gestión de estado reactivo
- **Google Fonts** — Tipografías: Inter y Public Sans
- **Material Symbols** — Iconografía

---

## Estructura del Proyecto

```
mis-tareas/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   ├── task.service.ts        # Gestión de tareas (CRUD, filtros, persistencia)
│   │   │   ├── profile.service.ts     # Gestión del perfil de usuario
│   │   │   └── theme.service.ts       # Gestión del tema claro/oscuro
│   │   ├── tasks.component.ts         # Vista principal de tareas
│   │   ├── settings.component.ts      # Vista de ajustes y perfil
│   │   ├── app.ts                     # Componente raíz (navbar, layout)
│   │   ├── app.routes.ts              # Definición de rutas
│   │   └── app.config.ts              # Configuración de la aplicación
│   ├── styles.css                     # Estilos globales y tokens de diseño
│   └── main.ts                        # Punto de entrada
├── AGENTS.md                          # Especificaciones del proyecto para el agente
├── angular.json                       # Configuración de Angular CLI
├── package.json                       # Dependencias y scripts
└── tsconfig.json                      # Configuración de TypeScript
```

---

## Instalación y Ejecución

### Prerrequisitos

- **Node.js** v20.19.0 o superior (recomendado: v22 LTS)
- **npm** v9 o superior

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd mis-tareas

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm start
# La app estará disponible en http://localhost:4200
```

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo en el puerto 4200 |
| `npm run build` | Compila la aplicación para producción |
| `npm run watch` | Compila en modo observación (desarrollo) |
| `npm test` | Ejecuta los tests unitarios |
| `npm run lint` | Analiza el código con ESLint |

---

## Arquitectura

La aplicación sigue una arquitectura de componentes con servicios inyectados, usando **Angular Signals** para la reactividad en lugar de observables tradicionales:

```
App (layout + navbar)
├── TasksComponent      → ruta "/"
│   └── TaskService     → CRUD, filtros, estado
└── SettingsComponent   → ruta "/settings"
    ├── ProfileService  → Datos del perfil
    └── TaskService     → Preferencias (auto-delete)
```

**Patrón de datos:**
- Los servicios exponen `signal<T>` como fuentes de verdad.
- Los componentes consumen las señales directamente en la plantilla.
- Los `computed()` derivan valores sin lógica duplicada.
- Los `effect()` sincronizan el estado con `localStorage` automáticamente.

---

## Servicios

### `TaskService`

Gestiona el ciclo de vida completo de las tareas.

| Propiedad / Método | Tipo | Descripción |
|---|---|---|
| `tasks` | `Signal<Task[]>` | Lista completa de tareas |
| `filter` | `Signal<'all' \| 'pending' \| 'completed'>` | Filtro de estado activo |
| `categoryFilter` | `Signal<TaskCategory \| 'all'>` | Filtro de categoría activo |
| `autoDeleteCompleted` | `Signal<boolean>` | Si las tareas se borran al completarse |
| `filteredTasks` | `Computed<Task[]>` | Tareas filtradas y ordenadas por prioridad |
| `pendingCount` | `Computed<number>` | Número de tareas pendientes |
| `completedCount` | `Computed<number>` | Número de tareas completadas |
| `addTask(text, category)` | `void` | Crea una nueva tarea |
| `toggleTask(id)` | `void` | Alterna el estado completado de una tarea |
| `deleteTask(id)` | `void` | Elimina una tarea permanentemente |
| `updateTask(id, text, category)` | `void` | Actualiza el texto y categoría de una tarea |
| `setFilter(filter)` | `void` | Cambia el filtro de estado |
| `setCategoryFilter(filter)` | `void` | Cambia el filtro de categoría |
| `setAutoDeleteCompleted(value)` | `void` | Activa/desactiva el borrado automático |

**Ordenamiento de tareas:** Las tareas se ordenan automáticamente por: 1) pendientes antes que completadas, 2) prioridad (Prioritario > Urgente > Importante > Normal > Otro), 3) fecha de creación ascendente.

**Clave de localStorage:** `mis-tareas-tasks`, `mis-tareas-autodelete`

---

### `ProfileService`

Gestiona el perfil del usuario.

| Propiedad / Método | Tipo | Descripción |
|---|---|---|
| `profile` | `Signal<UserProfile>` | Datos del perfil (nombre, apellidos, avatar) |
| `updateProfile(profile)` | `void` | Actualiza y persiste el perfil |

**Clave de localStorage:** `mis-tareas-profile`

---

### `ThemeService`

Gestiona el tema visual de la aplicación.

| Propiedad / Método | Tipo | Descripción |
|---|---|---|
| `isDark` | `Signal<boolean>` | Si el modo oscuro está activo |
| `toggle()` | `void` | Alterna entre modo claro y oscuro |

Al inicializarse detecta la preferencia del sistema (`prefers-color-scheme`), y luego respeta la elección guardada del usuario.

**Clave de localStorage:** `theme`

---

## Componentes

### `TasksComponent` — `/`

Vista principal de la aplicación. Permite crear, visualizar, filtrar, editar y eliminar tareas.

**Características:**
- Formulario reactivo para agregar tareas con validación.
- Filtros de estado (Todas / Pendientes / Completadas) — se ocultan cuando el borrado automático está activo.
- Filtro de prioridad siempre visible.
- Confirmación inline para eliminar (sin modal, directamente en el ítem).
- Modal de edición para modificar texto y categoría.
- Etiquetas de color por categoría en cada tarea.

---

### `SettingsComponent` — `/settings`

Vista de configuración del perfil y preferencias de la app.

**Características:**
- Formulario reactivo con validación para nombre, apellidos y URL de avatar.
- Previsualización en tiempo real del avatar.
- Validación automática de la imagen al cambiar la URL (con debounce).
- Toggle de borrado automático con modal de confirmación y descripción del impacto.
- Protección de navegación: avisa si hay cambios sin guardar al intentar salir.
- Feedback visual de guardado (mensaje de éxito/error con auto-cierre a los 5 segundos).

---

## Persistencia de Datos

Todos los datos se guardan automáticamente en `localStorage` del navegador sin necesidad de ninguna acción explícita del usuario (excepto para el perfil, que requiere pulsar "Guardar Cambios").

| Clave | Contenido |
|---|---|
| `mis-tareas-tasks` | Array JSON de todas las tareas |
| `mis-tareas-autodelete` | `"true"` / `"false"` |
| `mis-tareas-profile` | Objeto JSON con nombre, apellidos y avatarUrl |
| `theme` | `"dark"` / `"light"` |

> **Nota:** Los datos son locales al navegador. No se sincronizan con ningún servidor.
