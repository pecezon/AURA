import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { getUserId } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function CourseDetail() {
  const { courseId } = useParams({ strict: false }) as { courseId: string };

  const [profileId, setProfileId] = useState<string>("");

  useEffect(() => {
    getUserId().then((id) => setProfileId(id || ""));
  }, []);

  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const response = await api.get(`/api/courses/${courseId}`);
      return response.data;
    },
    enabled: !!courseId,
  });

  const { data: modules, isLoading: isModulesLoading } = useQuery({
    queryKey: ["course-modules", courseId],
    queryFn: async () => {
      const response = await api.get(`/api/modules/get-all-modules-by-course/${courseId}`);
      return response.data;
    },
    enabled: !!courseId,
  });

  const { completedModules, markModuleAsCompleted, isModuleCompleted, getProgressPercentage } =
    useCourseProgress(profileId, courseId);

  const isLoading = isCourseLoading || isModulesLoading || !profileId;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-pulse">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!course) {
    return <div className="p-6 text-center text-red-500">Curso no encontrado</div>;
  }

  console.log("Fetched Course:", course);
  console.log("Fetched Modules:", modules);

  const totalModules = modules?.length || 0;
  const progressPercentage = getProgressPercentage(totalModules);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Nav */}
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Link>

        {/* Course Header Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          <div className="flex items-center gap-3 mb-8">
            <Badge variant="secondary" className="bg-slate-900 text-white hover:bg-slate-800">
              {course.type === "TECHNICAL" ? "Técnico" : "Seguridad"}
            </Badge>
            {course.duration && (
              <Badge variant="outline" className="text-gray-600 font-normal border-gray-200">
                ⏱ {course.duration}
              </Badge>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Progreso del Curso</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {course.regulations && course.regulations.length > 0 && (
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <span className="text-sm font-medium text-blue-800 block mb-3">
                Cumplimiento Normativo:
              </span>
              <div className="flex flex-wrap gap-2">
                {course.regulations.map((reg: any) => (
                  <Badge key={reg.id} variant="secondary" className="bg-white text-gray-700 border-gray-200 shadow-sm">
                    {reg.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modules Accordion Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Módulos del Curso</h2>
          <p className="text-gray-500 text-sm mb-6">Completa todos los módulos para desbloquear la simulación</p>

          <Accordion type="single" collapsible className="w-full">
            {modules && modules.length > 0 ? (
              modules.map((module: any, index: number) => {
                const completed = isModuleCompleted(module.id);
                return (
                  <AccordionItem key={module.id} value={module.id} className="border-b border-gray-100 last:border-0 px-2">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-4 text-left">
                        {completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-semibold text-sm text-slate-900">
                            Módulo {index + 1}: {module.title}
                          </div>
                          <div className="text-xs text-gray-500 font-normal mt-1">
                            Contenido teórico
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-9 pb-6 pt-2">
                      <div className="text-sm text-gray-600 mb-4">
                        {module.contents && module.contents.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-1">
                            {module.contents.map((c: any) => (
                              <li key={c.id}>{c.title || `Contenido de tipo ${c.type}`}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>Este módulo contiene material de estudio para tu capacitación.</p>
                        )}
                      </div>
                      
                      {completed ? (
                        <div className="flex items-center text-sm text-green-600 font-medium">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Módulo completado
                        </div>
                      ) : (
                        <Button 
                          onClick={() => markModuleAsCompleted(module.id)}
                          className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm px-6 cursor-pointer"
                        >
                          Marcar como Completado
                        </Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                Este curso aún no tiene módulos registrados.
              </div>
            )}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
