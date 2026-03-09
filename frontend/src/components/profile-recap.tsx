import React from "react";
import StatCard from "./stat-card";
import { BookOpenText, CircleCheckBig, Clock, TrendingUp } from "lucide-react";
import BehavioralProfile from "./behavioral-profile";

const mockUserData = {
  name: "Diego Lopez",
  assignedCourses: 5,
  inProgressCourses: 3,
  completedCourses: 2,
  riskScore: 20,
  reactionIndex: 75,
  proceduralDiscipline: 60,
};

export const ProfileRecap: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 md:gap-8 px-4 py-2 md:px-16 md:py-4">
      {/* User Greeting and Summary */}
      <div className="flex flex-col w-full items-start gap-2">
        <h1 className="text-xl font-semibold text-gray-800 md:text-4xl">
          ¡Bienvenido, {mockUserData.name}!
        </h1>
        <p className="text-gray-500 md:text-lg">
          Continúa tu capacitación y mejora tu perfil conductual
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard
          label="Cursos Asignados"
          stat={<h1>{mockUserData.assignedCourses}</h1>}
          icon={<BookOpenText className="text-blue-600" />}
          gradientColor="from-blue-500 to-blue-700"
        />
        <StatCard
          label="En Progreso"
          stat={<h1>{mockUserData.inProgressCourses}</h1>}
          icon={<Clock className="text-yellow-500" />}
          gradientColor="from-yellow-500 to-yellow-700"
        />
        <StatCard
          label="Completados"
          stat={<h1>{mockUserData.completedCourses}</h1>}
          icon={<CircleCheckBig className="text-green-500" />}
          gradientColor="from-green-500 to-green-700"
        />
        <StatCard
          label="Puntaje de Riesgo"
          stat={
            <div className="flex gap-1 items-center">
              <h1>{mockUserData.riskScore}</h1>
              <p className="text-gray-400 text-lg font-normal">/100</p>
            </div>
          }
          icon={<TrendingUp className="text-red-500" />}
          gradientColor="from-red-500 to-red-700"
        />
      </div>

      {/* Behavioral Profile Summary */}
      <BehavioralProfile
        riskScore={mockUserData.riskScore}
        reactionIndex={mockUserData.reactionIndex}
        proceduralDiscipline={mockUserData.proceduralDiscipline}
      />
    </div>
  );
};

export default ProfileRecap;
