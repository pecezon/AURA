import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Sparkles, Wand2, CheckCircle, Upload } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  textColorClass: string;
}

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
};

export const Tutorial: React.FC = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: "Definir Tema",
      description: "El administrador especifica el tema, tipo y normativas del curso",
      icon: <Sparkles className="w-6 h-6" />,
      colorClass: "blue",
      textColorClass: "text-blue-600",
    },
    {
      number: 2,
      title: "IA Genera Estructura",
      description: "La IA crea módulos teóricos, contenido y escenarios de simulación",
      icon: <Wand2 className="w-6 h-6" />,
      colorClass: "purple",
      textColorClass: "text-purple-600",
    },
    {
      number: 3,
      title: "Revisión Manual",
      description: "El administrador ajusta, valida y refina el contenido generado",
      icon: <CheckCircle className="w-6 h-6" />,
      colorClass: "orange",
      textColorClass: "text-orange-600",
    },
    {
      number: 4,
      title: "Publicar",
      description: "El curso se publica y se asigna automáticamente a trabajadores",
      icon: <Upload className="w-6 h-6" />,
      colorClass: "green",
      textColorClass: "text-green-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cómo Funciona la Generación Asistida por IA</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const colors = colorMap[step.colorClass];
            return (
              <div key={index} className="flex flex-col items-start space-y-3">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${colors.bg} ${colors.text}`}>
                  {step.icon}
                </div>
                <div className="flex flex-col text-left space-y-1">
                  <div className="text-sm font-bold text-gray-600">Paso {step.number}</div>
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
