# Registro de Trabajo (WORKLOG.md)

Este documento mantiene un registro cronológico de las sesiones de trabajo, tareas en curso, decisiones importantes y tareas pendientes. Esto asegura que el contexto no se pierda entre sesiones.


## Sesión: 2026-05-02 (Code Review & Fixes de Course Progress)

**Qué implementamos en esta sesión:**
- Ejecución de `/review-code` enfocado en los cambios recientes de la migración de `Course Progress` a la base de datos.
- Resolución de bug de estado en el backend (`enrollment.service.ts`): Se arregló la regresión donde la reducción de progreso en un curso previamente completado no revertía el estado a `IN_PROGRESS`.
- Simplificación del hook `use-course-progress.ts` eliminando cálculos de porcentaje redundantes en frontend, dependiendo directamente de la propiedad `progress` real devuelta por el backend.
- Optimización de red removiendo dobles invalidaciones de caché en TanStack Query.
- Mejora de UX y estabilidad en `course-detail.tsx`: Se implementó la guarda `isEnrolled` para evitar errores silenciosos en la UI y prevenir mutaciones huérfanas.
- Limpieza general de tipos e imports no utilizados que generaban errores de linter.
- Estabilización del servidor dev Vite en local instalando dependencias faltantes (`@hello-pangea/dnd`).

**Qué quedó en progreso:**
- Completar la visualización e interacción del `SimulationEngine.tsx` que corresponde a la Tarea SS101 de la Fase 3.

**Bloqueos:**
- Ninguno técnico crítico (sigue pendiente el parche de tipos en la rama de simulaciones).

**Próximos pasos en orden de prioridad:**
1. Mergear la branch externa que arregla los tipos de `Simulation` para restablecer el entorno de desarrollo.
2. Desarrollar el `SimulationEngine.tsx` en el frontend, incorporando hotspots clicables y tracking de eventos.
3. Iniciar la integración end-to-end con el motor de scoring conductual en el backend.

---

## Sesión: 2026-05-01 (Migración de Course Progress a Base de Datos)

**Qué implementamos en esta sesión:**
- Modificación del `schema.prisma` agregando el modelo `CompletedModule` para almacenar el progreso de cursos a nivel base de datos en lugar de `localStorage`.
- Implementación de los endpoints `GET /api/enrollments/:profileId/:courseId` y `PATCH /api/enrollments/:profileId/:courseId/complete-module`.
- Creación de la lógica en `enrollment.service.ts` para recalcular dinámicamente el progreso global de la inscripción (`CourseEnrollment.progress`) basado en el conteo total de módulos del curso frente a los completados.
- Refactorización de `useCourseProgress` en el frontend utilizando `@tanstack/react-query` (`useQuery` y `useMutation`), asegurando que la UI se actualice optimísticamente y revalide la caché sin necesidad de recargar la página.

**Qué quedó en progreso:**
- Completar la visualización e interacción del `SimulationEngine.tsx` que corresponde a la Tarea SS101 de la Fase 3.

**Bloqueos:**
- Ninguno relacionado a la tarea actual. (Existe un error de compilación por resolver externamente en la rama de Simulaciones por parte de otro desarrollador).

**Próximos pasos en orden de prioridad:**
1. Mergear la branch externa que arregla los tipos de `Simulation` para restablecer el entorno de desarrollo.
2. Desarrollar el `SimulationEngine.tsx` en el frontend, incorporando hotspots clicables y tracking de eventos.
3. Iniciar la integración end-to-end con el motor de scoring conductual en el backend.

---

## Sesión: 2026-04-26 (Course Detail Page UI & Bugfixes)

**Qué implementamos en esta sesión:**
- Desarrollo de la vista `CourseDetail` (`frontend/src/routes/course-detail.tsx`) para mostrar información de cursos, progreso dinámico, duración y cumplimiento normativo.
- Integración de `Navbar` y alertas visuales (ej. componente `Award`) para felicitar al usuario al llegar al 100% de progreso.
- Implementación de lógica local vía `localStorage` con el hook `use-course-progress.ts` para persistir la finalización de módulos.
- Manejo de estados vacíos en el acordeón de módulos ("Este curso aún no tiene módulos registrados").
- Corrección de enrutamiento: Se envolvió el botón de "Iniciar Curso" de `CourseCard` (`course-card.tsx`) en un `<Link>` directo hacia `/course/$courseId` para asegurar la redirección desde el dashboard.


**Qué quedó en progreso:**
- La integración completa de la simulación SS101 en el nuevo módulo de cursos detallados.

**Bloqueos:**
- Vite colapsó debido a advertencias estrictas del plugin de auto-enrutamiento de TanStack. 

**Próximos pasos en orden de prioridad:**
1. Iniciar la Task SS101: Desarrollar el componente interactivo `SimulationEngine.tsx` y los "hotspots".
2. Modificar el Schema de Prisma para soportar configuraciones JSON requeridas en la simulación.
3. Terminar la capa de servicios (`scoring.service.ts`) para el Risk Score conductual en el backend.
## Sesión: 2026-05-01 — Code Review, Refactorización de `generated-preview` y Fix de UX

**Qué implementamos en esta sesión:**

- **`/review-code` con mentalidad senior (basado en CLAUDE.md):** Revisión completa del pipeline admin (5 ejes: bugs, cumplimiento, over-engineering, manejo de errores, riesgos en producción). Se identificaron 3 bugs críticos, 4 violaciones de convenciones y 3 riesgos de producción.

- **Fix #1 — Stale closure en `handleSave` (`use-module-editor.ts`):**
  - `onSave({ ...draft, contents: finalContents })` leía el `draft` de la closure capturada al inicio del `async`, que podía estar desactualizado tras el `await Promise.all`.
  - Solución: `const saved = { ...draft, contents: finalContents }; setDraft(saved); onSave(saved);` — un solo objeto compartido.

- **Fix #2 — `console.log` eliminado del flujo de publicación (`generated-preview.tsx`).**

- **Fix #3 — `alert()` reemplazado por banners UX + validación de payload:**
  - `onSuccess` y `onError` usaban `alert()` bloqueante y sin estilo del proyecto.
  - Reemplazados por `publishError` y `publishSuccess` en el hook, con banners integrados en `PreviewActions`.
  - Validación añadida: si el curso no tiene módulos, se muestra error sin enviar el POST.

- **Refactorización de `generated-preview.tsx` (248 → ~120 líneas):**
  - El archivo mezclaba tipos, funciones puras, lógica de estado y JSX.
  - Extraído en 6 archivos con responsabilidad única:
    - `types/course.types.ts` — `Scenario`, `GeneratedContent`, `CourseCreateDTO`
    - `utils/course.utils.ts` — `toEditableModule()`, `buildPayload()`, `MAX_FILE_SIZE`
    - `hooks/use-generated-preview.ts` — toda la lógica de estado y handlers
    - `preview-scenarios.tsx` — sección de escenarios de simulación
    - `preview-actions.tsx` — botones + banner de error/éxito
    - `generated-preview.tsx` — orquestador delgado (~120 líneas)

- **Fix de doble `toEditableModule`:** El mismo módulo se convertía dos veces (L90 + L155 del archivo original), generando UUIDs distintos en cada llamada. Se normalizan los módulos una sola vez en el hook y se reutilizan en todos los handlers.

- **Fix de tipo `any` en `courseApi.ts`:** `createCourse(data: any)` tipado a `createCourse(data: CourseCreateDTO)`.

- **Fix de banner de éxito de publicación (`/fix-bug`):**
  - Al publicar con éxito, `setGeneratedContent?.(undefined)` desmontaba el componente antes de que el banner pudiera renderizarse.
  - Solución: `publishSuccess` state en el hook. `onSuccess` activa el flag en vez de limpiar inmediatamente. El usuario ve el banner verde "¡Curso publicado exitosamente!" y al cerrarlo **entonces** se limpia el contenido.

**Qué quedó en progreso:**
- `window.confirm` para eliminar módulos y descartar contenido (pendiente reemplazar con `ConfirmDialog` de shadcn).
- Archivos subidos a Supabase quedan huérfanos si el admin descarta el curso (sin cleanup).
- `ModuleContentItem` sigue sobre el límite de 200 líneas (246); el bloque `FileDropZone` puede extraerse si crece más.

**Bloqueos:**
- Ninguno. El TypeScript check (`npx tsc --noEmit`) pasa sin errores tras todos los cambios.

**Próximos pasos en orden de prioridad:**
1. Reemplazar `window.confirm` con un `<ConfirmDialog>` reutilizable (shadcn Dialog).
2. Implementar limpieza de archivos huérfanos en Supabase al descartar un curso.
3. Retomar la Task **Simulación SS101** (schema Prisma → scoring service → SimulationEngine frontend).

---
## Sesión: 2026-04-25 — Finalización de Publicación de Cursos y Editor de Módulos

**Qué implementamos en esta sesión:**
- **Gestión manual de Módulos:** Funcionalidad de agregar y eliminar módulos generados por IA en `generated-preview.tsx` con alertas de confirmación.
- **Uploads a Supabase optimizados:** En `use-module-upload.ts`, aplanamos la ruta de subida (`timestamp-nombre.ext`) para evitar subdirectorios complejos y se inyectó `contentType: file.type` para soportar videos y lectura inline de PDFs.
- **Integración API de Publicación:** Conexión del botón "Publicar Curso". Creación de `buildPayload` para mapear el estado local (`EditableModule`) al `CourseCreateDTO` del backend (manteniendo los índices/order).
- **Límite y validación de archivos:** Implementación de un límite estricto de 50MB en el `use-module-editor.ts`, con manejo parcial de errores para indicar explícitamente cuando fallan los archivos pesados.
- **Limpieza de Deuda Técnica (Backend/DB):** Alineación del `CourseCreateDTO` y `course.service.ts` con el `schema.prisma` real (que descartó `content` de las simulaciones y usa JSON). Se solventaron todos los errores de tipado de TypeScript.
- **Fix de Encodings:** Corrección de textos corruptos (como `MÃ³dulo`) que habían sido dañados accidentalmente.

**Qué quedó en progreso:**
- La UI para gestión de Normativas (todavía solo en backend).
- El motor interactivo de simulaciones en el frontend (`SimulationEngine.tsx`).

**Bloqueos:**
- Ninguno técnico crítico, aunque la restricción de `@tanstack/router-plugin` que rompe el `build` de producción aún no se ha deshabilitado.

**Próximos pasos en orden de prioridad:**
1. Deshabilitar `tanstackRouter` en `vite.config.ts` para desbloquear `npm run build`.
2. Iniciar el desarrollo del **SimulationEngine** para las tareas SS101 (renderizar Hotspots e ingestar clics).
3. Construir la UI del dashboard Admin para la administración de `Regulations`.

---
## Sesión: 2026-04-24 — Refactorización del Editor de Módulos (Multi-Contenido)

**Qué implementamos en esta sesión:**

- **Nuevo modelo de datos de Módulos:** Se refactorizó `EditableModule` en `types/module.types.ts` para que cada módulo soporte **múltiples contenidos** (`contents: ModuleContent[]`). `ModuleContent` ahora incluye: `id`, `title`, `type`, `text`, `url` y `file`.

- **Instalación de `@hello-pangea/dnd`:** Se integró la librería para Drag & Drop fluido en reordenamiento.

- **Nuevo hook `useModuleEditor` (reescrito):**
  - Maneja un array de contenidos con las operaciones `addContent`, `updateContent`, `removeContent`, `moveContent`.
  - `handleSave` usa `Promise.all` para subir múltiples archivos en paralelo y detecta fallos por valor retornado (no por stale closure).
  - Añadido `saveError: string | null` y `clearSaveError` para informar fallos de subida sin cerrar el modal.

- **Nuevos componentes modulares:**
  - `ModuleContentItem.tsx` (246 líneas): Tarjeta individual de contenido con grip de arrastre, input de título, placeholder contextual (VIDEO/IMAGE → "Descripción"), y exclusividad URL/archivo con indicadores 🔒.
  - `ModuleContentList.tsx` (61 líneas): Zona `Droppable` que mapea items y contiene los botones "Añadir X".

- **`EditModuleModal.tsx` refactorizado (120 líneas):** Eliminado el sistema de tabs monolítico. Ahora delega la lista de contenidos a `ModuleContentList`. Muestra banner descartable de `saveError`.

- **`GeneratedPreview.tsx` actualizado:**
  - Drag & Drop para reordenar módulos completos mediante `DragDropContext` + `Draggable`.
  - Badges de contenido actualizados: muestra un badge por cada `ModuleContent` con su tipo e ícono, en verde si tiene datos.
  - Función `toEditableModule` con retrocompatibilidad para el formato de IA antiguo (campo plano `contentType`).

- **Bugs corregidos (3 ciclos de `/review-code`):**
  1. Stale closure en `uploadStatus` dentro de `handleSave` — reemplazado por sentinel `null`.
  2. Imports `React` faltantes en `ModuleContentList`, `EditModuleModal` y `ModuleContentItem`.
  3. `activeTab` local no reseteaba al cambiar el tipo de contenido — se añadió `setActiveTab("text")` en el onChange del select.
  4. Dead code en mensajes de lock de tabs — condición corregida para que sean siempre visibles cuando aplica.

**Qué quedó en progreso:**
- `ModuleContentItem` tiene 246 líneas (6 sobre el límite de 200). El bloque "Tab: Archivo" puede extraerse a `<FileDropZone>` si el componente sigue creciendo.
- El WORKLOG no había sido actualizado hasta ahora con el trabajo de esta sesión.

**Bloqueos:**
- El plugin `@tanstack/router-plugin` en `vite.config.ts` sigue activo y rompe `npm run build` porque el proyecto usa routing manual (no file-based). No bloquea `dev`, pero impide builds de producción.

**Próximos pasos en orden de prioridad:**
1. Deshabilitar `tanstackRouter` en `vite.config.ts` para desbloquear `npm run build`.
2. Iniciar **Simulación SS101** (tarea principal del SPEC, 7 subtareas definidas): schema Prisma → scoring service → SimulationEngine frontend.
3. Crear interfaz admin para gestionar Normativas (pendiente desde sesión 2026-04-21).
## Sesión: 2026-05-01 (Refactorización Frontend y Manejo de Sesión)

**Qué implementamos en esta sesión:**
- Centralización de sesión: Se creó el Custom Hook `useSessionId` (con TanStack Query) para reemplazar la lógica duplicada de `getUserId` con `useEffect`, reduciendo el boilerplate en `worker-dashboard`, `profile-recap` y `my-courses`.
- Múltiples `/fix-bug` y revisiones de Senior (`/review-code`) que corrigieron vulnerabilidades de rendimiento (Rate-limits N+1 en Supabase Auth) deduplicando los requests de sesión.
- Solución de "Race Conditions": Se implementó un parámetro `enabled: !!profileId` en los hooks de TanStack (`useMyProfile`, `useProfileEnrollments`) para evitar que dispararan requests y mostraran errores 401 antes de que se verificara si había sesión local.
- Manejo de Caché de Sesión: Ajuste del `staleTime` a 5 minutos y limpieza del query caché (`queryClient.clear()`) en el botón de "Cerrar Sesión".
- Mejora de UI en Errores: Creación de una pantalla de error (*Fallback UI*) en `worker-dashboard` al presentarse fallas en la red (con botón de reintento).
- Actualización de `REFERENCES.md` (vía `/add-reference`) exigiendo a partir de ahora que todas las peticiones a la API se agrupen en Custom Hooks estructurados (Capa API -> Capa Hook -> Componente).

**Qué quedó en progreso:**
- El desarrollo de la Simulación interactiva SS101 de la Fase 3.
- (Opcional) Limpieza de *código muerto* de spinners de carga en `ProfileRecap` y `MyCourses` que ahora son inalcanzables gracias a la barrera de carga global en el `WorkerDashboard`.

**Bloqueos:**
- Ninguno. La limpieza técnica de la Fase 1/2 está completa.

**Próximos pasos en orden de prioridad:**
1. Modificar `schema.prisma` para que `Simulation` y `SimulationAttempt` soporten configuración y eventos en formato JSON (Inicio Oficial de Fase 3).
2. Implementar el motor de scoring en el backend (`scoring.service.ts`) aplicando la fórmula de penalizaciones por tiempo e indecisión.
3. Desarrollar el `SimulationEngine.tsx` en el frontend, incorporando hotspots clicables y tracking de eventos.

---

## Sesión: 2026-04-28 (Fix Dropdown & Carga de Proyecto)

**Qué implementamos en esta sesión:**
- Análisis del estado actual del proyecto (`/load-project`), identificando los avances en las Fases 1 y 2, y los preparativos para la Simulación SS101 de la Fase 3.
- Resolución de un bug en `avatar-dropdown.tsx` (`/fix-bug`): Se eliminaron los datos estáticos de respaldo ("Diego Lopez") y se integró directamente con `supabase.auth.getUser()` para asegurar que se muestre el email real (y opcionalmente el nombre) si el backend retrasa la carga o falla el `useMyProfile`.

**Qué quedó en progreso:**
- La refactorización de los Custom Hooks en el Worker Dashboard (eliminando duplicación de `useQuery`).
- La Task "Implementar Simulación SS101 – Identificación de peligros y riesgos" (modelos, scoring, visualización).

**Bloqueos:**
- Ninguno.

**Próximos pasos en orden de prioridad:**
1. Modificar `schema.prisma` para que `Simulation` y `SimulationAttempt` soporten configuración y eventos en formato JSON.
2. Implementar el motor de scoring en el backend (`scoring.service.ts`) aplicando la fórmula de penalizaciones por tiempo e indecisión.
3. Desarrollar el `SimulationEngine.tsx` en el frontend, incorporando hotspots clicables y tracking de eventos.

---
## Sesión: 2026-04-22 (Planeación de Simulaciones y Risk Score)


**Qué implementamos en esta sesión:**
- Recepción y análisis del "Design Document" del proyecto AURA, enfocado en simulaciones interactivas y el motor de evaluación conductual (Risk Score).
- Reestructuración completa del archivo `SPEC.md` para reflejar con exactitud las 5 Fases de desarrollo, marcando las Fases 1 y 2 como completadas según el estado real del código.
- Creación de un detallado **Plan de Implementación** (`implementation_plan.md`) para transformar las simulaciones de texto a un modelo JSON interactivo y flexible.
- Organización del Sprint: Definición de la tarea "Implementar Simulación SS101 – Identificación de peligros y riesgos", desglosándola en 7 subtareas (desde el diseño hasta el tracking de eventos) e integrándolas en el `SPEC.md`.

**Qué quedó en progreso:**
- La ejecución en código de la Task SS101 recién planificada (incluyendo modificaciones al Prisma schema, servicios backend y componentes frontend).

**Bloqueos:**
- Ninguno técnico. La fase de planificación arquitectónica concluyó con éxito y estamos listos para la fase de desarrollo.

**Próximos pasos en orden de prioridad:**
1. Modificar `schema.prisma` para que `Simulation` y `SimulationAttempt` soporten configuración y eventos en formato JSON.
2. Implementar el motor de scoring en el backend (`scoring.service.ts`) aplicando la fórmula de penalizaciones por tiempo e indecisión.
3. Desarrollar el `SimulationEngine.tsx` en el frontend, incorporando hotspots clicables y tracking de eventos.

---
## Sesión: 2026-04-22

**Qué implementamos en esta sesión:**
- Sustitución de datos ficticios (mock data) en `ProfileRecap` y `MyCourses` por datos dinámicos extraídos de la API usando `@tanstack/react-query`.
- Creación de un script temporal (`seed-courses.ts`) para inyectar enrolamientos de prueba (Asignados, En Progreso y Completados) en la base de datos para la visualización del dashboard.
- Solución de múltiples bugs reportados por el usuario, incluyendo:
  - Error 400 en `GET /api/profile` (se refactorizó para usar Prisma en lugar del cliente directo de Supabase).
  - Rutas relativas en las llamadas Axios (`api.get('api/profile')` corregido a `/api/profile`).
  - Lógica del cálculo de `assignedCourses` corregida para representar la totalidad de los cursos matriculados.
  - Bloqueo infinito del UI por estado de sesión, solucionado aplicando tipos explícitos (`null` vs `""`), manejo de `try/catch`, e implementando `useNavigate` de `@tanstack/react-router`.
- Mejora de Experiencia de Usuario (UX): Se implementó un estado de carga tipo "Skeleton" (usando shadcn) global para `worker-dashboard.tsx`, asegurando contraste sobre el fondo gris.
- Actualización de `REFERENCES.md` para asentar reglas estrictas de Fetching: Obligación de usar TanStack Query y estandarización del patrón de `QUERY_KEYS`.

**Qué quedó en progreso:**
- La refactorización del frontend para extraer los bloques de `useQuery` duplicados hacia Custom Hooks centralizados (ej. `use-profile.ts`, `use-enrollments.ts`), los cuales deben consumir las `QUERY_KEYS` establecidas en `REFERENCES.md`.
- Interfaz del administrador para gestionar Normativas.

**Bloqueos:**
- Ninguno técnico. La CLI de shadcn se atascó brevemente al añadir el componente Skeleton interactivamente, solucionado creándolo manualmente.

**Próximos pasos en orden de prioridad:**
1. Refactorizar `worker-dashboard.tsx`, `profile-recap.tsx` y `my-courses.tsx` para usar Custom Hooks y eliminar el boilerplate duplicado de `useQuery`.
2. Crear la interfaz en el Frontend para que el Administrador/Owner pueda registrar nuevas normativas utilizando el endpoint creado en la sesión anterior.
3. Iniciar el desarrollo del feature "Risk Score / Behavioral Profile" (que actualmente sigue con datos hardcodeados en el componente `BehavioralProfile`).

---
## Sesión: 2026-04-21

**Qué implementamos en esta sesión:**
- Actualización de Esquema de BD: Se agregaron `duration`, `type` (usando el nuevo enum `CourseType`) y la relación con el nuevo modelo `Regulation` a los Cursos en Prisma.
- Ejecución exitosa de migraciones a la base de datos remota (Supabase).
- Creación del Módulo Backend `Regulation` (types, validation, controller, routes, service). Se implementó el endpoint `GET /api/regulations` y el `POST /api/regulations` (protegido con el middleware `requireAdmin`).
- Actualización de servicios `course.service` y `enrollment.service` para devolver los nuevos campos incluyendo las normativas ligadas al curso.
- Actualización del Frontend (`my-courses.tsx`) para consumir y desplegar los nuevos datos en las tarjetas de `CourseCard`.
- Poblado inicial (seeding) de la BD con las normativas: `NOM-029-STPS-2011`, `NOM-018-STPS-2015`, `NOM-017-STPS-2008`, `NOM-026-STPS-2008`.

**Qué quedó en progreso:**
- La interfaz del Frontend para que los administradores puedan crear normativas a través de la UI (por ahora solo existe el endpoint).
- La documentación del `SPEC.md` que aún tiene algunos `TODO`s.

**Bloqueos:**
- Ninguno por el momento. Hubo un error `500` con Prisma pero se resolvió ejecutando la migración faltante.

**Próximos pasos en orden de prioridad:**
1. Crear una interfaz en el Frontend para que el Administrador/Owner pueda registrar nuevas normativas utilizando el endpoint recién creado.
2. Completar los campos pendientes de visión y arquitectura en el `SPEC.md`.
3. Iniciar el desarrollo del siguiente feature clave del MVP.

---
## Sesión: 2026-04-20 (Cierre de Sesión)

**Qué implementamos en esta sesión:**
- Análisis inicial de la estructura del repositorio (Frontend Vite/React, Backend Node/Prisma).
- Configuración inicial del workflow de trabajo.
- Creación de archivos fundamentales: `CLAUDE.md`, `SPEC.md` y `WORKLOG.md`.
- Creación de `REFERENCES.md` con patrones de arquitectura base.
- Definición de los comandos personalizados (`/load-project`, `/review-code`, `/new-feature`, `/fix-bug`, `/update-worklog`).

**Qué quedó en progreso:**
- La definición detallada de los requerimientos y la arquitectura del sistema.

**Bloqueos:**
- Ninguno por el momento.

**Próximos pasos en orden de prioridad:**
1. Completar los campos de visión y arquitectura marcados con `[📝 TODO]` en `SPEC.md`.
2. Instalar dependencias y verificar que los servidores locales del frontend y backend se levantan sin errores.
3. Escoger el primer feature del MVP y arrancar con un `/new-feature`.

---

*(Agrega nuevas sesiones arriba de esta línea para mantener el orden cronológico inverso, es decir, lo más nuevo siempre arriba).*
