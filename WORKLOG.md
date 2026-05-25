# Registro de Trabajo (WORKLOG.md)

Este documento mantiene un registro cronológico de las sesiones de trabajo, tareas en curso, decisiones importantes y tareas pendientes. Esto asegura que el contexto no se pierda entre sesiones.


## Sesión: 2026-05-25 (Sesión B) — Creación del Curso y Simulación TEC102 (Bombas Centrífugas)

**Qué implementamos en esta sesión:**
- **Creación del Curso y Simulación TEC102**:
  - Diseñado y creado el script de seed `seed-tec102.ts` para registrar el nuevo curso de capacitación técnica `"TEC102: Bombas centrífugas – principios, operación, mantenimiento y seguridad"`.
  - Definida la simulación guiada para el arranque seguro de bombas centrífugas en estaciones de distribución de gas natural (Sempra Infrastructure), mapeada en 4 grandes hotspots rectangulares:
    1. Cárter de rodamientos y visor de nivel de lubricante (`x: 8.0`, `y: 20.0`, `width: 18.0`, `height: 40.0`).
    2. Válvula de purga/venteo manual de la carcasa (`x: 30.0`, `y: 15.0`, `width: 18.0`, `height: 35.0`).
    3. Alineación de válvulas de proceso succión/descarga (`x: 52.0`, `y: 25.0`, `width: 20.0`, `height: 50.0`).
    4. Monitoreo de presión diferencial en el manómetro de descarga (`x: 76.0`, `y: 15.0`, `width: 18.0`, `height: 40.0`).
  - Asociadas las regulaciones normativas e internacionales: la norma oficial mexicana **NOM-004-STPS-1999** (maquinaria y equipo seguro en centros de trabajo) y el estándar internacional **API 610** (especificación de bombas centrífugas para gas natural e hidrocarburos).
- **Ejecución y Verificación de Base de Datos**:
  - Corregidos los paths de importación de la instancia interna del cliente Prisma en el seed.
  - Ejecutada la siembra exitosa en la base de datos local y corroborada la correcta compilación de todo el software del backend.

## Sesión: 2026-05-25 — Correcciones en SS104 (Esquema de Validación, Disciplina del Quiz "Te Chingas", y Hotspots más grandes)

**Qué implementamos en esta sesión:**
- **Resolución de Bloqueo de Envío (Backend Zod)**:
  - Corregido `simulationEventSchema` en `simuAttempt.validation.ts` para aceptar los tipos de evento `WRONG_CLICK` y `QUIZ_ERROR` y sus campos opcionales. Esto resuelve el error `400 Bad Request` en el envío que impedía calcular la puntuación de riesgo y mostrar el reporte de IA al terminar.
- **Implementación del Flujo de Un Solo Intento (Frontend)**:
  - Modificada la interfaz de mini-quizzes en `simulation-engine.tsx`. Ahora, tras enviar una respuesta (correcta o incorrecta), la opción queda bloqueada (`disabled={isQuizSuccess !== null}`).
  - Si la respuesta es incorrecta, se registra el evento `QUIZ_ERROR` (para restar puntos), se despliega el feedback específico provisto por la base de datos de por qué está mal, y se coloca el marcador/pin para permitirle avanzar en el flujo guiado. En ambos casos, se habilita inmediatamente el botón para continuar al siguiente paso.
- **Optimización de Posiciones y Tamaños de Hotspots (Base de Datos)**:
  - Modificado el script de seeding `seed-ss104.ts` aumentando el tamaño de los hotspots (radios de 12% y 15%) y definiendo una secuencia limpia de izquierda a derecha acorde al prompt de Gemini.
  - Añadido el campo `feedback` explicativo para cada una de las opciones incorrectas en las preguntas del seed.
  - Ejecutado el script de seed exitosamente actualizando la base de datos local.
- **Validaciones**:
  - Compilación verificada exitosamente tanto en frontend como en backend (`tsc` limpio y sin errores).
  - Pruebas unitarias de scoring aprobadas al 100%.

**Qué quedó en progreso:**
- Espera de reemplazo manual del archivo `electrical_safety_1.png` con la imagen de subestación real generada por el usuario para su posterior verificación visual.

**Bloqueos:**
- Ninguno.

**Próximos pasos en orden de prioridad:**
- [ ] 1. Esperar confirmación de la carga de imagen real del usuario.
- [ ] 2. Ajustar porcentajes finos de coordenadas x/y de los hotspots si difieren de la distribución por defecto una vez cargada la imagen.
- [ ] 3. Continuar con la Fase 4 del MVP (Supervisor Dashboard).

---

## Sesión: 2026-05-21 — Simulación SS104 de Seguridad Eléctrica (Flujo Guiado y Disciplina en la Secuencia)

**Qué implementamos en esta sesión:**
- **Activo Visual de Alta Fidelidad**: Generación e inyección de la escena de la sala de control eléctrico `electrical_safety_1.png` en `frontend/public/simulations/`.
- **Seeding de Base de Datos para SS104**: Creación e integración del script `seed-ss104.ts` que pobla el curso "SS104: Seguridad Eléctrica y Bloqueo LOTO" y su simulación de tipo `GUIDED_SEQUENCE` asociada a las normativas NOM-029-STPS-2011 y NFPA 70E.
- **Motor de Scoring para Secuencias**: Implementación de la lógica en `scoring.service.ts` para evaluar intentos `GUIDED_SEQUENCE`, penalizando desviaciones de secuencia (`WRONG_CLICK`), errores en las preguntas (`QUIZ_ERROR`), pasos omitidos y tiempo excedido.
- **TDD del Backend**: Adición y aprobación de casos de prueba unitarios en `scoring.service.test.ts` que validan tanto flujos perfectos de secuenciación como flujos con desviaciones (ambos aprobando exitosamente).
- **Interfaz Interactiva de Disciplina Operativa (UI/UX)**:
  - Modificación completa del motor de visualización `simulation-engine.tsx` para guiar al usuario a través de los 4 pasos cronológicos obligatorios (Libranza, LOTO, Verificación de Ausencia de Tensión y Delimitación del Área).
  - Integración de micro-quizzes contextuales en barra lateral para cada hotspot.
  - Implementación de retroalimentación inmediata, bloqueos dinámicos en respuestas correctas, visualización de pines interactivos verdes con íconos de check al completar y advertencias mediante `react-hot-toast` al hacer clicks inseguros fuera de la secuencia.
- **Sincronización y Tipado**: Corrección de tipos en hooks de tracking y verificación de compilación con 0 errores de TypeScript (`npx tsc --noEmit` exitoso en frontend y backend).

**Qué quedó en progreso:**
- Ninguno. La simulación SS104 está totalmente implementada en base de datos, motor de scoring y experiencia del frontend.

**Bloqueos:**
- Ninguno.

**Próximos pasos en orden de prioridad:**
- [ ] 1. Pruebas visuales locales del flujo guiado directamente en el navegador del desarrollador.
- [ ] 2. Continuar con la Fase 4 del MVP: Dashboard para Supervisor con métricas de comportamiento reales.

---

## Sesión: 2026-05-20 — Corrección de Bugs (XSS en Visor de Módulos, Tipos en handleScrubChange y Sincronización en AIForm)

**Qué implementamos en esta sesión:**
- **Sanitización de URLs (Prevención de XSS)**:
  - Implementación de la función helper `sanitizeUrl` en `module-learning.tsx`.
  - Validación y filtrado defensivo de `slide.url` en todos los bloques de renderizado (`READING`, `IMAGE`, `VIDEO` y `AUDIO`), restringiendo los esquemas permitidos únicamente a `http:`, `https:`, `/` (rutas relativas), `blob:` y `data:image/` (exclusivamente para imágenes).
- **Corrección de Espacio de Nombres de React**:
  - Reemplazo de la referencia de tipo `React.ChangeEvent` por la importación directa y limpia de `ChangeEvent` de React en `module-learning.tsx` para evitar fallos de compilación en el JSX runtime automático.
- **Sincronización de Valores en AIForm**:
  - Ajuste en el estado inicial y en el reset del formulario `formData.duration` en `ai-form.tsx` cambiando `"1 hora"` por `"1"` para coincidir de forma consistente con las opciones numéricas del select.

**Qué quedó en progreso:**
- Ninguno. Todos los bugs identificados por Copilot han sido resueltos de forma óptima.

**Bloqueos:**
- Ninguno.

**Próximos pasos en orden de prioridad:**
- Continuar con las fases de desarrollo planificadas en `SPEC.md`.

---

## Sesión: 2026-05-19 — Parte IV (Ajustes de UI/UX de Láminas, Soporte de Audio y Corrección de Simulación 1)

**Qué implementamos en esta sesión:**
- **UI/UX y Visor de Láminas Flexibles**:
  - Removido el comportamiento estricto de pantalla fija `h-screen overflow-hidden` en `module-learning.tsx`, permitiendo scroll normal y fluido de página para dispositivos pequeños.
  - Agregado espaciado `pb-12` en el contenedor detallado de `course-detail.tsx` para evitar que el acordeón de módulos toque el bottom de la página.
  - Rediseñado el visualizador de PDF estableciendo una altura mínima de `min-h-[600px]` y una altura responsiva de `h-[75vh]`, asegurando proporciones estables en el Split-View.
  - Reposicionado el `<Toaster />` global de notificaciones a `"top-right"` en `main.tsx` para no bloquear los botones de quizzes ni de navegación del pie de página.
- **Soporte de Recursos AUDIO (Admin Dashboard)**:
  - Importado `Headphones` y mapeado el tipo de contenido `AUDIO` en `module-card.tsx` para renderizar el chip correcto (icono de auriculares y etiqueta "Audio") en el panel administrativo.
- **Alineación de Hotspots de la Simulación 1**:
  - Corregida la inyección de hotspots por defecto en `course.service.ts` y en el seed `seed-ss101.ts`. Reemplazados los 3 puntos incorrectos de fuga de gas por los 4 puntos reales y alineados con la imagen de seguridad de la terminal Sempra (Derrame de Aceite, Falta de EPP, Cables Expuestos y Cables Sueltos).
  - Actualizado con éxito el curso de gasoductos SS101 en la base de datos local a través del script de seeding.
- **Validación de Compilación y Testeo**:
  - Compilación de TypeScript verificada exitosamente en frontend y backend (`npx tsc --noEmit` con 0 errores).
  - Pruebas de integración de backend (`modulo.integration.test.ts`) y pruebas unitarias de scoring (`scoring.service.test.ts`) aprobadas al 100%.

**Qué quedó en progreso:**
- Ninguno. Los requerimientos de ajuste de UI/UX, soporte de audio y corrección de la simulación 1 se completaron en su totalidad de acuerdo a lo planificado.

**Bloqueos:**
- Ninguno.

**Próximos pasos en orden de prioridad:**
- Continuar con las fases de desarrollo planificadas en `SPEC.md`.

---

## Sesión: 2026-05-19 — Asignación de Cursos a Trabajadores (Búsqueda Real, Paginación y Filtrado)

**Qué implementamos en esta sesión:**
- **Backend (Paginación y Clean-up)**:
  - Se modificó `searchProfiles` en `profile.service.ts`, `profile.controller.ts` y su esquema de validación para aceptar `search`, `page` y `limit`, devolviendo resultados paginados (`{ data, total, page, limit }`).
  - Se removió un hack en `enrollment.service.ts` que matriculaba automáticamente al rol `ADMIN` en todos los cursos al consultar el endpoint. Ahora devuelve estrictamente los registros reales de `CourseEnrollment`.
- **Frontend (UI/UX Pro Max en Asignaciones)**:
  - Migración completa del componente `assignments.tsx` para dejar de depender de `mockUsers`, `mockCourses` y `mockProgress`.
  - **Búsqueda de Trabajadores:** Se implementó búsqueda real al endpoint `/api/profile/search` con `debounce` de 300ms y un mínimo de 3 caracteres antes de gatillar la red.
  - **Cursos Pendientes:** Al seleccionar un trabajador, se hace fetch automático (`useProfileEnrollments`) a sus enrolamientos reales, desplegando únicamente sus cursos asignados que no han sido completados (`progress < 100`).
  - **Búsqueda de Cursos:** Ahora la lista disponible para asignar (`useCourses()`) **filtra dinámicamente** los cursos para ocultar aquellos en los que el usuario ya está inscrito, previniendo asignaciones duplicadas.
  - **Persistencia en Base de Datos:** Se implementó la mutación real `useEnrollInCourse` para que el botón "Asignar Cursos Seleccionados" impacte la base de datos (con un loop concurrente de peticiones POST).
  - **UX en Tiempo Real:** Se evitó limpiar el trabajador seleccionado tras asignar, logrando que el componente reaccione en tiempo real gracias a la invalidación de caché de `@tanstack/react-query`, moviendo el curso instantáneamente a la sección de "Cursos pendientes".

**Qué quedó en progreso:**
- Proceder con el desarrollo de la interfaz de carga híbrida de archivos y dropzone en el Dashboard de Administrador (`module-content-item.tsx`), o continuar con la Fase 4 (Supervisor Metrics).

**Bloqueos:**
- Ninguno. 

**Próximos pasos en orden de prioridad:**
1. Proceder con el desarrollo de la interfaz de carga híbrida de archivos y dropzone en el Dashboard de Administrador (`module-content-item.tsx`).
2. Completar los dashboards de Supervisores con data analítica proveniente de la base de datos (eliminando mocks restantes).

---

## Sesión: 2026-05-19 — Parte II y III (Vista Paginada, Quizzes y Videos Embeds)

**Qué implementamos en esta sesión:**
- **Backend (TDD)**:
  - Implementación del nuevo endpoint `GET /api/modules/get-module-by-id/:moduleId` en `modulo.controller.ts` y `modulo.service.ts` para obtener todo el árbol de contenido de un módulo, incluyendo las evaluaciones (`quizzes` y sus reactivos).
  - Creación del archivo de pruebas `modulo.integration.test.ts` verificando el caso de éxito (con autenticación de Supabase mockeada) y el manejo de errores `404` (NotFoundError). Ambas pruebas pasaron en verde.
- **Frontend (UI/UX Pro Max)**:
  - Creación de la pantalla inmersiva `ModuleLearning` (`frontend/src/routes/module-learning.tsx`) que despliega una barra superior de progreso y permite navegar de manera horizontal a través de todas las `ModuleContent` (Lecturas, Imágenes, Videos).
  - Al superar los contenidos de lectura, se adjuntan las evaluaciones (Quizzes) asociadas.
  - Creación de custom hook `useModuleById` conectándolo a `moduleApi`.
  - **Lógica de QuizAttempt en Tiempo Real**: Se agregó la funcionalidad para enviar el Quiz vía `useCreateQuizAttempt`, bloqueando los *inputs* tras el envío y brindando feedback visual inmediato (Aprobado/Reprobado, calificación en %, y marcado en verde/rojo de los reactivos correctos e incorrectos).
  - **Fix de Video URLs (YouTube)**: Se modificó la renderización del contenido `VIDEO` añadiendo una expresión regular para detectar URLs externas de YouTube (`youtu.be`, `watch?v=`), reemplazando dinámicamente la etiqueta nativa `<video>` por un `<iframe>` embed fluido.

**Qué quedó en progreso:**
- Proceder con el desarrollo de la interfaz de carga híbrida de archivos y dropzone en el Dashboard de Administrador (`module-content-item.tsx`).

**Bloqueos:**
- Ninguno. Las validaciones estáticas `npx tsc --noEmit` en backend y frontend pasaron sin errores.

**Próximos pasos en orden de prioridad:**
1. Proceder con el desarrollo de la interfaz de carga híbrida de archivos y dropzone en el Dashboard de Administrador (`module-content-item.tsx`).

---

## Sesión: 2026-05-19 — (Fix de Roles y Autorización de Worker)

**Qué implementamos en esta sesión:**
- **Sincronización y Regeneración del Cliente de Prisma**:
  - Corregimos un desajuste crítico entre el esquema (`schema.prisma`) que mapeaba `EMPLOYEE` a `"WORKER"` en base de datos y el cliente de Prisma generado (`backend/generated/prisma`) que seguía compilado con la enumeración antigua (`WORKER` sin mapear).
  - Ejecutamos con éxito `npx prisma generate` en el backend para forzar la correcta autoconversión en la capa ORM.
- **Normalización Defensiva en AuthGuard**:
  - Parcheamos el guardia de rutas global del frontend `getUserState` (`frontend/src/lib/authGuard.ts`) para que normalice de manera robusta y transparente `"WORKER"` a `"EMPLOYEE"` al usar `fetch()`, logrando consistencia con el interceptor de Axios y eliminando redirecciones indeseadas a landing al acceder al dashboard de trabajador.
- **Ajuste de Margen y Espaciado en UI de Edición de Módulos**:
  - Ampliamos el espacio visual (`gap`) entre el `Textarea` de contenido y las notificaciones de bloqueo de pestañas (`fileTabDisabled` y `urlTabDisabled`) en [module-content-item.tsx](file:///Users/diegopez/Documents/AURA/frontend/src/components/dashboards/admin/module-content-item.tsx) agregando `mt-4`.
- **Validación de Compilación**:
  - Ejecutamos pruebas estáticas de TypeScript (`tsc --noEmit`) tanto en frontend como en backend, resultando en **0 errores de compilación**.

**Qué quedó en progreso:**
- **Diseño Híbrido de Archivos**: Listo el diseño UX del botón "Reemplazar Archivo" y los visualizadores premium de multimedia en el dashboard del administrador.

**Bloqueos:**
- Ninguno.

**Próximos pasos en orden de prioridad:**
1. Proceder con el desarrollo de la interfaz de carga híbrida de archivos y dropzone en `module-content-item.tsx` aplicando el flujo guardado en lote.

---

## Sesión: 2026-05-18 — (Alineación de Tiempos de Simulación, Pestañas Persistentes y Toasts Autolimpiables)

**Qué implementamos en esta sesión:**
- **Alineación de Parámetros de Tiempo en Simulaciones (`timeLimitSeconds`)**:
  - Modificamos `submitAttempt` de [simuAttempt.service.ts](file:///Users/diegopez/Documents/AURA/backend/src/services/simuAttempt.service.ts) para soportar de manera robusta y compatible tanto la clave unificada `timeLimitSeconds` como `timeLimit` para el cálculo y la penalización de tiempo.
  - Sincronizamos el cargador de cursos base en [course.service.ts](file:///Users/diegopez/Documents/AURA/backend/src/services/course.service.ts) para usar consistentemente `timeLimitSeconds: 120` al crear/iniciar simulaciones.
- **Pestañas Persistentes en Dashboard de Administrador**:
  - Eliminamos la renderización condicional (desmontaje) en [admin-dashboard.tsx](file:///Users/diegopez/Documents/AURA/frontend/src/routes/admin-dashboard.tsx), reemplazándola con clases CSS de visibilidad de Tailwind (`hidden` / `space-y-6`).
  - Ahora, los componentes `AIForm` y `GeneratedPreview` retienen todo su estado local (borradores, inputs llenos, estados de carga y previsualizaciones activas) al navegar de una pestaña a otra.
- **Notificaciones Premium con Auto-limpieza (`react-hot-toast`)**:
  - Integramos el hook global `toast.success` desde la librería nativa del proyecto `react-hot-toast` en la función de éxito de publicación de [use-generated-preview.ts](file:///Users/diegopez/Documents/AURA/frontend/src/components/dashboards/admin/hooks/use-generated-preview.ts).
  - Limpiamos el borrador y los inputs de `AIForm` inmediatamente en la mutación exitosa sin requerir clics manuales del usuario en botones de cierre.
- **Compilación Estática Exitosa**: Corrimos `npx tsc --noEmit` en ambos directorios (frontend y backend) obteniendo **0 errores de TypeScript**.
- **Control de Commits de Git**: Los cambios se guardaron de manera segura y local (sin hacer add ni commits), respetando las directivas del usuario.

**Qué quedó en progreso:**
- Ninguno. Todas las tareas de unificación de tiempo, preservación de estado e interacciones premium de publicación están terminadas con éxito.

**Bloqueos:**
- Ninguno.

**Próximos pasos en orden de prioridad:**
- [ ] 1. Avanzar con la Fase 4 del MVP: Creación y desarrollo del Dashboard para Supervisor con métricas y reportes analíticos reales.

---

## Sesión: 2026-05-16 — Parte II (Desarrollo Completo del Motor de Simulación SS101 y Feedback de IA)

**Qué implementamos en esta sesión:**
- **Motor de Scoring e IA Backend**: Implementación de `scoring.service.ts` con distancias euclidianas y penalizaciones de comportamiento + `openai.service.ts` utilizando `gpt-4o-mini` para retroalimentación cualitativa.
- **Frontend Interactivo Responsivo**: Construcción de `simulation-engine.tsx` con un split-view premium, timers dinámicos, tracking preciso de eventos (pines interactivos) e inyección de imagen generada por IA.
- **UI/UX Pro Max Pulido**: 
  - Cuadro de justificación técnica por cada acierto y omisión usando iconos SVG (`Lucide React`), erradicando emojis por completo para cumplir con `REFERENCES.md`.
  - Estados de carga animados (`Loader2` y `animate-pulse`) durante el análisis.
  - Pines interactivos de advertencia amarillos (`bg-yellow-500` con `AlertTriangle` rebotando) durante el cálculo de puntuación para evitar spoilers visuales.
- **Bugfixes Críticos**: Solución de error 404 de API al resolver el enrutamiento incorrecto que pasaba el `courseId` en lugar del `simulationId` tanto en `course-detail.tsx` como en las tarjetas `CourseCard.tsx` del dashboard.
- **Historial Limpio**: Remoción de archivos y scripts de depuración huérfanos (`seed_sim`, `fix_sim`, `test_submit`), y reestructuración completa de los commits del pull request en 8 commits semánticos y organizados.

**Qué quedó en progreso / Próxima Sesión:**
- **IA Conductual Avanzada**: Extender el prompt de OpenAI en `openai.service.ts` para que tome en cuenta directamente los errores y omisiones concretas cometidas por el usuario (y no solo las métricas globales e indecisión).

**Bloqueos:**
- Ninguno. La simulación es completamente estable y funcional de extremo a extremo.

**Próximos pasos en orden de prioridad:**
- [ ] 1. Modificar el prompt en `backend/src/services/openai.service.ts` para que el análisis cualitativo evalúe los errores específicos y omisiones del intento.
- [ ] 2. Avanzar con la Fase 4: Creación del Dashboard para Supervisor con métricas reales.

---

## Sesión: 2026-05-16 (Instalación de AI Skills: Superpowers & UI/UX Pro Max)

**Qué implementamos en esta sesión:**
- Instalación de repositorios de "skills" locales `.superpowers` y `.ui-ux-pro-max-skill` para estandarizar el comportamiento del AI Agent (Antigravity).
- Sobreescritura total de `CLAUDE.md` para forzar explícitamente el uso de metodologías de Superpowers (TDD, Systematic Debugging, Agentic Planning) y reglas estrictas de UI/UX Pro Max.
- Inyección masiva de cientos de reglas, estilos, paletas y directrices de los repositorios de skills directamente dentro de `REFERENCES.md` usando automatización.
- Actualización final del `WORKLOG.md` y push de toda la configuración a la rama remota.

**Qué quedó en progreso:**
- Ninguno. La inicialización y configuración de los frameworks y metodologías está completada con éxito.

**Bloqueos:**
- Ninguno técnico.

**Próximos pasos en orden de prioridad:**
1. Retomar el desarrollo de las tareas pendientes de la fase actual (ej. Simulación SS101 o Dashboard Admin) utilizando estrictamente las nuevas metodologías y skills de UI/UX.

---

## Sesión: 2026-05-04 (Migración de Roles, DB Sync y Routing Fixes)

**Qué implementamos en esta sesión:**
- Refactorización completa del Enum `Role` en Prisma (`EMPLOYEE` -> `WORKER`, `OWNER` -> `SUPERVISOR`). Se ejecutó SQL crudo (`rename_roles.sql`) en Supabase para renombrar los valores sin pérdida de datos antes de hacer el `prisma db push`.
- Resolución de conflictos generados por ramas concurrentes: Se sincronizaron modelos y columnas nuevas (`Simulation.configuration`, `Simulation.events`, `CompletedModule`) provenientes del trabajo de una compañera de equipo.
- Instalación de dependencias faltantes (`@types/pg`, `@hello-pangea/dnd`) y corrección de errores de TypeScript en el backend.
- Prevención de fallos en producción: Se deshabilitó el plugin `tanstackRouter` inyectado erróneamente en `vite.config.ts`, el cual chocaba con el enrutamiento manual (`Code-Based Routing`) de AURA, colapsando el servidor Vite.
- Solución de un bug crítico de redirección infinita (Landing <-> Login <-> Dashboard): Se actualizó el bloque `switch` en `router.tsx` que seguía evaluando los strings antiguos ("EMPLOYEE") y forzaba el `default: redirect({to: "/"})`.
- Refactorización de componentes (ej. `profile.tsx`, `course-detail.tsx`, `navbar.tsx`) para asegurar el paso de la nueva nomenclatura de roles como prop.
- Poblado automático de base de datos (Seeding): Se inyectaron módulos base (teóricos y prácticos) a todos los cursos antiguos que tenían 0 módulos, asegurando que la UI de detalle de curso no se muestre vacía.
- Limpieza total del workspace: Eliminación de código temporal, scripts de prueba y mock data huérfana.

**Qué quedó en progreso:**
- Continuar el desarrollo del Frontend de la Simulación (`SimulationEngine.tsx`), que ahora tiene la base de datos totalmente preparada y sincronizada.

**Bloqueos:**
- Ninguno técnico crítico. Todos los problemas de "Database Drift" y colisiones de Vite fueron mitigados con éxito en esta sesión.

**Próximos pasos en orden de prioridad:**
1. Retomar la Fase 3 del MVP: Desarrollar la lógica del `SimulationEngine.tsx` que interpretará la columna JSON `configuration` y guardará los `events`.
2. Integrar el servicio backend (`scoring.service.ts`) para evaluar y otorgar calificaciones conductuales.
3. Consolidar el Dashboard de Administrador (`Crear Contenido`) con las nuevas estructuras de módulos y contenido multimedia.

---

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
