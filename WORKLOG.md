# Registro de Trabajo (WORKLOG.md)

Este documento mantiene un registro cronológico de las sesiones de trabajo, tareas en curso, decisiones importantes y tareas pendientes. Esto asegura que el contexto no se pierda entre sesiones.

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
