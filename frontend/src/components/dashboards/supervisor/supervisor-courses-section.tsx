import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { SupervisorCoursesGraph } from "./supervisor-courses-graph";
import { Button } from "../../ui/button";
import { SupervisorCourseCard } from "./supervisor-course-card";

interface CourseData {
  courseName: string;
  tag: string;
  assignedWorkers: number;
  inProgressWorkers: number;
  completedWorkers: number;
  overdueWorkers: number;
  regulations?: Array<string>;
}

const mockCourseData: CourseData[] = [
  {
    courseName: "Curso de Seguridad",
    tag: "Seguridad",
    assignedWorkers: 10,
    inProgressWorkers: 5,
    completedWorkers: 3,
    overdueWorkers: 2,
    regulations: ["NOM-029-STPS-2011", "NFPA 52"],
  },
  {
    courseName: "Curso de Primeros Auxilios",
    tag: "Técnico",
    assignedWorkers: 15,
    inProgressWorkers: 10,
    completedWorkers: 4,
    overdueWorkers: 1,
    regulations: ["NOM-029-STPS-2011", "NFPA 350"],
  },
  {
    courseName: "Curso de Manejo de Maquinaria",
    tag: "Seguridad",
    assignedWorkers: 20,
    inProgressWorkers: 12,
    completedWorkers: 6,
    overdueWorkers: 2,
    regulations: ["NOM-029-STPS-2011", "OSHA 1910.120"],
  },
  {
    courseName: "Curso de Ergonomía",
    tag: "Seguridad",
    assignedWorkers: 8,
    inProgressWorkers: 4,
    completedWorkers: 3,
    overdueWorkers: 1,
    regulations: ["NOM-029-STPS-2011", "NFPA 52"],
  },
];

export const SupervisorCoursesSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const coursesToShow = showAll ? mockCourseData : mockCourseData.slice(0, 3);
  const hasMoreCourses = mockCourseData.length > 3;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Graph Card */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso de Cursos por Equipo</CardTitle>
          <CardDescription>
            Estado de completitud de capacitaciones asignadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesToShow.map((course, index) => (
              <SupervisorCoursesGraph
                key={index}
                courseName={course.courseName}
                tag={course.tag}
                assignedWorkers={course.assignedWorkers}
                inProgressWorkers={course.inProgressWorkers}
                completedWorkers={course.completedWorkers}
                overdueWorkers={course.overdueWorkers}
              />
            ))}
          </div>
          {hasMoreCourses && (
            <div className="mt-4 flex justify-center">
              <Button
                className="cursor-pointer"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Ocultar" : "Ver más"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Courses Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCourseData.map((course, index) => (
          <SupervisorCourseCard
            key={index}
            title={course.courseName}
            type={course.tag}
            regulations={course.regulations}
            progress={Math.round(
              (course.completedWorkers / course.assignedWorkers) * 100,
            )}
          />
        ))}
      </div>
    </div>
  );
};
