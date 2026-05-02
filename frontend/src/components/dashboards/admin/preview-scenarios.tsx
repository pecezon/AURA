import React from "react";
import { type Scenario } from "./types/course.types";

interface PreviewScenariosProps {
  scenarios: Scenario[];
}

/**
 * Lista de escenarios de simulación generados por la IA.
 * Renderiza null si no hay escenarios para evitar espacio vacío.
 */
export const PreviewScenarios: React.FC<PreviewScenariosProps> = ({ scenarios }) => {
  if (!scenarios.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">⚠️</span>
        <span className="text-lg font-semibold">
          Escenarios de Simulación ({scenarios.length})
        </span>
      </div>
      {scenarios.map((scenario, idx) => (
        <div
          key={idx}
          className="bg-purple-50 border border-purple-200 p-4 rounded-lg space-y-2"
        >
          <h4 className="font-semibold text-purple-900">¿{scenario.question}?</h4>
          <p className="text-sm text-purple-700">{scenario.description}</p>
        </div>
      ))}
    </div>
  );
};
