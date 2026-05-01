import React from "react";
import StatCard from "./stat-card";
import { BookOpenText, CircleCheckBig, Clock, TrendingUp, Loader2 } from "lucide-react";
import BehavioralProfile from "./behavioral-profile";

import { useSessionId } from "@/hooks/useSession";
import { useMyProfile } from "@/hooks/useProfile";
import { useProfileEnrollments } from "@/hooks/useEnrollments";

export const ProfileRecap: React.FC = () => {
  const profileId = useSessionId();

  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useMyProfile();
  const { data: enrollments = [], isLoading: isEnrollmentsLoading, isError: isEnrollmentsError } = useProfileEnrollments(profileId || "");

  const assignedCourses = enrollments.length;
  const completedCourses = enrollments.filter(
    (e: any) => e.status === "COMPLETED" || (e.status == null && e.progress >= 100),
  ).length;
  const inProgressCourses = enrollments.filter(
    (e: any) =>
      e.status === "IN_PROGRESS" ||
      (e.status == null && e.progress > 0 && e.progress < 100),
  ).length;

  const renderStat = (value: number | string) => {
    if (isEnrollmentsLoading) return <Loader2 className="animate-spin text-gray-400 w-6 h-6" />;
    if (isEnrollmentsError) return <span className="text-red-500 text-lg">Error</span>;
    return value;
  };

  const mockRiskScore = 20;
  const mockReactionIndex = 75;
  const mockProceduralDiscipline = 60;
  const userName = isProfileError ? "Usuario" : (profile?.firstName || "Usuario");

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 md:gap-8 px-4 py-2 md:px-16 md:py-4">
      {/* User Greeting and Summary */}
      <div className="flex flex-col w-full items-start gap-2">
        <h1 className="text-xl font-semibold text-gray-800 md:text-4xl flex items-center gap-2">
          ¡Bienvenido, {isProfileLoading ? <Loader2 className="animate-spin text-gray-500 w-8 h-8" /> : userName}!
        </h1>
        <p className="text-gray-500 md:text-lg">
          Continúa tu capacitación y mejora tu perfil conductual
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard
          label="Cursos Asignados"
          stat={<h1>{renderStat(assignedCourses)}</h1>}
          icon={<BookOpenText className="text-blue-600" />}
          gradientColor="from-blue-500 to-blue-700"
        />
        <StatCard
          label="En Progreso"
          stat={<h1>{renderStat(inProgressCourses)}</h1>}
          icon={<Clock className="text-yellow-500" />}
          gradientColor="from-yellow-500 to-yellow-700"
        />
        <StatCard
          label="Completados"
          stat={<h1>{renderStat(completedCourses)}</h1>}
          icon={<CircleCheckBig className="text-green-500" />}
          gradientColor="from-green-500 to-green-700"
        />
        <StatCard
          label="Puntaje de Riesgo"
          stat={
            <div className="flex gap-1 items-center">
              <h1>{mockRiskScore}</h1>
              <p className="text-gray-400 text-lg font-normal">/100</p>
            </div>
          }
          icon={<TrendingUp className="text-red-500" />}
          gradientColor="from-red-500 to-red-700"
        />
      </div>

      {/* Behavioral Profile Summary */}
      <BehavioralProfile
        riskScore={mockRiskScore}
        reactionIndex={mockReactionIndex}
        proceduralDiscipline={mockProceduralDiscipline}
      />
    </div>
  );
};

export default ProfileRecap;
