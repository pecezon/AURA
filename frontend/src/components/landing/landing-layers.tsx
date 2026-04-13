// LandingLayers.tsx
import { BookOpen, AlertTriangle, Brain, Sparkles } from "lucide-react";
import LandingLayersCard from "./landing-layers-card";

const LAYERS = [
  {
    layer: 1,
    icon: BookOpen,
    title: "Aprendizaje",
    description:
      "Cursos estructurados por rol con módulos teóricos interactivos y evaluaciones de conocimiento. Base sólida antes de la simulación.",
    tags: ["Cursos por rol", "Módulos teóricos", "Quizzes"],
  },
  {
    layer: 2,
    icon: AlertTriangle,
    title: "Simulación",
    description:
      "Escenarios dinámicos donde el usuario toma decisiones bajo presión operativa real. Se registran secuencia, tiempos y omisiones.",
    tags: ["Decisiones bajo presión", "Tiempo de reacción"],
  },
  {
    layer: 3,
    icon: Brain,
    title: "Inteligencia Conductual",
    description:
      "Motor de scoring que convierte eventos en Risk Score, Índice de Reacción y Disciplina Procedural. Detecta patrones de vulnerabilidad que los exámenes no ven.",
    tags: ["Risk Score", "Perfil acumulativo", "Patrones"],
  },
  {
    layer: 4,
    icon: Sparkles,
    title: "Generación con IA",
    description:
      "La IA genera borradores de escenarios, sugiere preguntas evaluativas y adapta el contenido según el desempeño individual del trabajador.",
    tags: ["Escenarios automáticos", "Contenido adaptativo"],
  },
];

export default function LandingLayers() {
  return (
    <div id="layers" className="w-full px-8 py-16 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 mb-10">
          <p className="text-red-400 font-semibold text-xs uppercase tracking-widest">
            ARQUITECTURA DE LA SOLUCIÓN
          </p>
          <h2 className="text-3xl font-bold text-black">
            Cuatro capas de inteligencia
          </h2>
          <p className="text-gray-400 text-xs leading-relaxed max-w-md">
            AURA no es solo ver videos. Es una plataforma que mide el
            comportamiento real del trabajador ante situaciones de riesgo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LAYERS.map((layer) => (
            <LandingLayersCard key={layer.layer} {...layer} />
          ))}
        </div>
      </div>
    </div>
  );
}
