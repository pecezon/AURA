import { useParams } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, Timer } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SimulationEngine() {
  const { simulationId } = useParams({ strict: false }) as { simulationId: string };

  return (
    <div className="flex flex-col min-h-screen bg-slate-indigo-950 text-slate-50 font-sans selection:bg-classic-crimson-500/30">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-indigo-900 via-slate-indigo-950 to-slate-indigo-950 -z-10" />

      {/* Header / Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-indigo-800/60 bg-slate-indigo-950/50 backdrop-blur-md">
        <Button variant="ghost" className="text-slate-indigo-300 hover:text-white hover:bg-slate-indigo-800" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Salir de la Simulación
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-slate-indigo-700 bg-slate-indigo-900/50 text-slate-indigo-200 gap-1.5 px-3 py-1">
            <AlertTriangle className="w-3.5 h-3.5 text-classic-crimson-500" />
            SS101: Riesgos en Gasoductos
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-classic-crimson-500 bg-classic-crimson-500/10 px-4 py-1.5 rounded-md border border-classic-crimson-500/20">
          <Timer className="w-4 h-4" />
          <span className="font-mono text-lg font-medium tracking-wider">00:00</span>
        </div>
      </div>

      {/* Main Simulation Area Placeholder */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-lg bg-slate-indigo-900/40 p-8 rounded-2xl border border-slate-indigo-800/50 backdrop-blur-sm shadow-2xl">
          <div className="w-16 h-16 bg-slate-indigo-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <AlertTriangle className="w-8 h-8 text-classic-crimson-500/80" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Entorno de Simulación</h1>
            <p className="text-slate-indigo-300 text-sm">
              Fase 0: El motor visual se renderizará en este espacio.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-indigo-400 bg-slate-indigo-950 px-3 py-2 rounded-lg border border-slate-indigo-800">
            ID: {simulationId}
          </div>
        </div>
      </div>
    </div>
  );
}
