import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AlertTriangle, TrendingDown, CheckCircle } from "lucide-react";

import { useAllProfiles } from "@/hooks/useProfile";

const variantStyles = {
  danger: {
    border: "border-red-200",
    bg: "bg-red-50",
    title: "text-red-700",
    desc: "text-red-500",
  },
  warning: {
    border: "border-orange-200",
    bg: "bg-orange-50",
    title: "text-orange-600",
    desc: "text-orange-500",
  },
  success: {
    border: "border-green-200",
    bg: "bg-green-50",
    title: "text-green-600",
    desc: "text-green-500",
  },
};

export const SupervisorAnalyticsCard: React.FC = () => {
  const { data: profiles = [] } = useAllProfiles();
  const employeeProfiles = profiles.filter((p: any) => p.role === "EMPLOYEE");

  // 1. Distribución de Riesgo
  const activeWorkers = employeeProfiles.filter(
    (p: any) => p.behavioralProfile?.riskScore !== null && p.behavioralProfile?.riskScore !== undefined
  );

  const altoRiesgoCount = employeeProfiles.filter(
    (p: any) => p.behavioralProfile?.riskScore !== null && p.behavioralProfile?.riskScore < 40
  ).length;

  const medioRiesgoCount = employeeProfiles.filter(
    (p: any) => p.behavioralProfile?.riskScore !== null && p.behavioralProfile?.riskScore >= 40 && p.behavioralProfile?.riskScore < 70
  ).length;

  const bajoRiesgoCount = employeeProfiles.filter(
    (p: any) => p.behavioralProfile?.riskScore !== null && p.behavioralProfile?.riskScore >= 70
  ).length;

  const riskData = [
    { name: "Alto Riesgo", value: altoRiesgoCount, color: "#ef4444" },
    { name: "Riesgo Medio", value: medioRiesgoCount, color: "#f97316" },
    { name: "Bajo Riesgo", value: bajoRiesgoCount, color: "#10b981" },
  ];

  // 2. Indicadores Clave Promedio
  const avgRisk = activeWorkers.length > 0
    ? Math.round(activeWorkers.reduce((acc: number, p: any) => acc + p.behavioralProfile.riskScore, 0) / activeWorkers.length)
    : 0;

  const activeReactionWorkers = employeeProfiles.filter(
    (p: any) => p.behavioralProfile?.reactionIndex !== null && p.behavioralProfile?.reactionIndex !== undefined
  );
  const avgReaction = activeReactionWorkers.length > 0
    ? Math.round(activeReactionWorkers.reduce((acc: number, p: any) => acc + p.behavioralProfile.reactionIndex, 0) / activeReactionWorkers.length)
    : 0;

  const activeDisciplineWorkers = employeeProfiles.filter(
    (p: any) => p.behavioralProfile?.proceduralDiscipline !== null && p.behavioralProfile?.proceduralDiscipline !== undefined
  );
  const avgDiscipline = activeDisciplineWorkers.length > 0
    ? Math.round(activeDisciplineWorkers.reduce((acc: number, p: any) => acc + p.behavioralProfile.proceduralDiscipline, 0) / activeDisciplineWorkers.length)
    : 0;

  const indicators = [
    { label: "Risk Score Promedio", value: avgRisk, max: 100 },
    { label: "Índice de Reacción Promedio", value: avgReaction, max: 100 },
    { label: "Disciplina Procedimental Promedio", value: avgDiscipline, max: 100 },
  ];

  // 3. Áreas de Mejora Dinámicas
  const slowReactionWorkers = employeeProfiles.filter(
    (p: any) => p.behavioralProfile?.reactionIndex !== null && p.behavioralProfile?.reactionIndex < 60
  ).length;

  const lowDisciplineWorkers = employeeProfiles.filter(
    (p: any) => p.behavioralProfile?.proceduralDiscipline !== null && p.behavioralProfile?.proceduralDiscipline < 70
  ).length;

  const improvements = [];

  if (slowReactionWorkers > 0) {
    improvements.push({
      icon: <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />,
      title: "Tiempo de Reacción Bajo Presión",
      description: `${slowReactionWorkers} trabajador(es) muestra(n) tiempos de reacción por debajo del promedio. Recomendado: simulaciones adicionales.`,
      variant: "danger" as const,
    });
  } else {
    improvements.push({
      icon: <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />,
      title: "Tiempo de Reacción Óptimo",
      description: "Todo el equipo muestra tiempos de reacción adecuados bajo presión.",
      variant: "success" as const,
    });
  }

  if (lowDisciplineWorkers > 0) {
    improvements.push({
      icon: <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />,
      title: "Disciplina Procedimental Baja",
      description: `Patrón de omisión de pasos detectado en ${lowDisciplineWorkers} trabajador(es). Sugerencia: reforzar simulaciones guiadas.`,
      variant: "warning" as const,
    });
  } else {
    improvements.push({
      icon: <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />,
      title: "Disciplina Procedimental Excelente",
      description: "El equipo muestra una excelente adherencia a los pasos y secuencias reguladas.",
      variant: "success" as const,
    });
  }

  // Agregar fortaleza general NOM
  improvements.push({
    icon: <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />,
    title: "Fortaleza: Cumplimiento Normativo",
    description: "El equipo muestra excelente adherencia general a normas NOM-029-STPS-2011.",
    variant: "success" as const,
  });

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">
              Distribución de Riesgo
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Clasificación del equipo por nivel de riesgo conductual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-6">
              {/* Pie Chart */}
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={65}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {riskData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-3 text-sm">
                {riskData.map((entry) => {
                  let textColor = "";
                  if (entry.name === "Alto Riesgo") {
                    textColor = "text-red-500";
                  } else if (entry.name === "Riesgo Medio") {
                    textColor = "text-orange-500";
                  } else if (entry.name === "Bajo Riesgo") {
                    textColor = "text-green-500";
                  }
                  return (
                    <div
                      key={entry.name}
                      className={`${textColor} font-medium`}
                    >
                      {entry.name}: {entry.value}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">
              Indicadores Clave
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Métricas promedio del equipo
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {indicators.map((ind) => (
              <div key={ind.label} className="flex flex-col gap-1">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>{ind.label}</span>
                  <span className="font-medium">
                    {ind.value}/{ind.max}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full"
                    style={{ width: `${(ind.value / ind.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Alert */}
            <div className="flex items-start pt-4 border-t border-gray-100">
              <div className="text-sm">
                <div className="flex gap-1 items-center">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700">
                    Trabajadores de Alto Riesgo:{" "}
                  </span>
                  <span className="text-red-500 font-semibold">{altoRiesgoCount}</span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">
                  Requieren capacitación adicional y seguimiento cercano
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800">
            Áreas de Mejora Identificadas
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Recomendaciones basadas en análisis conductual
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {improvements.map((item) => {
            const styles = variantStyles[item.variant];
            return (
              <div
                key={item.title}
                className={`flex items-start gap-3 px-3 py-5 rounded-lg border ${styles.bg} ${styles.border}`}
              >
                {item.icon}
                <div>
                  <p
                    className={`text-sm md:text-base font-semibold ${styles.title}`}
                  >
                    {item.title}
                  </p>
                  <p className={`text-xs md:text-sm mt-0.5 ${styles.desc}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupervisorAnalyticsCard;
