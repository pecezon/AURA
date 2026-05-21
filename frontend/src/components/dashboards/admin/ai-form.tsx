import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Sparkles, Info, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRegulations } from "@/hooks/useRegulations";
import { useGenerateCourse } from "@/hooks/useGenerateCourse";

interface AIFormData {
  topic: string;
  courseType: string;
  duration: string;
  applicableNorms: string[];
  selectedSimulation: string;
}

interface AIFormProps {
  onGenerateContent?: (content: any) => void;
  content?: any;
  setGeneratedContent?: React.Dispatch<React.SetStateAction<any>>;
}

export const AIForm: React.FC<AIFormProps> = ({ onGenerateContent, content, setGeneratedContent }) => {
  const { data: regulations, isLoading: isLoadingRegs } = useRegulations();
  const [formData, setFormData] = useState<AIFormData>({
    topic: "",
    courseType: "TECHNICAL",
    duration: "1",
    applicableNorms: [],
    selectedSimulation: "ss101",
  });

  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  const generateCourseMutation = useGenerateCourse();
  const isGenerating = generateCourseMutation.isPending;

  const loadingPhrases = [
    "Analizando normativas...",
    "Estructurando módulos...",
    "Redactando contenido...",
    "Preparando simulación...",
    "Diseñando evaluaciones...",
    "Finalizando curso..."
  ];

  // Sincronizar el formulario con el contenido generado si cambia externamente
  useEffect(() => {
    if (content) {
      const derivedSimulation = (content.modules || []).some((m: any) => m.simulation !== undefined) ? "ss101" : "none";
      setFormData(prev => ({
        ...prev,
        duration: content.duration || prev.duration,
        applicableNorms: content.applicableNorms || prev.applicableNorms,
        selectedSimulation: derivedSimulation,
      }));
    } else {
      setFormData({
        topic: "",
        courseType: "TECHNICAL",
        duration: "1",
        applicableNorms: [],
        selectedSimulation: "ss101",
      });
    }
  }, [content]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 1500);
    } else {
      setLoadingPhraseIndex(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (value: string) => {
    setFormData(prev => ({ ...prev, duration: value }));
    if (setGeneratedContent) {
      setGeneratedContent(prev => prev ? { ...prev, duration: value } : prev);
    }
  };

  const handleGenerateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      alert("Por favor completa el tema del curso");
      return;
    }

    generateCourseMutation.mutate(formData, {
      onSuccess: (data) => {
        if (onGenerateContent) {
          // If the AI didn't generate scenarios, supply standard fallback ones
          const enhancedData = {
            ...data,
            title: formData.topic.trim(),
            duration: formData.duration,
            applicableNorms: formData.applicableNorms,
            scenarios: data.scenarios || [
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
            ]
          };

          // Attach simulation DTO to the last module if selected
          if (formData.selectedSimulation === "ss101" && enhancedData.modules && enhancedData.modules.length > 0) {
            const lastIdx = enhancedData.modules.length - 1;
            enhancedData.modules[lastIdx].simulation = {
              title: "Simulación de Práctica Industrial (SS101)",
              passingScore: 80
            };
          }

          onGenerateContent(enhancedData);
        }

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("¡Contenido Generado!", {
            body: `El curso "${formData.topic}" ha sido generado exitosamente por la IA.`,
          });
        }
      },
      onError: (err: any) => {
        console.error("AI Generation failed:", err);
        alert("Ocurrió un error al generar el curso con IA. Por favor intenta de nuevo.");
      }
    });
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
              className="text-sm font-medium h-9"
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
              className="h-9 w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white font-medium"
            >
              <option value="TECHNICAL">Técnico</option>
              <option value="CONCEPTUAL">Conceptual</option>
              <option value="PROCEDURAL">Procedural</option>
              <option value="SKILLS">Habilidades</option>
              <option value="SECURITY">Seguridad</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duración Objetivo</Label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={(e) => handleDurationChange(e.target.value)}
              className="h-9 w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white font-medium cursor-pointer"
            >
              <option value="0.5">30 minutos</option>
              <option value="1">1 hora</option>
              <option value="1.5">1.5 horas</option>
              <option value="2">2 horas</option>
              <option value="2.5">2.5 horas</option>
              <option value="3">3 horas</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicableNorms">Normativas Aplicables</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between font-normal border-gray-300 bg-white">
                  {formData.applicableNorms.length > 0 
                    ? `${formData.applicableNorms.length} normativa(s) seleccionada(s)`
                    : "Seleccionar normativas..."}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuLabel>Normativas Oficiales</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoadingRegs ? (
                  <div className="p-2 text-sm text-gray-500">Cargando...</div>
                ) : regulations?.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">No hay normativas registradas</div>
                ) : (
                  regulations?.map((reg: any) => (
                    <DropdownMenuCheckboxItem
                      key={reg.id}
                      checked={formData.applicableNorms.includes(reg.id)}
                      onCheckedChange={(checked) => {
                        setFormData(prev => {
                          const nextNorms = checked 
                            ? [...prev.applicableNorms, reg.id]
                            : prev.applicableNorms.filter(id => id !== reg.id);
                          
                          if (setGeneratedContent) {
                            setGeneratedContent(curr => curr ? { ...curr, applicableNorms: nextNorms } : curr);
                          }

                          return {
                            ...prev,
                            applicableNorms: nextNorms
                          };
                        })
                      }}
                    >
                      {reg.name} {reg.description ? `- ${reg.description}` : ""}
                    </DropdownMenuCheckboxItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2 py-1">
            <Label className="text-gray-700 font-medium text-sm">Simulación Práctica Interactiva</Label>
            <select
              value={formData.selectedSimulation}
              onChange={(e) => {
                const selected = e.target.value;
                setFormData(prev => ({ ...prev, selectedSimulation: selected }));
                if (setGeneratedContent) {
                  setGeneratedContent(prev => {
                    if (!prev || !prev.modules) return prev;
                    const updatedModules = prev.modules.map((mod: any, idx: number) => {
                      const isLast = idx === prev.modules.length - 1;
                      if (selected === "ss101" && isLast) {
                        return {
                          ...mod,
                          simulation: {
                            title: "Simulación de Práctica Industrial (SS101)",
                            passingScore: 80
                          }
                        };
                      }
                      const { simulation, ...rest } = mod;
                      return rest;
                    });
                    return { ...prev, modules: updatedModules };
                  });
                }
              }}
              className="h-9 w-full bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer text-gray-800 font-medium"
            >
              <option value="none">Sin simulación interactiva</option>
              <option value="ss101">SS101: Identificación de Riesgos en Gasoductos (Sempra)</option>
            </select>

            {formData.selectedSimulation === "ss101" && (
              <div className="mt-2 border border-blue-150 bg-blue-50/50 rounded-lg p-3.5 flex gap-4 animate-fade-in shadow-sm">
                <img
                  src="/simulations/industrial_safety_1.png"
                  alt="Sempra Terminal"
                  className="w-28 h-20 object-cover rounded-md border border-blue-200 shadow-sm shrink-0"
                />
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-semibold text-blue-900">SS101: Identificación de Riesgos</h4>
                  <p className="text-xs text-blue-700 mt-0.5">Escenario: Terminal de Gasoductos Sempra</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-xxs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                    Puntaje Mínimo: 80%
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              La IA generará una propuesta inicial que podrás revisar y ajustar antes de publicar
            </p>
          </div>

          <Button
            type="submit"
            className={`w-full py-6 text-base font-semibold shadow-md transition-all duration-300 relative overflow-hidden ${
              isGenerating
                ? "bg-gradient-to-r from-egyptian-blue-600 via-indigo-500 to-classic-crimson-500 bg-[length:200%_auto] animate-shimmer text-white border-0"
                : "bg-egyptian-blue-600 hover:bg-egyptian-blue-700 text-white"
            }`}
            disabled={isGenerating}
            size="lg"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="transition-all duration-300 ease-in-out">
                  {loadingPhrases[loadingPhraseIndex]}
                </span>
              </span>
            ) : (
              "Generar Contenido"
            )}
          </Button>

          <style>{`
            @keyframes shimmer-bg {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-shimmer {
              animation: shimmer-bg 3s ease infinite;
            }
          `}</style>
        </form>
      </CardContent>
    </Card>
  );
};
