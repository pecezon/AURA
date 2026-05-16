# SS101 Simulation Design Document

## Visión General
Diseño técnico para la primera simulación interactiva del curso SS101 (Identificación de peligros y riesgos) para la plataforma AURA.

## Frontend (UI y Tracking)
- **Layout Visual**: Panel Dividido (Split View). La imagen interactiva ocupa el 70% del ancho, mientras que un panel lateral estático ocupa el 30% restante con instrucciones, temporizador y el botón de enviar. Usaremos Tailwind CSS.
- **Interacción (Free Pins)**: Los usuarios colocarán "marcadores libres" neutrales sobre la imagen. Tienen la libertad de mover o eliminar estos marcadores antes de enviar.
- **Tracking de Eventos**: Un Custom Hook `useSimulationTracker` registrará un log de todas las acciones del usuario, permitiendo capturar el nivel de "indecisión":
  - `{ type: "PLACE_PIN", id: "p1", x: 45, y: 50, timestamp: 1234567 }`
  - `{ type: "REMOVE_PIN", id: "p1", timestamp: 1234580 }`
- **Feedback Diferido**: La validación (correcto/incorrecto) solo se revelará tras hacer clic en "Finalizar".

## Backend (Scoring y Base de Datos)
- **Base de Datos (Prisma)**:
  - `Simulation.configuration`: Almacenará `{ imageUrl, timeLimit, hotspots: [{ id, x, y, radius, riskType }] }`
  - `SimulationAttempt.events`: Almacenará el log JSON generado por el frontend.
- **Motor de Scoring Híbrido**:
  - **Fase Heurística**: Cálculo matemático de aciertos (coordenadas dentro del radio), omisiones (-20 pts), indecisión por pines removidos (-5 pts), y penalización de tiempo.
  - **Fase Analítica (LLM)**: Se enviará un prompt a OpenAI incluyendo los eventos del usuario (ej. cuánto tardó entre clics, cuántos pines eliminó). OpenAI devolverá una evaluación cualitativa de la confianza del usuario, la cual se mostrará en el dashboard.
