import React from "react";
import CourseCard from "./course-card";

const mockCourses = [
  {
    id: 1,
    title: "Manejo Seguro de Gas Natural Comprimido",
    description:
      "Capacitación técnica sobre los procedimientos correctos para el manejo, transporte y almacenamiento de gas natural comprimido en infraestructura energética.",
    regulations: ["NOM-029-STPS-2011", "NFPA 52"],
    type: "Técnico",
    duration: "4 horas",
    progress: 45,
  },
  {
    id: 2,
    title: "Prevención de Riesgos en Espacios Confinados",
    description:
      "Normativas y procedimientos para trabajo seguro en espacios confinados, incluyendo evaluación de riesgos, permisos de trabajo y rescate.",
    regulations: ["NOM-029-STPS-2011", "NFPA 350"],
    type: "Seguridad",
    duration: "3.5 horas",
    progress: 100,
  },
  {
    id: 3,
    title: "Simulación de Emergencias en Plantas de Gas",
    description:
      "Curso práctico sobre el uso de simuladores para entrenar respuestas efectivas ante emergencias en plantas de gas, incluyendo fugas y explosiones.",
    regulations: ["NOM-029-STPS-2011", "OSHA 1910.120"],
    type: "Seguridad",
    duration: "5 horas",
    progress: 0,
  },
];

export const MyCourses: React.FC = () => {
  return (
    <div className="w-full flex flex-col pb-4 justify-center gap-4 md:gap-6 px-4 md:px-16">
      <h2 className="text-xl font-bold md:text-2xl">My Courses</h2>
      {mockCourses.map((course) => (
        <CourseCard
          key={course.id}
          title={course.title}
          description={course.description}
          regulations={course.regulations}
          type={course.type}
          duration={course.duration}
          progress={course.progress}
        />
      ))}
    </div>
  );
};

export default MyCourses;
