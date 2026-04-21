import React from "react";
import StatCard from "./stat-card";
import { BookOpenText, CircleCheckBig, Clock, TrendingUp } from "lucide-react";
import BehavioralProfile from "./behavioral-profile";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getUserId } from "@/lib/supabase";
import { useEffect, useState } from "react";

const fetchEnrollments = async (profileId: string) => {
  const response = await api.get(`api/enrollments/${profileId}`);
  if (response.status !== 200) throw new Error("Failed to fetch enrollments");
  return response.data;
};

const fetchProfile = async () => {
  const response = await api.get(`api/profile`);
  if (response.status !== 200) throw new Error("Failed to fetch profile");
  return response.data;
};

export const ProfileRecap: React.FC = () => {
  const [profileId, setProfileId] = useState<string>("");

  useEffect(() => {
    const loadProfileId = async () => {
      const id = await getUserId();
      setProfileId(id || "");
    };
    loadProfileId();
  }, []);

  const { data: profile } = useQuery({
    queryKey: ["profile", profileId],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
    enabled: !!profileId,
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["enrollments", profileId],
    queryFn: () => fetchEnrollments(profileId),
    staleTime: 0.5 * 60 * 1000,
    enabled: !!profileId,
  });

  const assignedCourses = enrollments.filter((e: any) => e.progress === 0).length;
  const completedCourses = enrollments.filter((e: any) => e.progress === 100).length;
  const inProgressCourses = enrollments.filter((e: any) => e.progress > 0 && e.progress < 100).length;

  const mockRiskScore = 20;
  const mockReactionIndex = 75;
  const mockProceduralDiscipline = 60;
  const userName = profile?.firstName || "Usuario";

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 md:gap-8 px-4 py-2 md:px-16 md:py-4">
      {/* User Greeting and Summary */}
      <div className="flex flex-col w-full items-start gap-2">
        <h1 className="text-xl font-semibold text-gray-800 md:text-4xl">
          ¡Bienvenido, {userName}!
        </h1>
        <p className="text-gray-500 md:text-lg">
          Continúa tu capacitación y mejora tu perfil conductual
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard
          label="Cursos Asignados"
          stat={<h1>{assignedCourses}</h1>}
          icon={<BookOpenText className="text-blue-600" />}
          gradientColor="from-blue-500 to-blue-700"
        />
        <StatCard
          label="En Progreso"
          stat={<h1>{inProgressCourses}</h1>}
          icon={<Clock className="text-yellow-500" />}
          gradientColor="from-yellow-500 to-yellow-700"
        />
        <StatCard
          label="Completados"
          stat={<h1>{completedCourses}</h1>}
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
