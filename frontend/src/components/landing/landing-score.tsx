import LandingScoreCard from "./landing-score-card";

const SCORES = [
  {
    label: "Risk Score",
    value: 78,
    color: "blue" as const,
    description: "Evaluación integral del perfil de riesgo conductual",
  },
  {
    label: "Índice de Reacción",
    value: 85,
    color: "blue" as const,
    description: "Velocidad y precisión de decisión bajo presión operativa",
  },
  {
    label: "Disciplina Procedural",
    value: 92,
    color: "green" as const,
    description: "Cumplimiento de pasos críticos en secuencia correcta",
  },
];

export default function LandingScore() {
  return (
    <div id="scoring" className="w-full bg-gray-50 py-16 px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        {/* Left: Copy */}
        <div className="flex flex-col gap-4 flex-1">
          <p className="text-red-500 font-semibold text-xs uppercase tracking-widest">
            Motor de Scoring
          </p>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            Más allá del examen tradicional
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Las evaluaciones estándar miden memorización. AURA mide
            comportamiento real — cómo decide un trabajador cuando hay presión,
            tiempo y consecuencias.
          </p>
        </div>

        {/* Right: Score cards */}
        <div className="flex flex-col gap-4 flex-1 w-full">
          {SCORES.map((score) => (
            <LandingScoreCard key={score.label} {...score} />
          ))}
        </div>
      </div>
    </div>
  );
}
