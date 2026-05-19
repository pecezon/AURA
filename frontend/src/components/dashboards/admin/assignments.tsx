import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCheck, Search, CheckCircle2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useCourses } from "@/hooks/useCourses";
import { useProfileEnrollments, useEnrollInCourse } from "@/hooks/useEnrollments";
import { api } from "@/lib/api";

interface AssignmentsProps {}

interface GeneratedContent {
  title: string;
  type: string;
  modules: { title: string; content: string; duration: string }[];
  scenarios: { description: string; question: string; options: string[] }[];
}

export const Assignments: React.FC<AssignmentsProps> = () => {
  const [courseTopic, setCourseTopic] = useState("");
  const [courseType, setCourseType] = useState<"technical" | "safety">(
    "technical",
  );
  const [targetDuration, setTargetDuration] = useState("4");
  const [regulations, setRegulations] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);

  // Assignment state
  const [selectedWorker, setSelectedWorker] = useState<string>("");
  const [selectedWorkerData, setSelectedWorkerData] = useState<any>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [workerSearch, setWorkerSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  const [workerSearchResults, setWorkerSearchResults] = useState<any[]>([]);
  const [isSearchingWorkers, setIsSearchingWorkers] = useState(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (workerSearch.trim().length >= 3) {
        setIsSearchingWorkers(true);
        try {
          const res = await api.get(`/api/profile/search?search=${encodeURIComponent(workerSearch)}&limit=20&page=1`);
          setWorkerSearchResults(res.data.data.filter((p: any) => p.role === 'EMPLOYEE' || p.role === 'WORKER'));
        } catch (error) {
          console.error("Error searching workers:", error);
          toast.error("Error al buscar trabajadores");
        } finally {
          setIsSearchingWorkers(false);
        }
      } else {
        setWorkerSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [workerSearch]);



  const { data: allCourses = [] } = useCourses();
  const { data: selectedWorkerEnrollments = [] } = useProfileEnrollments(selectedWorker || "");
  const { mutateAsync: enrollInCourse } = useEnrollInCourse();

  const assignedCourseIds = new Set(selectedWorkerEnrollments.map((e: any) => e.courseId));

  // Filter courses based on search and exclude already assigned courses
  const filteredCourses = allCourses.filter(
    (course: any) =>
      !assignedCourseIds.has(course.id) &&
      (course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      course.description?.toLowerCase().includes(courseSearch.toLowerCase()) ||
      course.type?.toLowerCase().includes(courseSearch.toLowerCase()))
  );

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  const handleAssignCourses = async () => {
    if (!selectedWorker) {
      toast.error("Por favor selecciona un trabajador");
      return;
    }
    if (selectedCourses.length === 0) {
      toast.error("Por favor selecciona al menos un curso");
      return;
    }

    try {
      await Promise.all(
        selectedCourses.map((courseId) =>
          enrollInCourse({ profileId: selectedWorker, courseId })
        )
      );

      toast.success(
        `${selectedCourses.length} curso(s) asignado(s) a ${selectedWorkerData?.firstName}`,
      );

      // Only reset selected courses, keep worker selected to see instant updates
      setSelectedCourses([]);
    } catch (error) {
      console.error("Error asignando cursos:", error);
      toast.error("Hubo un error al asignar los cursos o el trabajador ya los tenía asignados");
    }
  };

  const handleGenerate = async () => {
    if (!courseTopic.trim()) {
      toast.error("Por favor ingresa un tema para el curso");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Generate mock content
    const mockContent: GeneratedContent = {
      title: courseTopic,
      type: courseType,
      modules: [
        {
          title: "Introducción y Fundamentos",
          content: `Introducción a ${courseTopic}. Conceptos básicos y principios fundamentales que todo trabajador debe conocer antes de operar en este entorno.`,
          duration: "45 min",
        },
        {
          title: "Procedimientos Operativos Estándar",
          content: `Procedimientos paso a paso para ${courseTopic}. Incluye secuencias críticas, puntos de verificación y mejores prácticas de la industria.`,
          duration: "1 hora",
        },
        {
          title: "Equipos de Seguridad y Protección",
          content: `EPP requerido y equipos de seguridad necesarios para ${courseTopic}. Uso correcto, mantenimiento y verificación pre-operacional.`,
          duration: "45 min",
        },
        {
          title: "Gestión de Emergencias",
          content: `Protocolos de respuesta ante emergencias relacionadas con ${courseTopic}. Evacuación, comunicación y procedimientos de rescate.`,
          duration: "1 hora",
        },
      ],
      scenarios: [
        {
          description: `Durante una operación rutinaria de ${courseTopic}, detectas una anomalía en los parámetros operativos.`,
          question: "¿Cuál es tu primera acción?",
          options: [
            "Continuar monitoreando para confirmar la tendencia",
            "Detener la operación inmediatamente y reportar",
            "Ajustar los parámetros para compensar",
            "Consultar con el supervisor antes de actuar",
          ],
        },
        {
          description: `Un compañero no sigue el procedimiento estándar de ${courseTopic}.`,
          question: "¿Cómo intervenir?",
          options: [
            "Ignorar si no hay riesgo inmediato",
            "Detener la operación y recordar el procedimiento",
            "Reportar después a supervisión",
            "Asumir que tiene experiencia y sabe lo que hace",
          ],
        },
      ],
    };

    setGeneratedContent(mockContent);
    setIsGenerating(false);
    toast.success("Contenido generado exitosamente con IA");
  };

  const handlePublish = () => {
    toast.success("Curso publicado y asignado a trabajadores relevantes");
    setGeneratedContent(null);
    setCourseTopic("");
    setRegulations("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserCheck className="size-5 text-blue-600" />
          <CardTitle>Asignar Cursos a Trabajadores</CardTitle>
        </div>
        <CardDescription>
          Selecciona un trabajador y asigna cursos específicos para su
          capacitación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Worker Selection */}
          <div className="space-y-2">
            <Label htmlFor="worker-search">Buscar Trabajador</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="worker-search"
                placeholder="Buscar por nombre o departamento..."
                value={workerSearch}
                onChange={(e) => setWorkerSearch(e.target.value)}
                className="pl-9"
              />

              {/* Worker Results */}
              {workerSearch && (
                <div className="absolute top-full left-0 mt-1 w-full z-[100] space-y-2 max-h-64 overflow-y-auto bg-white shadow-xl border rounded-lg p-2">
                  {isSearchingWorkers ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Buscando...</p>
                  ) : workerSearchResults.length > 0 ? (
                    workerSearchResults.map((worker) => (
                      <div
                        key={worker.id}
                        onClick={() => {
                          setSelectedWorker(worker.id);
                          setSelectedWorkerData(worker);
                          setWorkerSearch("");
                        }}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedWorker === worker.id
                            ? "bg-blue-100 border-blue-300 border"
                            : "bg-slate-50 hover:bg-slate-100 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{`${worker.firstName} ${worker.lastName}`}</p>
                            <p className="text-xs text-muted-foreground">
                              {worker.area || "Sin área"}
                            </p>
                          </div>
                          {selectedWorker === worker.id && (
                            <CheckCircle2 className="size-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : workerSearch.trim().length >= 3 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No se encontraron trabajadores
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Escribe al menos 3 caracteres
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Selected Worker Display */}
            {selectedWorkerData && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {`${selectedWorkerData.firstName} ${selectedWorkerData.lastName}`}
                  </p>
                  <p className="text-xs text-blue-700">
                    {selectedWorkerData.area || "Sin área"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedWorker("");
                    setSelectedWorkerData(null);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}
             {(() => {
                        const uncompletedCourses = selectedWorkerEnrollments.filter((e: any) => e.progress < 100);
                        return uncompletedCourses.length > 0 && (
                          <div className="pt-2 border-t border-blue-200">
                            <p className="text-xs font-medium text-blue-800 mb-1.5">
                              Cursos pendientes:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {uncompletedCourses.slice(0,3).map((course: any) => (
                                <Badge 
                                  key={course.courseId} 
                                  variant="outline"
                                  className="text-xs bg-white border-blue-300 text-blue-800"
                                >
                                  {course.courseTitle.length > 30 
                                    ? `${course.courseTitle.substring(0, 30)}...` 
                                    : course.courseTitle}
                                  <span className="ml-1 font-semibold">({course.progress}%)</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
          </div>

          {/* Course Selection */}
          <div className="space-y-3">
            <Label htmlFor="course-search">Buscar Cursos</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="course-search"
                placeholder="Buscar por título, tipo o descripción..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                onFocus={() => {
                  if (!courseSearch) setCourseSearch(" "); // trigger show
                }}
                className="pl-9"
              />

              {/* Course Results Overlay */}
              {courseSearch && (
                <div className="absolute top-full left-0 mt-1 w-full z-[100] space-y-3 p-4 bg-white shadow-xl border rounded-lg max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Resultados de cursos</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setCourseSearch("")}>Cerrar</Button>
                  </div>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-start gap-3 p-3 bg-white rounded-lg border hover:bg-slate-50 transition-colors"
                      >
                        <Checkbox
                          id={`course-${course.id}`}
                          checked={selectedCourses.includes(course.id)}
                          onCheckedChange={() => handleCourseToggle(course.id)}
                        />
                        <div className="grid gap-1.5 leading-none flex-1">
                          <label
                            htmlFor={`course-${course.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {course.title}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {course.description}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Badge
                              variant={
                                course.type === "technical"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {course.type === "technical"
                                ? "Técnico"
                                : "Seguridad"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {course.duration}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No se encontraron cursos
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Selected Courses Display */}
            {selectedCourses.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-sm font-medium">Cursos seleccionados ({selectedCourses.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCourses.map((id) => {
                    const course = allCourses.find((c: any) => c.id === id);
                    if (!course) return null;
                    return (
                      <Badge key={id} variant="secondary" className="flex items-center gap-1.5 py-1 px-2">
                        <span className="max-w-[200px] truncate">{course.title}</span>
                        <X
                          className="size-3.5 cursor-pointer hover:text-red-500 transition-colors"
                          onClick={() => handleCourseToggle(id)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Assignment Summary */}
          {selectedWorkerData && selectedCourses.length > 0 && (
            <Alert>
              <Users className="size-4" />
              <AlertDescription>
                {selectedCourses.length} curso(s) serán asignados a{" "}
                {`${selectedWorkerData.firstName} ${selectedWorkerData.lastName}`}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          <Button
            onClick={handleAssignCourses}
            disabled={!selectedWorker || selectedCourses.length === 0}
            className="w-full gap-2"
            size="lg"
          >
            <CheckCircle2 className="size-4" />
            Asignar Cursos Seleccionados
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
