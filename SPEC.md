# Especificaciones del Proyecto (SPEC.md)

Este documento sirve como la única fuente de verdad para los requerimientos, la arquitectura y el diseño del sistema del proyecto AURA.

## Visión General
**AURA (Adaptive Understanding of Risk in Action)** es una plataforma digital de capacitación inteligente diseñada para transformar la formación técnica y de seguridad industrial. No reemplaza los programas actuales, sino que los potencia mediante una capa de inteligencia que evalúa conocimientos y la toma de decisiones bajo presión operativa. Está diseñada para empresas con altos estándares de seguridad, como Sempra Infraestructura.

## Arquitectura del Sistema
- **Estructura**: Monorepo lógico separado en directorios `frontend` y `backend`.
- **Frontend**: Aplicación del lado del cliente construida con React y empaquetada con Vite.
- **Backend**: Servidor API construido en Node.js (TypeScript).
- **Base de Datos**: PostgreSQL interactuando mediante Prisma ORM.

## Capas de la Solución
1. **Capa de Aprendizaje**: Cursos estructurados, módulos interactivos y evaluaciones.
2. **Capa de Simulación**: Escenarios realistas con toma de decisiones bajo presión, registro de tiempos, cambios y omisiones.
3. **Capa de Inteligencia Conductual**: Motor de scoring que genera el "Risk Score", índice de reacción y nivel de disciplina.
4. **Capa de Generación Asistida por IA**: Generación de borradores de escenarios, variaciones y sugerencias adaptativas.

## Requerimientos Principales y Estado de Implementación (Hitos)

### Fase 1: Planeación y Diseño
- [x] Definición de alcance del MVP.
- [x] Arquitectura técnica.
- [x] Diseño de flujos de usuario.
- [x] Definición del modelo de datos.
- [x] Wireframes iniciales.

### Fase 2: Desarrollo Base
- [x] Sistema de autenticación y roles (Trabajador, Supervisor, Administrador).
- [x] Módulo de cursos y progreso.
- [x] Base de datos estructurada.
- [x] Integración frontend-backend.

### Fase 3: Simulación e IA
- [x] Desarrollo de simulación 1 (Estación de Compresión SS101).
- [x] Captura estructurada de eventos (Tiempos de reacción, adición/remoción de pines y timestamps).
- [x] Implementación del motor de scoring conductual (Risk Score asistido por IA).
- [ ] Generación de perfil individual.
- [ ] Tarea Próxima Sesión: Hacer que el análisis conductual de la IA también tome en cuenta los errores específicos cometidos durante la simulación (pines incorrectos u omisiones específicas).

### Fase 4: Dashboard y Generación de Contenido
- [ ] Dashboard para supervisor. *(Nota: Archivo creado, falta lógica y métricas reales)*
- [ ] Visualización de métricas básicas.
- [ ] Módulo experimental de generación asistida de escenarios mediante IA.

### Fase 5: Pulido y Presentación
- [ ] Refinamiento de UX/UI.
- [ ] Optimización de performance.
- [ ] Preparación de demo funcional.

## Roles y Flujos de Usuario
- **Trabajador**: Login, perfil, consumo de cursos teóricos, simulaciones interactivas y retroalimentación.
- **Supervisor**: Dashboard, análisis de perfiles de su equipo y asignación de cursos adicionales.
- **Administrador (Creador)**: Generación de contenido asistida por IA, publicación de módulos y normativas.

## Modelos de Datos Principales (Prisma Schema)
- `Profile`: Usuarios y roles (`EMPLOYEE`, `ADMIN`, `OWNER`).
- `Course` & `Module`: Estructura principal de la capa de aprendizaje.
- `Simulation` & `SimulationAttempt`: Manejo de la capa de simulación.
- `Quiz` & `Question`: Evaluaciones teóricas (con bandera `isGeneratedByAI`).
- `CourseEnrollment`: Seguimiento de progreso.
- `Regulation`: Normativas industriales vinculadas a cursos (Ej: NOM-029).

## Tareas en Curso (Sprints)

### Task: Implementar Simulación SS101 – Identificación de peligros y riesgos

**📌 Descripción**
Desarrollar la primera simulación interactiva del curso SS101, donde el usuario deberá identificar peligros dentro de un escenario visual (imagen) mediante hotspots clicables.
La simulación debe evaluar:
- Identificación correcta de riesgos
- Omisión de riesgos
- Tiempo de respuesta
- Cambios de decisión (indecisión)
Los eventos generados serán enviados al backend para calcular el Risk Score según el modelo definido.

**🎯 Objetivo**
Contar con una simulación funcional end-to-end (frontend + backend) que:
- Renderice una escena con múltiples riesgos
- Capture eventos del usuario
- Calcule y devuelva un Risk Score

**✅ Criterios de aceptación**
- [x] El usuario puede ver una imagen con al menos 3–5 riesgos (Estación de Compresión).
- [x] Puede seleccionar hotspots sobre la imagen mediante marcadores clicables.
- [x] Se registra el tiempo de cada interacción (adición/remoción de pines).
- [x] Se almacenan eventos estructurados en formato JSON.
- [x] Se envía la simulación al backend y se recibe un Risk Score.
- [x] Se muestra retroalimentación interactiva y justificada (éxitos + omisiones, score visual y análisis conductual por IA).

**🔧 Subtareas**
- [x] **🎨 1. Diseño de la simulación:** Definición de escenario fotorrealista generado por IA e inyección en BD.
- [x] **🗄️ 2. Configuración en base de datos:** Inyección del JSON con la configuración base de hotspots, imageUrl y justificaciones.
- [x] **⚙️ 3. Backend – Scoring:** Lógica euclidiana y penalizaciones por tiempo/indecisión en scoring.service.ts + integración con OpenAI.
- [x] **💻 4. Frontend – Simulation Engine:** Split-view visual responsivo en simulation-engine.tsx con hotspots interactivos.
- [x] **📡 5. Tracking de eventos:** Registro y encapsulado preciso en JSON de todos los clicks y timestamps.
- [x] **🔗 6. Integración frontend-backend:** Mutaciones robustas con TanStack Query y manejo de errores 404 al vincular IDs del curso.
- [x] **📊 7. Resultados y feedback:** Pantalla de análisis detallado por IA con Loader2 y visualizadores dinámicos.

## Futuras Mejoras (Lluvia de Ideas)
- Badges por completar sets de habilidades.
- Certificados automáticos (PDFKit).
- Importación/Exportación de reportes (csv-parser).
- IA Conductual Avanzada: Tomar en cuenta los errores específicos cometidos durante la simulación (pines incorrectos u omisiones específicas).
