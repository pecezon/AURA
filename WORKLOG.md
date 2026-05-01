# Registro de Trabajo (WORKLOG.md)

Este documento mantiene un registro cronológico de las sesiones de trabajo, tareas en curso, decisiones importantes y tareas pendientes. Esto asegura que el contexto no se pierda entre sesiones.

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
