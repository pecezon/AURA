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
import { mockUsers, mockCourses, mockProgress } from "@/lib/mockData";

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
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [workerSearch, setWorkerSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  // Get workers only
  const workers = mockUsers.filter((user) => user.role === "worker");

  // Filter workers based on search
  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
      worker.department.toLowerCase().includes(workerSearch.toLowerCase()),
  );

  // Filter courses based on search
  const filteredCourses = mockCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      course.description.toLowerCase().includes(courseSearch.toLowerCase()) ||
      course.type.toLowerCase().includes(courseSearch.toLowerCase()),
  );

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

 const getWorkerUncompletedCourses = (workerId: string) => {
    const workerProgress = mockProgress
      .filter(p => p.userId === workerId && p.progress < 100)
      .sort((a, b) => b.lastAccess.getTime() - a.lastAccess.getTime())
      .slice(0, 3);
    
    return workerProgress.map(p => {
      const course = mockCourses.find(c => c.id === p.courseId);
      return course ? { ...course, progress: p.progress } : null;
    }).filter(Boolean);
  };

  const handleAssignCourses = () => {
    if (!selectedWorker) {
      toast.error("Por favor selecciona un trabajador");
      return;
    }
    if (selectedCourses.length === 0) {
      toast.error("Por favor selecciona al menos un curso");
      return;
    }

    const worker = workers.find((w) => w.id === selectedWorker);
    toast.success(
      `${selectedCourses.length} curso(s) asignado(s) a ${worker?.name}`,
    );

    // Reset form
    setSelectedWorker("");
    setSelectedCourses([]);
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
            </div>

            {/* Worker Results */}
            {workerSearch && (
              <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-2">
                {filteredWorkers.length > 0 ? (
                  filteredWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      onClick={() => {
                        setSelectedWorker(worker.id);
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
                          <p className="font-medium text-sm">{worker.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {worker.department}
                          </p>
                        </div>
                        {selectedWorker === worker.id && (
                          <CheckCircle2 className="size-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No se encontraron trabajadores
                  </p>
                )}
              </div>
            )}

            {/* Selected Worker Display */}
            {selectedWorker && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {workers.find((w) => w.id === selectedWorker)?.name}
                  </p>
                  <p className="text-xs text-blue-700">
                    {workers.find((w) => w.id === selectedWorker)?.department}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedWorker("")}
                  className="h-8 w-8 p-0"
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}
             {(() => {
                        const uncompletedCourses = getWorkerUncompletedCourses(selectedWorker);
                        return uncompletedCourses.length > 0 && (
                          <div className="pt-2 border-t border-blue-200">
                            <p className="text-xs font-medium text-blue-800 mb-1.5">
                              Cursos pendientes:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {uncompletedCourses.map((course: any) => (
                                <Badge 
                                  key={course.id} 
                                  variant="outline"
                                  className="text-xs bg-white border-blue-300 text-blue-800"
                                >
                                  {course.title.length > 30 
                                    ? `${course.title.substring(0, 30)}...` 
                                    : course.title}
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
                className="pl-9"
              />
            </div>

            {/* Course Results */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-lg max-h-96 overflow-y-auto">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-start gap-3 p-3 bg-white rounded-lg border"
                  >
                    <Checkbox
                      id={course.id}
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={() => handleCourseToggle(course.id)}
                    />
                    <div className="grid gap-1.5 leading-none flex-1">
                      <label
                        htmlFor={course.id}
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

            {/* Selected Courses Count */}
            {selectedCourses.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedCourses.length} curso(s) seleccionado(s)
              </p>
            )}
          </div>

          {/* Assignment Summary */}
          {selectedWorker && selectedCourses.length > 0 && (
            <Alert>
              <Users className="size-4" />
              <AlertDescription>
                {selectedCourses.length} curso(s) serán asignados a{" "}
                {workers.find((w) => w.id === selectedWorker)?.name}
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
