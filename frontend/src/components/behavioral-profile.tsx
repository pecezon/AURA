import React from "react";
import { Award } from "lucide-react";
import { StatProgressBar } from "./stat-progress-bar";

interface BehavioralProfileProps {
  riskScore?: number;
  reactionIndex?: number;
  proceduralDiscipline?: number;
}

const BehavioralProfile: React.FC<BehavioralProfileProps> = ({
  riskScore,
  reactionIndex,
  proceduralDiscipline,
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-electric-royal-50 to-slate-indigo-50 border-blue-200 border border-blue-300 rounded-lg shadow p-4 flex flex-col items-start gap-4 px-6">
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
        label="Reaction Index"
        value={reactionIndex || 0}
        max={100}
      />
      <StatProgressBar
        label="Procedural Discipline"
        value={proceduralDiscipline || 0}
        max={100}
      />
    </div>
  );
};

export default BehavioralProfile;
