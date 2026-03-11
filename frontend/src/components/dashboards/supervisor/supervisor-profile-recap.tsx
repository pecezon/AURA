import React from "react";
import StatCard from "../stat-card";
import { Users, Award, TriangleAlert, CircleCheckBig } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockUserData = {
  name: "Diego Lopez",
  team: "Equipo A",
  availableCourses: 20,
  workers: [
    {
      name: "Trabajador 1",
      email: "trabajador1@empresa.com",
      assignedCourses: 5,
      inProgressCourses: 3,
      completedCourses: 2,
      riskScore: 98,
      reactionIndex: 75,
      proceduralDiscipline: 60,
    },
    {
      name: "Trabajador 2",
      email: "trabajador2@empresa.com",
      assignedCourses: 5,
      inProgressCourses: 3,
      completedCourses: 2,
      riskScore: 20,
      reactionIndex: 75,
      proceduralDiscipline: 60,
    },
    {
      name: "Trabajador 3",
      email: "trabajador3@empresa.com",
      assignedCourses: 5,
      inProgressCourses: 3,
      completedCourses: 2,
      riskScore: 98,
      reactionIndex: 33,
      proceduralDiscipline: 80,
    },
  ],
};

export const SupervisorProfileRecap: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 md:gap-8 px-4 py-2 md:px-16 md:py-4">
      {/* User Greeting and Summary */}
      <div className="flex flex-col w-full items-start gap-2">
        <h1 className="text-xl font-semibold text-gray-800 md:text-4xl">
          ¡Bienvenido al Dashboard de Supervisor!
        </h1>
        <p className="text-gray-500 md:text-lg">
          {`Análisis de desempeño y riesgo del equipo - ${mockUserData.team}`}
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard
          label="Total Trabajadores"
          stat={<h1>{mockUserData.workers.length}</h1>}
          icon={<Users className="text-blue-600" />}
          gradientColor="from-blue-500 to-blue-700"
        />
        <StatCard
          label="Risk Score Promedio"
          stat={
            <h1>
              {mockUserData.workers.reduce(
                (acc, worker) => acc + worker.riskScore,
                0,
              ) / mockUserData.workers.length || 0}
            </h1>
          }
          icon={<Award className="text-purple-500" />}
          gradientColor="from-purple-500 to-purple-700"
        />
        <StatCard
          label="Alto Riesgo"
          stat={
            <h1>
              {mockUserData.workers.filter((w) => w.riskScore > 50).length}
            </h1>
          }
          icon={<TriangleAlert className="text-red-500" />}
          gradientColor="from-red-500 to-red-700"
        />
        <StatCard
          label="Cursos Disponibles"
          stat={<h1>{mockUserData.availableCourses}</h1>}
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
            Analisis
          </TabsTrigger>
        </TabsList>
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Team Card Description</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Team Card Content
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Courses</CardTitle>
              <CardDescription>Courses Card Description</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Courses Card Content
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Analytics Card Description</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Analytics Card Content
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupervisorProfileRecap;
