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
import { useCourses } from "@/hooks/useCourses";

interface CourseData {
  courseName: string;
  tag: string;
  assignedWorkers: number;
  inProgressWorkers: number;
  completedWorkers: number;
  overdueWorkers: number;
  regulations?: Array<string>;
}

import { useEnrollments } from "@/hooks/useEnrollments";

export const SupervisorCoursesSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const { data: apiCourses } = useCourses();

  const { data: enrollments } = useEnrollments();

  const mappedCourses: CourseData[] = React.useMemo(() => {
    if (!apiCourses || !enrollments) return [];
    return apiCourses.map((c: any) => {
      const courseEnrollments = enrollments.filter((e: any) => e.courseId === c.id);
      
      const completedWorkers = courseEnrollments.filter((e: any) => e.status === "COMPLETED").length;
      const inProgressWorkers = courseEnrollments.filter((e: any) => e.status === "IN_PROGRESS").length;
      const pendingWorkers = courseEnrollments.filter((e: any) => e.status === "ASSIGNED").length;
      const totalAssigned = courseEnrollments.length;

      return {
        courseName: c.title || "Curso Sin Título",
        tag: c.type === "technical" ? "Técnico" : c.type === "safety" ? "Seguridad" : "General",
        assignedWorkers: totalAssigned,
        inProgressWorkers: inProgressWorkers,
        completedWorkers: completedWorkers,
        overdueWorkers: pendingWorkers, // we map ASSIGNED to remaining/overdue in the chart
        regulations: c.regulations?.map((r: any) => r.name || r.id) || [],
      };
    });
  }, [apiCourses, enrollments]);

  const coursesToShow = showAll ? mappedCourses : mappedCourses.slice(0, 3);
  const hasMoreCourses = mappedCourses.length > 3;

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
        {mappedCourses.map((course, index) => (
          <SupervisorCourseCard
            key={index}
            title={course.courseName}
            type={course.tag}
            regulations={course.regulations}
            progress={
              course.assignedWorkers > 0 
                ? Math.round((course.completedWorkers / course.assignedWorkers) * 100) 
                : 0
            }
          />
        ))}
      </div>
    </div>
  );
};
