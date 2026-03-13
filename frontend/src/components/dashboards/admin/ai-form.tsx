import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Sparkles, Info } from "lucide-react";

interface AIFormData {
  topic: string;
  courseType: string;
  duration: string;
  applicableNorms: string;
}

interface AIFormProps {
  onGenerateContent?: (content: any) => void;
}

export const AIForm: React.FC<AIFormProps> = ({ onGenerateContent }) => {
  const [formData, setFormData] = useState<AIFormData>({
    topic: "",
    courseType: "Técnico",
    duration: "4",
    applicableNorms: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateMockContent = (formData: AIFormData) => {
    const modules = [
      {
        title: "Introducción y Fundamentos",
        description: `Introducción a ${formData.topic}. Conceptos básicos y principios fundamentales que todo trabajador debe conocer antes de operar en este entorno.`,
        duration: "45 min",
      },
      {
        title: "Procedimientos Operativos Estándar",
        description: `Procedimientos paso a paso para ${formData.topic}. Incluye secuencias críticas, puntos de verificación y mejores prácticas de la industria.`,
        duration: "1 hora",
      },
      {
        title: "Equipos de Seguridad y Protección",
        description: `EPP requerido y equipos de seguridad necesarios para ${formData.topic}. Uso correcto, mantenimiento y verificación pre-operacional.`,
        duration: "45 min",
      },
      {
        title: "Gestión de Emergencias",
        description: `Protocolos de respuesta ante emergencias relacionadas con ${formData.topic}. Evacuación, comunicación y procedimientos de rescate.`,
        duration: "1 hora",
      },
    ];

    const scenarios = [
      {
        question: "¿Cuál es tu primera acción?",
        description: `Durante una operación rutinaria de ${formData.topic}, detectas una anomalía en los parámetros operativos.`,
        type: "decision-based",
      },
      {
        question: "¿Cómo intervenir?",
        description: "Un compañero no sigue el procedimiento estándar de " + formData.topic + ".",
        type: "scenario-based",
      },
    ];

    return {
      title: `Curso: ${formData.topic}`,
      description: `Curso especializado en ${formData.topic}. Tipo: ${formData.courseType}. Duración estimada: ${formData.duration} horas.`,
      modules,
      scenarios,
    };
  };

  const handleGenerateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      alert("Por favor completa el tema del curso");
      return;
    }
    
    setIsGenerating(true);
    setTimeout(() => {
      const generatedContent = generateMockContent(formData);
      setIsGenerating(false);
      
      if (onGenerateContent) {
        onGenerateContent(generatedContent);
      }
      
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("¡Contenido Generado!", {
          body: `El curso "${formData.topic}" ha sido generado exitosamente.`,
          icon: "✨",
        });
      }
    }, 2000);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Generador de Cursos con IA
        </CardTitle>
        <p className="text-sm text-gray-600 font-normal mt-2">
          Define el tema y la IA generará estructura, contenido y escenarios de simulación
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerateCourse} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Tema del Curso</Label>
            <Input
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="Ej. Operación de Válvulas de Alta Presión"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseType">Tipo de Curso</Label>
            <select
              id="courseType"
              name="courseType"
              value={formData.courseType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Técnico">Técnico</option>
              <option value="Conceptual">Conceptual</option>
              <option value="Procedural">Procedural</option>
              <option value="Habilidades">Habilidades</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duración Objetivo (horas)</Label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2">2 horas</option>
              <option value="4">4 horas</option>
              <option value="8">8 horas</option>
              <option value="16">16 horas</option>
              <option value="20">20 horas</option>
              <option value="40">40 horas</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicableNorms">Normativas Aplicables</Label>
            <Textarea
              id="applicableNorms"
              name="applicableNorms"
              value={formData.applicableNorms}
              onChange={handleInputChange}
              placeholder="Ej. NOM-029-STPS-2011, NFPA 70E"
              rows={3}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              La IA generará una propuesta inicial que podrás revisar y ajustar antes de publicar
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isGenerating} size="lg">
            {isGenerating ? "Generando Contenido..." : "Generar Contenido"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
