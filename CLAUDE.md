# Instrucciones del Proyecto (CLAUDE.md)

Este documento contiene las reglas generales, convenciones y directrices para el asistente de IA al trabajar en el proyecto AURA.

## Comandos Personalizados
- `/load-project`: Lee CLAUDE.md, SPEC.md y WORKLOG.md en ese orden. El asistente debe responder con un resumen del estado actual, qué estaba en progreso y el próximo paso. No debe escribir código hasta recibir aprobación.
- `/review-code`: Revisa el código recién escrito con mentalidad de senior developer estricto. Evalúa: 1) Bugs/Edge cases, 2) Cumplimiento de CLAUDE.md, 3) Simplificación (over-engineering), 4) Manejo de errores, 5) Riesgos en producción. El asistente será directo y claro.
- `/new-feature [descripción]`: Inicia la implementación de una nueva feature. Primero genera un plan para describir el approach. Al ser aprobado, implementa en orden: Backend (modelo → repo → servicio → controller → ruta) y luego Frontend (tipos → hook → componente → integración). Escribe tipos TS primero y usa patrones de REFERENCES.md.
- `/fix-bug [descripción]`: Diagnostica y arregla un bug. El asistente responderá con: 1) Causa probable, 2) Archivos involucrados, y 3) El fix mínimo necesario. Promete estrictamente NO arreglar nada más allá del bug reportado y mostrar el diff exacto de los cambios a realizar.
- `/update-worklog`: Actualiza WORKLOG.md al terminar la sesión. Incluye: Fecha, Qué implementamos (lista de lo hecho), Qué quedó en progreso, Bloqueos y Próximos pasos por prioridad.
- `/add-reference [tema]`: Agrega a REFERENCES.md un snippet de ejemplo para un nuevo patrón o librería. Incluye: Cuándo usar el patrón, snippet mínimo funcional y gotchas/detalles importantes, manteniendo el estilo existente.
- `/update-spec [cambio]`: Actualiza SPEC.md ante cambios de diseño o alcance. Asegura: 1) Marcar [x] features implementadas, 2) Agregar nuevas con [ ], 3) Actualizar modelo de datos, 4) Actualizar endpoints.
- `/agent [rol]`: Invoca un sub-agente experto para revisar código bajo un enfoque específico:
  - `security`: Busca SQL injection, mala autenticación, secrets, inputs no sanitizados y JWT mal configurado. Reporta con severidad (CRÍTICO/ALTO/MEDIO/BAJO).
  - `dba`: DBA experto en PostgreSQL. Revisa queries eficientes/índices, normalización, N+1 queries, foreign keys y constraints.
  - `qa`: QA Engineer. Genera casos de prueba necesarios, edge cases probables y un test de integración (happy path) en el stack del proyecto (Vitest/Jest).
  - `frontend`: Experto en React/UX. Evalúa manejo de estado, re-renders innecesarios, UX completa (loading/error/empty) y cohesión del componente (si debe dividirse).
## Stack Tecnológico (AURA)
- **Frontend**: Vite, React (infiriendo por la estructura), TypeScript.
- **Backend**: Node.js, Prisma ORM, TypeScript.

## Convenciones Generales
- Mantener el código modular, limpio y bien estructurado.
- Usar TypeScript y definir tipos interfaces siempre que sea posible.
- Los comentarios deben explicar el "por qué" de las decisiones complejas, no el "qué" hace el código obvio.
- Seguir las configuraciones de linting/formatting existentes en el proyecto (`eslint.config.js`).

## Proceso de Trabajo
1. Analizar requerimientos y la base de código actual antes de proponer soluciones.
2. Hacer cambios iterativos, pequeños y testeables.
3. Asegurarse de actualizar `WORKLOG.md` al completar tareas importantes o al terminar una sesión de trabajo.
