## AGENTS

Proyecto: Mis Tareas

Rol / Persona principal del agente: Eres un desarrollador web frontend senior especializado en el stack abajo especificado con más de 12 años de experiencia.

Tecnologías / Stack:
- HTML5
- CSS3
- TypeScript
- Angular 21 (con Signals, SSR, lazy loading de rutas)
- Tailwind CSS 4
- RxJS 7.8
- Angular Reactive Forms

Idioma de la Interfaz: Español

---

## Estado Actual del Proyecto

El proyecto está completamente funcional e implementado. A continuación se describe el estado actual de cada funcionalidad:

### Funcionalidades implementadas

- [x] **Crear tareas** — Formulario reactivo con validación. Incluye selector de categoría/prioridad.
- [x] **Editar tareas** — Modal de edición para modificar texto y categoría.
- [x] **Eliminar tareas** — Confirmación inline en cada ítem (sin modal separado).
- [x] **Marcar tareas como completadas** — Botón circular por tarea. Registra fecha y hora de completado.
- [x] **Filtrar por estado** — Botones: Todas / Pendientes / Completadas. Se ocultan cuando el borrado automático está activo.
- [x] **Filtrar por prioridad** — Selector desplegable siempre visible independientemente de otras opciones.
- [x] **Ordenamiento automático** — Las tareas se ordenan por: estado (pendientes primero), luego prioridad, luego fecha de creación.
- [x] **Categorías de prioridad** — Prioritario / Urgente / Importante / Normal / Otro. Con etiquetas de color por categoría.
- [x] **Fecha y hora de creación y completado** — Guardadas en ISO 8601 y mostradas con formateo local.
- [x] **Persistencia en localStorage** — Tareas, perfil, tema y preferencias se guardan automáticamente.
- [x] **Diseño responsive** — Adaptado para móvil, tablet y escritorio.
- [x] **Feedback visual** — Hovers, focus rings, transiciones, estados activos, animaciones.
- [x] **Modo oscuro** — Toggle en la barra de navegación. Detecta preferencia del sistema. Persiste en localStorage.
- [x] **Perfil de usuario** — Nombre, apellidos y foto de avatar configurables desde Ajustes.
- [x] **Confirmación al salir de Ajustes** — Modal si hay cambios sin guardar.
- [x] **Guardar cambios en Ajustes** — Feedback visual de éxito/error con auto-cierre a los 5 segundos.
- [x] **Borrado automático de tareas completadas** — Toggle en Ajustes con modal de confirmación. Al activarse oculta los filtros de estado en la vista de Tareas.
- [x] **Badge de notificaciones** — Muestra el contador de tareas pendientes en el header.
- [x] **Protección de navegación** — Avisa si se intenta salir de Ajustes con cambios sin guardar.
- [x] **Validación de avatar** — Verifica que la URL de imagen sea válida antes de guardar.

---

## Arquitectura del Proyecto

```
src/app/
├── services/
│   ├── task.service.ts        # Gestión de tareas (estado global con Signals)
│   ├── profile.service.ts     # Perfil del usuario
│   └── theme.service.ts       # Tema claro/oscuro
├── tasks.component.ts         # Vista "/" (lista de tareas)
├── settings.component.ts      # Vista "/settings" (perfil y preferencias)
├── app.ts                     # Layout raíz (navbar, footer, router-outlet)
├── app.routes.ts              # Rutas con lazy loading y canDeactivate guard
└── app.config.ts              # Configuración Angular
```

### Claves de localStorage

| Clave | Contenido |
|---|---|
| `mis-tareas-tasks` | Array JSON de tareas |
| `mis-tareas-autodelete` | `"true"` / `"false"` |
| `mis-tareas-profile` | Objeto JSON con firstName, lastName, avatarUrl |
| `theme` | `"dark"` / `"light"` |

---

## Convenciones y Normas del Proyecto

- Usar **Angular Signals** (`signal`, `computed`, `effect`) para la gestión de estado. No usar BehaviorSubject ni Subject para estado local.
- Usar **`ChangeDetectionStrategy.OnPush`** en todos los componentes.
- Usar **Reactive Forms** para formularios con validación.
- **No crear módulos** — usar componentes standalone.
- Rutas con **lazy loading** (`loadComponent`).
- Los templates van **inline** en el decorador `@Component` (no archivos `.html` separados).
- Los estilos globales y tokens de diseño van en `src/styles.css`.
- Usar **clases de Tailwind** directamente en los templates; evitar CSS ad-hoc.
- El idioma de toda la UI es **español**.
- Confirmar acciones destructivas (eliminar, borrado automático) antes de ejecutarlas.

---

## Notas Finales

- Prioriza simplicidad y mantenibilidad del código.
- Antes de implementar una nueva funcionalidad, verificar si ya existe un patrón similar en el proyecto.
- No dudes en preguntar si algo no es claro.