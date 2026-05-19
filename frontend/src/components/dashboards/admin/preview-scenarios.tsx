import React from "react";
import { Sparkles, Info } from "lucide-react";

interface PreviewScenariosProps {
  hasSimulation: boolean;
  simulationTitle?: string;
}

export const PreviewScenarios: React.FC<PreviewScenariosProps> = ({
  hasSimulation,
  simulationTitle
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <span className="text-lg font-semibold text-gray-900">
          Escenario de Simulación Práctica
        </span>
      </div>
      {hasSimulation ? (
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg flex items-start gap-3 shadow-sm">
          <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-purple-900">
              {simulationTitle || "Simulación de Práctica Industrial (SS101)"}
            </h4>
            <p className="text-sm text-purple-700">
              Esta simulación interactiva está cargada en el sistema. Se ejecutará al final del curso de manera inmersiva para evaluar el desempeño y la identificación de riesgos en tiempo real del trabajador.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-gray-800">
              Sin Simulación Asignada
            </h4>
            <p className="text-sm text-gray-500">
              No se ha seleccionado ninguna simulación práctica interactiva. Si lo deseas, puedes seleccionar algún escenario de simulación cargado en el sistema desde el formulario de creación para enriquecer el curso.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
