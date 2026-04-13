import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress"; 
import { cn } from "../../lib/utils";

const profileStats = [
  { label: "Risk Score", value: 78 },
  { label: "Reacción", value: 85 },
  { label: "Disciplina", value: 92 },
];

const courses = [
  { name: "Manejo GNC", role: "Técnico", progress: 75 },
  { name: "Espacios Confinados", role: "Seguridad", progress: 100 },
  { name: "LOTO", role: "Seguridad Eléctrica", progress: 0 },
];

export default function LandingAbout() {
  return (
    <div
      id="about"
      className="flex flex-col bg-blue-900 min-w-full min-h-screen items-center justify-center px-8 pt-20 pb-18 relative overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row gap-12 items-center justify-center w-full max-w-5xl relative z-10">
        {/* Left: Copy */}
        <div className="flex-1">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider opacity-70">
              INNOVATÓN SEMPRA 2026
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Capacitación que <span className="text-red-400">evalúa</span> lo que
            importa
          </h1>
          <p className="text-base text-gray-300 mt-4 max-w-md leading-relaxed">
            AURA transforma la formación técnica y de seguridad industrial en
            experiencias adaptativas, midiendo decisiones reales bajo presión
            operativa.
          </p>

          <div className="flex flex-row gap-4 mt-8">
            <Button
              size="sm"
              variant="destructive"
              className="flex items-center gap-2"
            >
              Acceder a la plataforma
              <ArrowRightIcon size={16} />
            </Button>
            <Button
              size="sm"
              variant="bubble"
            >
              Ver demo
              <ArrowRightIcon size={16} />
            </Button>
          </div>
        </div>

        {/* Right: Cards */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          {/* Perfil Conductual */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold mb-4">
              Tu Perfil Conductual
            </p>
            <div className="flex flex-row justify-between">
              {profileStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-3xl font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-white/50">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mis Cursos */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold mb-4">
              Mis Cursos
            </p>
            <div className="flex flex-col gap-4">
              {courses.map((course) => (
                <div key={course.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/80">
                      {course.name}{" "}
                      <span className="text-white/40">— {course.role}</span>
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        course.progress === 100
                          ? "text-green-400"
                          : course.progress === 0
                            ? "text-white/30"
                            : "text-blue-300"
                      }`}
                    >
                      {course.progress}%
                    </span>
                  </div>
                  <Progress
                    value={course.progress}
                    className={cn(
                      "bg-white/10",
                      course.progress === 100
                        ? "*:data-[slot=progress-indicator]:bg-green-400"
                        : course.progress === 0
                          ? "*:data-[slot=progress-indicator]:bg-white/20"
                          : "*:data-[slot=progress-indicator]:bg-blue-400",
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
