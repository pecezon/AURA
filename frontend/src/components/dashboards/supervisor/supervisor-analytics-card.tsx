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

const riskData = [
  { name: "Alto Riesgo", value: 1, color: "#ef4444" },
  { name: "Riesgo Medio", value: 2, color: "#f97316" },
  { name: "Bajo Riesgo", value: 4, color: "#10b981" },
];

const indicators = [
  { label: "Risk Score Promedio", value: 72, max: 100 },
  { label: "Índice de Reacción Promedio", value: 78, max: 100 },
  { label: "Disciplina Procedural Promedio", value: 84, max: 100 },
];

const improvements = [
  {
    icon: <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />,
    title: "Tiempo de Reacción Bajo Presión",
    description:
      "1 trabajador muestra tiempos de reacción por debajo del promedio. Recomendado: simulaciones adicionales.",
    variant: "danger" as const,
  },
  {
    icon: <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />,
    title: "Omisión de Pasos Críticos",
    description:
      "Patrón detectado en escenarios de espacios confinados. Sugerencia: reforzar protocolos LOTO.",
    variant: "warning" as const,
  },
  {
    icon: <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />,
    title: "Fortaleza: Cumplimiento Normativo",
    description:
      "El equipo muestra excelente adherencia a normas NOM-029-STPS-2011.",
    variant: "success" as const,
  },
];

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
                      {riskData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-3 text-sm">
                <div className="text-red-500 font-medium">
                  Alto Riesgo (&lt;70): 1
                </div>
                <div className="text-green-500 font-medium">
                  Bajo Riesgo (≥85): 0
                </div>
                <div className="text-orange-500 font-medium">
                  Riesgo Medio (70–85): 1
                </div>
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
                  <span className="text-red-500 font-semibold">1</span>
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
