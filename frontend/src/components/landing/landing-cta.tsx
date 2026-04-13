import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function LandingCTA() {
  return (
    <div id="cta" className="w-full bg-red-600 py-20 px-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          ¿Listo para capacitar diferente?
        </h2>
        <p className="text-white/80 text-sm leading-relaxed max-w-sm">
          Accede a AURA y transforma cómo tu equipo aprende, practica y
          demuestra competencia operativa.
        </p>
        <Button
          variant="outline"
          className="bg-transparent text-white border-white hover:bg-white hover:text-red-600 transition-colors"
        >
          Ingresar a la plataforma
          <ArrowRightIcon size={16} />
        </Button>
      </div>
    </div>
  );
}