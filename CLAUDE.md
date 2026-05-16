# Instrucciones del Proyecto (CLAUDE.md)

Este documento contiene las reglas generales, convenciones y directrices para el asistente de IA al trabajar en el proyecto AURA.

## Metodología Core y Frameworks
El asistente está equipado con dos frameworks base ubicados en repositorios locales ocultos (`.superpowers` y `.ui-ux-pro-max-skill`) que dictan su comportamiento operativo:

### 1. The Engine: Superpowers Framework
Para desarrollo robusto y sin regresiones, el asistente aplica de manera estricta y nativa las siguientes metodologías (Skills):
- **test-driven-development (TDD)**: Estricto ciclo RED-GREEN-REFACTOR. Jamás se debe escribir código funcional sin antes escribir una prueba que falle. Todo código pre-existente sin pruebas debe refactorizarse.
- **systematic-debugging**: Diagnóstico en 4 fases. Prohibido adivinar. Se debe realizar análisis de causa raíz, buscar efectos colaterales y probar exhaustivamente antes de dar un fix por terminado.
- **writing-plans & subagent-driven-development**: Para cualquier feature, dividir el alcance en tareas de 2-5 minutos. Ejecutar y validar paso a paso.
- **using-git-worktrees**: Usar branches paralelos aislados para desarrollo sin afectar el baseline estable.

### 2. The Paint & Finish: UI/UX Pro Max Intelligence
Al construir interfaces o componentes frontend:
- Aplicar estrictamente directrices de diseño (67 estilos visuales y 161 paletas de colores).
- Evaluar el dominio del producto (SaaS, Fintech, etc.) para inferir el "Color Mood" y tipografías correctas.
- Evitar activamente los "Anti-Patterns" documentados en la inteligencia de diseño para la industria específica.

## Comandos Personalizados (The Steering Wheel)
- `/load-project`: Lee CLAUDE.md, SPEC.md y WORKLOG.md en ese orden. El asistente debe responder con un resumen del estado actual, qué estaba en progreso y el próximo paso. No debe escribir código hasta recibir aprobación.
- `/review-code`: Revisa el código recién escrito con mentalidad de senior developer estricto. Evalúa: 1) Bugs/Edge cases, 2) Cumplimiento estricto de TDD y UI/UX Pro Max, 3) Simplificación (over-engineering), 4) Manejo de errores, 5) Riesgos en producción. El asistente será directo y claro.
- `/new-feature [descripción]`: Inicia una nueva feature. Genera un plan estructurado (`writing-plans`). Al ser aprobado, implementa en orden: Backend (usando TDD estricto) y luego Frontend (aplicando guías de UI/UX Pro Max). Escribe tipos TS primero y usa patrones de REFERENCES.md.
- `/fix-bug [descripción]`: Ejecuta `systematic-debugging`. Responde con: 1) Causa probable, 2) Archivos involucrados, y 3) El fix mínimo necesario. Promete estrictamente NO arreglar nada más allá del bug reportado y mostrar el diff exacto.
- `/update-worklog`: Actualiza WORKLOG.md al terminar la sesión. Incluye: Fecha, Qué implementamos (lista de lo hecho), Qué quedó en progreso, Bloqueos y Próximos pasos por prioridad.
- `/add-reference [tema]`: Agrega a REFERENCES.md un snippet de ejemplo para un nuevo patrón o librería funcional y gotchas/detalles, manteniendo el estilo.
- `/update-spec [cambio]`: Actualiza SPEC.md ante cambios de diseño o alcance. Asegura: 1) Marcar [x] features implementadas, 2) Agregar nuevas con [ ], 3) Actualizar modelo de datos, 4) Actualizar endpoints.
- `/agent [rol]`: Invoca un sub-agente experto para revisar código bajo un enfoque específico:
  - `security`: Busca vulnerabilidades, inyecciones, mala autenticación y secrets.
  - `dba`: DBA experto en PostgreSQL. Revisa queries eficientes/índices, normalización, N+1.
  - `qa`: QA Engineer. Genera planes de prueba necesarios y casos extremos.
  - `frontend`: Experto UX. Evalúa manejo de estado, re-renders, UX completa y cohesión, haciendo cumplir estrictamente las guías de UI/UX Pro Max.

## Stack Tecnológico (AURA)
- **Frontend**: Vite, React (infiriendo por la estructura), TypeScript.
- **Backend**: Node.js, Prisma ORM, TypeScript.

## Convenciones Generales
- Mantener el código modular, limpio y bien estructurado.
- Usar TypeScript y definir tipos/interfaces siempre que sea posible.
- Los comentarios explican el "por qué" (decisiones de negocio o arquitectura), no el "qué" (código obvio).
- Seguir estrictamente las configuraciones de linting/formatting existentes (`eslint.config.js`).

## Proceso de Trabajo
1. Analizar requerimientos y la base de código actual antes de proponer soluciones.
2. Hacer cambios iterativos, pequeños y testeables usando ejecución por planes (Subagents).
3. Asegurarse de actualizar `WORKLOG.md` al completar tareas importantes o al terminar la sesión.
