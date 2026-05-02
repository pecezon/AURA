import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { BookOpen, Users } from "lucide-react";

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
  courses = [
    {
      id: "1",
      title: "Manejo Seguro de Gas Natural Comprimido",
      type: "Técnico",
      enrolledWorkers: 3,
      description: "Procedimientos seguros para el manejo de gas natural",
    },
    {
      id: "2",
      title: "Prevención de Riesgos en Espacios Confinados",
      type: "Seguridad",
      enrolledWorkers: 3,
      description: "Identificación y mitigación de riesgos en espacios confinados",
    },
    {
      id: "3",
      title: "Operación de Sistemas de Compresión",
      type: "Técnico",
      enrolledWorkers: 1,
      description: "Operación segura de sistemas de compresión industrial",
    },
    {
      id: "4",
      title: "Seguridad Eléctrica y Bloqueo/Etiquetado (LOTO)",
      type: "Seguridad",
      enrolledWorkers: 0,
      description: "Procedimientos de seguridad eléctrica y LOTO",
    },
  ]
}) => {
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
        <div className="space-y-4">
          {courses.map((course) => (
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
                      <span>{course.enrolledWorkers} trabajadores inscritos</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  <Badge 
                    variant={course.type === "Técnico" ? "default" : "secondary"}
                  >
                    {course.type}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
