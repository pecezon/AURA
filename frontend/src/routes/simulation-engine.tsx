import { useEffect, useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, Timer, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSessionId } from "@/hooks/useSession";
import { 
  useSimulationById, 
  useCreateSimulationAttempt, 
  useSubmitSimulationAttempt 
} from "@/hooks/useSimulations";
import { useSimulationTracker } from "@/hooks/useSimulationTracker";
import { clsx } from "clsx";

export default function SimulationEngine() {
  const { simulationId } = useParams({ strict: false }) as { simulationId: string };
  const { data: profileId } = useSessionId();
  
  const { data: simulation, isLoading: isLoadingSim } = useSimulationById(simulationId);
  const { mutateAsync: createAttempt } = useCreateSimulationAttempt();
  const { mutateAsync: submitAttempt, isPending: isSubmitting } = useSubmitSimulationAttempt();
  
  const { pins, addPin, removePin, getEvents } = useSimulationTracker();
  
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Timer
  useEffect(() => {
    if (isFinished || !attemptId) return;
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished, attemptId]);

  // Start Attempt
  useEffect(() => {
    if (simulationId && profileId && !attemptId) {
      createAttempt({ simulationId, profileId }).then((res) => {
        setAttemptId(res.id);
      }).catch(err => console.error("Error creating attempt", err));
    }
  }, [simulationId, profileId, attemptId, createAttempt]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFinished) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    addPin(x, y);
  };

  const handleRemovePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (isFinished) return;
    removePin(id);
  };

  const handleFinish = async () => {
    if (!attemptId) return;
    setIsFinished(true);
    try {
      const res = await submitAttempt({
        attemptId,
        data: {
          score: 0, // Base score, calculated in backend
          events: getEvents(),
          timeTakenSeconds: timeElapsed
        }
      });
      setResults(res);
    } catch (err) {
      console.error("Error submitting attempt", err);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (isLoadingSim || !simulation) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-indigo-950 text-white">
        <p className="animate-pulse">Cargando simulación...</p>
      </div>
    );
  }

  let config = simulation.configuration as any;
  if (typeof config === 'string') {
    try {
      config = JSON.parse(config);
    } catch(e) {
      config = {};
    }
  }
  const imageUrl = config?.imageUrl || 'https://placehold.co/1000x600/png?text=Simulacion+SS101';
  const hotspots = config?.hotspots || [];

  let foundHotspots: any[] = [];
  let missedHotspots: any[] = [];
  
  if (isFinished && results) {
    hotspots.forEach((h: any) => {
      const isFound = pins.some(pin => {
        const dx = h.x - pin.x;
        const dy = h.y - pin.y;
        return Math.sqrt(dx * dx + dy * dy) <= h.radius;
      });
      if (isFound) foundHotspots.push(h);
      else missedHotspots.push(h);
    });
  }

  return (
    <div className="flex flex-col h-screen bg-slate-indigo-950 text-slate-50 font-sans overflow-hidden">
      {/* Header */}
      <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-slate-indigo-800/60 bg-slate-indigo-950/80 backdrop-blur-md z-10">
        <Button variant="ghost" className="text-slate-indigo-300 hover:text-white hover:bg-slate-indigo-800" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Salir
          </Link>
        </Button>

        <Badge variant="outline" className="border-slate-indigo-700 bg-slate-indigo-900/50 text-slate-indigo-200 gap-1.5 px-3 py-1">
          <AlertTriangle className="w-3.5 h-3.5 text-classic-crimson-500" />
          {simulation.title}
        </Badge>

        <div className="flex items-center gap-2 text-classic-crimson-500 bg-classic-crimson-500/10 px-4 py-1.5 rounded-md border border-classic-crimson-500/20">
          <Timer className="w-4 h-4" />
          <span className="font-mono text-lg font-medium tracking-wider">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* Split View Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Image Area (70%) */}
        <div className="w-[70%] bg-black relative flex items-center justify-center p-4">
          <div className="relative inline-block border-2 border-slate-indigo-800/50 shadow-2xl rounded-xl overflow-hidden max-w-full max-h-full">
            <img 
              src={imageUrl} 
              alt="Simulation Scene" 
              className={clsx(
                "max-w-full max-h-[85vh] object-contain transition-opacity duration-300",
                isFinished ? "opacity-70" : "opacity-100 cursor-crosshair"
              )}
              onClick={handleImageClick}
              draggable={false}
            />
            
            {/* Render Pins */}
            {pins.map((pin, i) => {
              let isCorrect = false;
              if (isFinished && results) {
                // simple frontend visual check, backend already validated it
                isCorrect = hotspots.some((h: any) => {
                  const dx = h.x - pin.x;
                  const dy = h.y - pin.y;
                  return Math.sqrt(dx * dx + dy * dy) <= h.radius;
                });
              }

              return (
                <div 
                  key={pin.id}
                  className={clsx(
                    "absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all duration-300 transform",
                    isFinished 
                      ? (isCorrect ? "bg-emerald-500 text-white ring-2 ring-emerald-300 scale-110" : "bg-classic-crimson-500 text-white ring-2 ring-classic-crimson-300 opacity-70") 
                      : "bg-amber-400 text-amber-950 hover:scale-110 cursor-pointer ring-2 ring-amber-200"
                  )}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  onClick={(e) => handleRemovePin(e, pin.id)}
                >
                  {isFinished ? (isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />) : (i + 1)}
                </div>
              );
            })}

            {/* Render Missing Hotspots if finished */}
            {isFinished && hotspots.map((h: any) => (
              <div 
                key={`hotspot-${h.id}`}
                className="absolute border-2 border-dashed border-emerald-400 rounded-full animate-pulse pointer-events-none"
                style={{ 
                  left: `${h.x}%`, 
                  top: `${h.y}%`, 
                  width: `${h.radius * 2}%`, 
                  height: `${h.radius * 2}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(52, 211, 153, 0.1)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Info Panel (30%) */}
        <div className="w-[30%] bg-slate-indigo-900 border-l border-slate-indigo-800 p-6 flex flex-col overflow-y-auto">
          {!isFinished ? (
            <div className="space-y-6 flex-1 flex flex-col">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Identificación de Riesgos</h2>
                <p className="text-slate-indigo-300 text-sm">
                  Haz clic en la imagen para colocar un marcador donde identifiques un riesgo o peligro industrial.
                </p>
              </div>

              <div className="bg-slate-indigo-950 rounded-xl p-4 border border-slate-indigo-800 flex-1">
                <h3 className="font-semibold text-slate-indigo-200 mb-3 text-sm uppercase tracking-wider">Marcadores ({pins.length})</h3>
                {pins.length === 0 ? (
                  <div className="text-slate-indigo-400 text-sm text-center py-8">
                    No has colocado ningún marcador aún.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {pins.map((pin, i) => (
                      <li key={pin.id} className="flex items-center justify-between bg-slate-indigo-900 p-2 rounded-lg border border-slate-indigo-800/50">
                        <span className="flex items-center gap-2 text-sm text-slate-indigo-200">
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          Riesgo reportado
                        </span>
                        <Button variant="ghost" size="sm" className="text-slate-indigo-400 hover:text-classic-crimson-400 h-7 px-2" onClick={(e) => handleRemovePin(e, pin.id)}>
                          Quitar
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Button 
                onClick={handleFinish} 
                disabled={pins.length === 0 || isSubmitting}
                className="w-full bg-classic-crimson-600 hover:bg-classic-crimson-500 text-white py-6 text-lg font-semibold shadow-lg shadow-classic-crimson-900/20"
              >
                {isSubmitting ? "Analizando..." : "Finalizar Simulación"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6 flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Resultados</h2>
                <p className="text-slate-indigo-300 text-sm">Análisis conductual y puntuación.</p>
              </div>

              {/* Score Card */}
              <div className="bg-slate-indigo-950 rounded-xl p-5 border border-slate-indigo-800 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-classic-crimson-500" />
                <div className="text-slate-indigo-400 text-sm font-medium mb-1">Risk Score</div>
                {isSubmitting ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="w-10 h-10 animate-spin text-slate-indigo-400" />
                  </div>
                ) : (
                  <>
                    <div className="text-5xl font-black text-white">{results?.riskScore || 0}</div>
                    <div className="text-xs text-slate-indigo-300 mt-2">
                      Estado: <span className={results?.passed ? "text-emerald-400" : "text-classic-crimson-400 font-bold"}>
                        {results?.passed ? "Aprobado" : "No Superado"}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Justification Box */}
              {!isSubmitting && (
              <div className="bg-slate-indigo-950 rounded-xl p-5 border border-slate-indigo-800">
                <h3 className="font-semibold text-slate-indigo-200 text-sm mb-4">Justificación de Riesgos</h3>
                <ul className="space-y-4">
                  {foundHotspots.map((h, index) => (
                    <li key={`found-${index}`} className="flex gap-3">
                      <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-emerald-400 font-medium text-sm block mb-1">
                          Identificado: {h.riskType}
                        </span>
                        <p className="text-slate-indigo-300 text-xs leading-relaxed">
                          {h.justification || 'Riesgo detectado correctamente.'}
                        </p>
                      </div>
                    </li>
                  ))}
                  {missedHotspots.map((h, index) => (
                    <li key={`missed-${index}`} className="flex gap-3">
                      <XCircle className="text-classic-crimson-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-classic-crimson-400 font-medium text-sm block mb-1">
                          Omitido: {h.riskType}
                        </span>
                        <p className="text-slate-indigo-300 text-xs leading-relaxed">
                          {h.justification || 'No lograste identificar este riesgo. Es fundamental mantener alerta en el área de trabajo.'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              )}

              {/* AI Feedback */}
              {!isSubmitting && (
              <div className="bg-slate-indigo-950 rounded-xl p-5 border border-slate-indigo-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 text-xs font-bold">IA</span>
                  </div>
                  <h3 className="font-semibold text-slate-indigo-200 text-sm">Análisis Conductual</h3>
                </div>
                <p className="text-sm text-slate-indigo-300 leading-relaxed">
                  {results?.feedback || "Evaluando comportamiento..."}
                </p>
              </div>
              )}

              <div className="mt-auto">
                <Button className="w-full bg-slate-indigo-700 hover:bg-slate-indigo-600 text-white" asChild>
                  <Link to="/dashboard">Volver al Inicio</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
