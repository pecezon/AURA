import React from "react";
import StatCard from "../stat-card";
import { Users, Award, TriangleAlert, CircleCheckBig } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { SupervisorTeamRecap } from "./supervisor-team-recap";
import { SupervisorCoursesSection } from "./supervisor-courses-section";
import { SupervisorAnalyticsCard } from "./supervisor-analytics-card";

import { useAllProfiles } from "@/hooks/useProfile";
import { useCourses } from "@/hooks/useCourses";
import { useEnrollments } from "@/hooks/useEnrollments";
import { Skeleton } from "@/components/ui/skeleton";

export const SupervisorProfileRecap: React.FC = () => {
  const { data: profiles, isLoading: isLoadingProfiles } = useAllProfiles();
  const { data: courses, isLoading: isLoadingCourses } = useCourses();
  const { isLoading: isLoadingEnrollments } = useEnrollments();

  const isLoading = isLoadingProfiles || isLoadingCourses || isLoadingEnrollments;


  const employeeProfiles = profiles?.filter((p: any) => p.role === "EMPLOYEE") || [];

  const totalWorkers = employeeProfiles.length;
  const availableCourses = courses?.length || 0;

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4 md:gap-8 px-4 py-2 md:px-16 md:py-4">
        {/* User Greeting Skeleton */}
        <div className="flex flex-col w-full items-start gap-2">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <Skeleton className="h-28 w-full rounded-xl animate-pulse" />
          <Skeleton className="h-28 w-full rounded-xl animate-pulse" />
          <Skeleton className="h-28 w-full rounded-xl animate-pulse" />
          <Skeleton className="h-28 w-full rounded-xl animate-pulse" />
        </div>

        {/* Tabs and Tab Content Skeleton */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }


  // Filtrar empleados que posean un Risk Score calculado (no nulo)
  const activeWorkers = employeeProfiles.filter(
    (p: any) => p.behavioralProfile?.riskScore !== null && p.behavioralProfile?.riskScore !== undefined
  );

  const avgRiskScore = activeWorkers.length > 0
    ? Math.round(activeWorkers.reduce((acc: number, p: any) => acc + p.behavioralProfile.riskScore, 0) / activeWorkers.length)
    : "N/A";

  const highRiskCount = employeeProfiles.filter(
    (p: any) => p.behavioralProfile?.riskScore !== null && p.behavioralProfile?.riskScore !== undefined && p.behavioralProfile.riskScore < 40
  ).length;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 md:gap-8 px-4 py-2 md:px-16 md:py-4">
      {/* User Greeting and Summary */}
      <div className="flex flex-col w-full items-start gap-2">
        <h1 className="text-xl font-semibold text-gray-800 md:text-4xl">
          ¡Bienvenido al Dashboard de Supervisor!
        </h1>
        <p className="text-gray-500 md:text-lg">
          Análisis de desempeño y riesgo del equipo
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard
          label="Total Trabajadores"
          stat={<h1>{totalWorkers}</h1>}
          icon={<Users className="text-blue-600" />}
          gradientColor="from-blue-500 to-blue-700"
        />
        <StatCard
          label="Risk Score Promedio"
          stat={
            <h1>
              {avgRiskScore}
              {avgRiskScore !== "N/A" && <span className="text-gray-400 text-lg font-normal">/100</span>}
            </h1>
          }
          icon={<Award className="text-purple-500" />}
          gradientColor="from-purple-500 to-purple-700"
        />
        <StatCard
          label="Alto Riesgo"
          stat={<h1>{highRiskCount}</h1>}
          icon={<TriangleAlert className="text-red-500" />}
          gradientColor="from-red-500 to-red-700"
        />
        <StatCard
          label="Cursos Disponibles"
          stat={<h1>{availableCourses}</h1>}
          icon={<CircleCheckBig className="text-green-500" />}
          gradientColor="from-green-500 to-green-700"
        />
      </div>
      <Tabs defaultValue="team" className="w-full flex flex-col gap-2 md:gap-6">
        <TabsList className="bg-gray-200 flex gap-2">
          <TabsTrigger value="team" className="cursor-pointer">
            Equipo
          </TabsTrigger>
          <TabsTrigger value="courses" className="cursor-pointer">
            Cursos
          </TabsTrigger>
          <TabsTrigger value="analytics" className="cursor-pointer">
            Análisis
          </TabsTrigger>
        </TabsList>

        {/* Team Tab Content */}
        <TabsContent value="team">
          <SupervisorTeamRecap />
        </TabsContent>

        {/* Courses Tab Content */}
        <TabsContent value="courses">
          <SupervisorCoursesSection />
        </TabsContent>

        {/* Analytics Tab Content */}
        <TabsContent value="analytics">
          <SupervisorAnalyticsCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupervisorProfileRecap;
