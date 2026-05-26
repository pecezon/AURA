import React from "react";
import { Award } from "lucide-react";
import { StatProgressBar } from "./stat-progress-bar";

interface BehavioralProfileProps {
  riskScore?: number | null;
  reactionIndex?: number | null;
  proceduralDiscipline?: number | null;
}

const BehavioralProfile: React.FC<BehavioralProfileProps> = ({
  riskScore,
  reactionIndex,
  proceduralDiscipline,
}) => {
  if (riskScore === null || riskScore === undefined) {
    return (
      <div className="w-full bg-gradient-to-br from-electric-royal-50 to-slate-indigo-50 border border-blue-300 rounded-lg shadow p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1 text-blue-600 font-bold text-xl">
          i
        </div>
        <h3 className="text-md font-bold text-gray-800">Perfil en Desarrollo</h3>
        <p className="text-sm text-gray-600 max-w-sm">
          Tu perfil conductual se generará una vez que realices tu primera actividad.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-electric-royal-50 to-slate-indigo-50 border border-blue-300 rounded-lg shadow p-4 flex flex-col items-start gap-4 px-6">
      <div className="flex gap-1 flex-col items-start w-full">
        <div className="flex justify-between items-center gap-1">
          <Award className="text-blue-500" />
          <h3 className="text-md text-gray-900 font-medium md:text-xl">
            Tu Perfil Conductual
          </h3>
        </div>
        <p className="text-gray-600 text-sm md:text-base">
          Análisis basado en tus simulaciones completadas
        </p>
      </div>

      <StatProgressBar label="Risk Score" value={riskScore || 0} max={100} />
      <StatProgressBar
        label="Índice de Reacción"
        value={reactionIndex || 0}
        max={100}
      />
      <StatProgressBar
        label="Disciplina Procedimental"
        value={proceduralDiscipline || 0}
        max={100}
      />
    </div>
  );
};

export default BehavioralProfile;
