import { Navbar } from "@/components/navbar";
import { Link, useParams } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { StatProgressBar } from "@/components/dashboards/stat-progress-bar"; 
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle, Circle, Clock, Award, Play } from "lucide-react";
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
import { useCourse } from "@/hooks/useCourses";
import { useModulesByCourse } from "@/hooks/useModules";

interface Course {
  id: string;
  title: string;
  description: string;
  type: string;
  duration?: string;
  regulations?: { id: string; name: string }[];
}

interface Module {
  id: string;
  title: string;
  type?: string;
  contents?: { id: string; title: string; type: string }[];
}

const translateCourseType = (type: string) => {
  if (type === "TECHNICAL") return "Técnico";
  if (type === "SECURITY") return "Seguridad";
  return type;
};

export default function CourseDetail() {
  const { courseId } = useParams({ strict: false }) as { courseId: string };

  const [profileId, setProfileId] = useState<string>("");

  useEffect(() => {
    getUserId().then((id) => setProfileId(id || ""));
  }, []);

  const { 
    data: course, 
    isLoading: isCourseLoading,
    isError: isCourseError 
  } = useCourse(courseId);

  const { 
    data: modules, 
    isLoading: isModulesLoading,
    isError: isModulesError 
  } = useModulesByCourse(courseId);

  const { completedModules, markModuleAsCompleted, isModuleCompleted, getProgressPercentage, isLoading: isProgressLoading } =
    useCourseProgress(profileId, courseId);

  const isLoading = isCourseLoading || isModulesLoading || !profileId || isProgressLoading;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-pulse">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isCourseError || isModulesError) {
    return <div className="p-6 text-center text-red-500">Error de conexión. No se pudo cargar el curso.</div>;
  }

  if (!course) {
    return <div className="p-6 text-center text-red-500">Curso no encontrado</div>;
  }

  const totalModules = modules?.length || 0;
  const progressPercentage = getProgressPercentage(totalModules);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 gap-6 md:gap-8">
      <Navbar role="EMPLOYEE" />

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-2">
            {/* Nav */}
            <Link
              to="/dashboard"
              className="inline-flex items-center text-sm font-medium text-black-500 hover:text-gray-700 mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={2.5} />
              Volver al Dashboard
            </Link>
          </div>

          {/* Course Header Card */}
          <div className="bg-white rounded-lg p-6 border border-gray-300 mb-6 space-y-6">
            <div className="flex flex-col gap-1 md:gap-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-medium text-slate-900 mb-2">{course.title}</h1>
              </div>
              
              <p className="text-sm md:text-base text-muted-foreground">{course.description}</p>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <Badge variant={course.type === "TECHNICAL" ? "default" : "secondary"}>
                {translateCourseType(course.type)}
              </Badge>
              {course.duration && (
                <Badge variant="outline">
                  <Clock data-icon="inline-start" />
                  {course.duration}
                </Badge>
              )}
            </div>

              {/* Progress Bar*/}
            <div className="mb-4">
              <StatProgressBar
              label="Progreso del Curso"
              value={progressPercentage}
              max={100}
              percentage={true}
            />
            </div>

            {course.regulations && course.regulations.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-4">
                <span className="text-sm font-medium text-blue-900 block mb-2">
                  Cumplimiento Normativo:
                </span>
                <div className="flex flex-wrap gap-2">
                  {course.regulations.map((reg: { id: string; name: string }) => (
                    <Badge key={reg.id} variant="outline" className="bg-white border-gray-300 ">
                      {reg.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {progressPercentage === 100 && (
              <div className="flex items-center justify-between bg-green-50 rounded-xl p-4 border border-green-200 mt-4">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div>
                    <span className="text-md font-medium text-green-800 block">
                      ¡Módulos teóricos completados!
                    </span>
                    <p className="text-sm text-green-700">Ahora puedes realizar la simulación práctica</p>
                  </div>
                </div>
                <Button className="cursor-pointer">
                  <Play className="w-4 h-4" />
                  Iniciar Simulación
                </Button>
              </div>
            )}
          </div>

          {/* Modules Accordion Card */}
          <div className="bg-white rounded-lg p-6 border border-gray-300">
            <h2 className="text-lg font-medium text-slate-900 mb-1">Módulos del Curso</h2>
            <p className="text-gray-500 text-sm mb-5">Completa todos los módulos para desbloquear la simulación</p>

            <Accordion type="single" collapsible className="w-full">
              {modules && modules.length > 0 ? (
                modules.map((module: Module, index: number) => {
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
                              {module.type || "Contenido teórico"}
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
