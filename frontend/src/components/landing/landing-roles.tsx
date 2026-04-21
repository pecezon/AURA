import { HardHat, BarChart2, Settings } from "lucide-react";
import LandingRolesCard from "./landing-roles-card";

const ROLES = [
  {
    icon: HardHat,
    title: "Trabajador",
    description:
      "Completa cursos, accede a simulaciones y recibe retroalimentación personalizada con su perfil de riesgo.",
    features: [
      "Ingresa y completa su perfil",
      "Consume contenido teórico",
      "Realiza simulaciones dinámicas",
      "Recibe perfil conductual",
    ],
  },
  {
    icon: BarChart2,
    title: "Supervisor",
    description:
      "Visualiza el desempeño de su equipo, identifica áreas de riesgo y asigna capacitaciones adicionales.",
    features: [
      "Accede al dashboard del equipo",
      "Analiza perfiles agregados",
      "Identifica trabajadores en riesgo",
      "Asigna cursos adicionales",
    ],
  },
  {
    icon: Settings,
    title: "Administrador",
    description:
      "Crea y publica cursos con asistencia de IA, ajusta escenarios y configura las métricas de evaluación.",
    features: [
      "Define tema del curso",
      "IA genera propuesta de estructura",
      "Ajusta y publica módulos",
      "Integra métricas conductuales",
    ],
  },
];

export default function LandingRoles() {
  return (
    <div id="roles" className="w-full bg-blue-900 py-16 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 mb-10">
          <p className="text-red-400 font-semibold text-xs uppercase tracking-widest">
            ROLES DE USUARIO
          </p>
          <h2 className="text-3xl font-bold text-white">
            Diseñado para cada nivel
          </h2>
          <p className="text-blue-200 text-xs leading-relaxed max-w-md">
            Tres perfiles con accesos y flujos distintos, todos conectados al
            mismo motor de análisis conductual.{" "}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROLES.map((role) => (
            <LandingRolesCard key={role.title} {...role} />
          ))}
        </div>
      </div>
    </div>
  );
}
