import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { BookOpen, Users, Loader2 } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { toSpanish } from "../../../lib/courseTypeConverter";

interface PublishedCourse {
  id: string;
  title: string;
  type: string;
  enrolledWorkers: number;
  description?: string;
}

interface CourseLibraryProps {
  courses?: PublishedCourse[];
}

export const CourseLibrary: React.FC<CourseLibraryProps> = ({ 
  courses: initialCourses
}) => {
  const { data: dbCourses, isLoading, error } = useCourses();

  // Prefer fetched courses over placeholders unless prop is explicitly provided and there's no data
  const coursesToRender = initialCourses || dbCourses || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Cursos Publicados
        </CardTitle>
        <p className="text-sm text-gray-600 font-normal mt-2">
          Biblioteca de cursos activos en la plataforma
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && !initialCourses ? (
          <div className="flex items-center justify-center py-8 gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span>Cargando biblioteca de cursos...</span>
          </div>
        ) : error && !initialCourses ? (
          <div className="text-center py-8 text-red-500">
            Error al cargar los cursos. Por favor, intenta de nuevo.
          </div>
        ) : coursesToRender.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay cursos publicados todavía. ¡Crea uno nuevo con la IA!
          </div>
        ) : (
          <div className="space-y-4">
            {coursesToRender.map((course: any) => {
              const displayType = toSpanish(course.type) || course.type;
              return (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="shrink-0 pt-1">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base">
                          {course.title}
                        </h3>
                        {course.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {course.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{course.enrolledWorkers || 0} trabajadores inscritos</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Badge 
                        variant={course.type === "TECHNICAL" || course.type === "Técnico" ? "default" : "secondary"}
                      >
                        {displayType}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
