import { useEffect, useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, Timer, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionId } from "@/hooks/useSession";
import { 
  useSimulationById, 
  useCreateSimulationAttempt, 
  useSubmitSimulationAttempt 
} from "@/hooks/useSimulations";
import { useSimulationTracker } from "@/hooks/useSimulationTracker";
import { clsx } from "clsx";
import { toast } from "react-hot-toast";

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  feedback?: string;
}

export interface HotspotQuiz {
  question: string;
  options: QuizOption[];
}

export interface GuidedHotspot {
  id: string;
  type: string;
  riskType: string;
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  stepOrder: number;
  instruction?: string;
  penaltyPoints?: number;
  justification?: string;
  quiz?: HotspotQuiz;
}

export interface SimulationConfig {
  simulationType: "EXPLORATION" | "GUIDED_SEQUENCE";
  scenario: string;
  imageUrl: string;
  timeLimitSeconds: number;
  hotspots: GuidedHotspot[];
}

export interface ScoringResult {
  score: number;
  riskScore: number;
  passed: boolean;
  totalPenalties: number;
  foundHotspots: string[];
  missedHotspots: string[];
  feedback: string;
}

export default function SimulationEngine() {
  const { simulationId } = useParams({ strict: false }) as { simulationId: string };
  const { data: profileId } = useSessionId();
  
  const { data: simulation, isLoading: isLoadingSim } = useSimulationById(simulationId);
  const { mutateAsync: createAttempt } = useCreateSimulationAttempt();
  const { mutateAsync: submitAttempt, isPending: isSubmitting } = useSubmitSimulationAttempt();
  
  const { pins, addPin, removePin, addCustomEvent, getEvents } = useSimulationTracker();
  
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<ScoringResult | null>(null);

  // Guided sequence states
  const [currentStepOrder, setCurrentStepOrder] = useState(1);
  const [activeQuiz, setActiveQuiz] = useState<GuidedHotspot | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isQuizSuccess, setIsQuizSuccess] = useState<boolean | null>(null);

  const getSimulationConfig = (): SimulationConfig | null => {
    if (!simulation?.configuration) return null;
    if (typeof simulation.configuration === 'string') {
      try {
        return JSON.parse(simulation.configuration);
      } catch {
        return null;
      }
    }
    return simulation.configuration as unknown as SimulationConfig;
  };

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

    const config = getSimulationConfig();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (config?.simulationType === 'GUIDED_SEQUENCE') {
      if (activeQuiz) return; // Must answer active quiz first

      const hotspots = config?.hotspots || [];
      const currentHotspot = hotspots.find((h) => h.stepOrder === currentStepOrder);
      if (!currentHotspot) return;

      let isHit = false;
      if (currentHotspot.width !== undefined && currentHotspot.height !== undefined) {
        isHit = x >= currentHotspot.x && 
                x <= currentHotspot.x + currentHotspot.width && 
                y >= currentHotspot.y && 
                y <= currentHotspot.y + currentHotspot.height;
      } else {
        const dx = currentHotspot.x - x;
        const dy = currentHotspot.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        isHit = distance <= (currentHotspot.radius || 8);
      }

      if (isHit) {
        setActiveQuiz(currentHotspot);
        setSelectedOptionId(null);
        setQuizFeedback(null);
        setIsQuizSuccess(null);
      } else {
        addCustomEvent({
          type: 'WRONG_CLICK',
          id: '',
          x,
          y,
          expectedStep: currentStepOrder
        });
        toast.error(`Acción insegura. Sigue la secuencia. Debes realizar primero: ${currentHotspot.riskType}`);
      }
    } else {
      addPin(x, y);
    }
  };

  const handleRemovePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (isFinished) return;

    const config = getSimulationConfig();

    if (config?.simulationType === 'GUIDED_SEQUENCE') {
      return; // Cannot remove pins in guided sequence
    }
    removePin(id);
  };

  const handleAnswerOptionSelect = (optionId: string) => {
    if (isQuizSuccess !== null) return; // Cannot change answer after submission
    setSelectedOptionId(optionId);
  };

  const handleQuizSubmit = () => {
    if (!activeQuiz || !selectedOptionId) return;

    const selectedOption = activeQuiz.quiz?.options?.find((o) => o.id === selectedOptionId);
    if (!selectedOption) return;

    const pinX = activeQuiz.width !== undefined ? activeQuiz.x + activeQuiz.width / 2 : activeQuiz.x;
    const pinY = activeQuiz.height !== undefined ? activeQuiz.y + activeQuiz.height / 2 : activeQuiz.y;

    if (selectedOption.isCorrect) {
      setIsQuizSuccess(true);
      setQuizFeedback(activeQuiz.justification || "¡Correcto! Cumple con la normativa.");
      addPin(pinX, pinY, activeQuiz.id);
      toast.success("¡Medida correcta de seguridad!");
    } else {
      setIsQuizSuccess(false);
      setQuizFeedback(selectedOption.feedback || "Esta acción no mitiga el riesgo de forma segura según la normativa.");
      addCustomEvent({
        type: 'QUIZ_ERROR',
        id: activeQuiz.id,
        optionId: selectedOptionId
      });
      // Place the pin so the step is marked complete, but points are deducted
      addPin(pinX, pinY, activeQuiz.id);
      toast.error("Medida incorrecta.");
    }
  };

  const handleQuizNext = () => {
    setActiveQuiz(null);
    setSelectedOptionId(null);
    setQuizFeedback(null);
    setIsQuizSuccess(null);

    const nextStep = currentStepOrder + 1;
    setCurrentStepOrder(nextStep);

    const config = getSimulationConfig();
    const hotspots = config?.hotspots || [];

    if (nextStep > hotspots.length) {
      handleFinishDirect();
    }
  };

  const handleFinishDirect = async () => {
    if (!attemptId) return;
    setIsFinished(true);
    try {
      const res = await submitAttempt({
        attemptId,
        data: {
          score: 0,
          events: getEvents(),
          timeTakenSeconds: timeElapsed
        }
      });
      setResults(res);
    } catch (err) {
      setIsFinished(false);
      setResults(null);
      console.error("Error submitting attempt", err);
    }
  };

  const handleFinish = async () => {
    await handleFinishDirect();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (isLoadingSim || !simulation) {
    return (
      <div className="flex flex-col h-screen bg-slate-indigo-950 text-slate-50 font-sans overflow-hidden">
        {/* Header Skeleton */}
        <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-slate-indigo-800/60 bg-slate-indigo-950/80 backdrop-blur-md">
          <Skeleton className="h-9 w-20 bg-slate-indigo-900/60" />
          <Skeleton className="h-7 w-48 bg-slate-indigo-900/60 rounded-full" />
          <Skeleton className="h-9 w-24 bg-slate-indigo-900/60 rounded-md" />
        </div>

        {/* Split View Content Skeleton */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Image Area Skeleton (70%) */}
          <div className="w-[70%] bg-black/40 flex items-center justify-center p-4">
            <Skeleton className="w-[90%] h-[75vh] bg-slate-indigo-900/20 rounded-xl" />
          </div>

          {/* Right: Info Panel Skeleton (30%) */}
          <div className="w-[30%] bg-slate-indigo-900/40 border-l border-slate-indigo-800/60 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-48 bg-slate-indigo-900/60 mb-2" />
                <Skeleton className="h-4 w-full bg-slate-indigo-900/40" />
                <Skeleton className="h-4 w-3/4 bg-slate-indigo-900/40 mt-1" />
              </div>

              <div className="bg-slate-indigo-950/40 rounded-xl p-4 border border-slate-indigo-800/40 h-64 space-y-4">
                <Skeleton className="h-4 w-28 bg-slate-indigo-900/60" />
                <Skeleton className="h-10 w-full bg-slate-indigo-900/30 rounded-lg" />
                <Skeleton className="h-10 w-full bg-slate-indigo-900/30 rounded-lg" />
              </div>
            </div>

            <Skeleton className="h-11 w-full bg-slate-indigo-900/60 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const config = getSimulationConfig();
  let imageUrl = config?.imageUrl || '/simulations/industrial_safety_1.png';
  if (imageUrl === 'placeholder-sempra-terminal') {
    imageUrl = '/simulations/industrial_safety_1.png';
  }
  const hotspots = config?.hotspots || [];

  let foundHotspots: GuidedHotspot[] = [];
  let missedHotspots: GuidedHotspot[] = [];
  
  if (isFinished && results) {
    if (Array.isArray(results.foundHotspots) && Array.isArray(results.missedHotspots)) {
      foundHotspots = hotspots.filter((h) => results.foundHotspots.includes(h.id));
      missedHotspots = hotspots.filter((h) => results.missedHotspots.includes(h.id));
    } else {
      hotspots.forEach((h) => {
        const isFound = pins.some(pin => {
          if (h.width !== undefined && h.height !== undefined) {
            return pin.x >= h.x && pin.x <= h.x + h.width && pin.y >= h.y && pin.y <= h.y + h.height;
          }
          const dx = h.x - pin.x;
          const dy = h.y - pin.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance <= (h.radius || 8);
        });
        if (isFound) foundHotspots.push(h);
        else missedHotspots.push(h);
      });
    }
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
                isCorrect = hotspots.some((h) => {
                  if (pin.id === h.id) return true;
                  if (h.width !== undefined && h.height !== undefined) {
                    return pin.x >= h.x && pin.x <= h.x + h.width && pin.y >= h.y && pin.y <= h.y + h.height;
                  }
                  const dx = h.x - pin.x;
                  const dy = h.y - pin.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  return distance <= (h.radius ?? 8);
                });
              }

              let pinBgClass = "";
              let pinContent: React.ReactNode = null;

              if (config?.simulationType === 'GUIDED_SEQUENCE') {
                const quizErrorHotspotIds = getEvents()
                  .filter((e) => e.type === 'QUIZ_ERROR')
                  .map((e) => e.id);
                const hasQuizError = quizErrorHotspotIds.includes(pin.id);

                if (hasQuizError) {
                  pinBgClass = "bg-classic-crimson-500 text-white ring-2 ring-classic-crimson-300 opacity-80 scale-110";
                  pinContent = <XCircle className="w-4 h-4" />;
                } else {
                  pinBgClass = "bg-emerald-500 text-white ring-2 ring-emerald-300 scale-110";
                  pinContent = <CheckCircle className="w-4 h-4" />;
                }
              } else if (isFinished) {
                if (isSubmitting) {
                  pinBgClass = "bg-yellow-500 text-yellow-950 ring-2 ring-yellow-300 animate-pulse scale-110";
                  pinContent = <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />;
                } else {
                  if (isCorrect) {
                    pinBgClass = "bg-emerald-500 text-white ring-2 ring-emerald-300 scale-110";
                    pinContent = <CheckCircle className="w-4 h-4" />;
                  } else {
                    pinBgClass = "bg-classic-crimson-500 text-white ring-2 ring-classic-crimson-300 opacity-70";
                    pinContent = <XCircle className="w-4 h-4" />;
                  }
                }
              } else {
                pinBgClass = "bg-amber-400 text-amber-950 hover:scale-110 cursor-pointer ring-2 ring-amber-200";
                pinContent = i + 1;
              }

              return (
                <div 
                  key={pin.id}
                  className={clsx(
                    "absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all duration-300 transform",
                    pinBgClass
                  )}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  onClick={(e) => handleRemovePin(e, pin.id)}
                >
                  {pinContent}
                </div>
              );
            })}

            {/* Render Hotspots if finished and fully evaluated */}
            {isFinished && !isSubmitting && hotspots.map((h) => {
              const quizErrorHotspotIds = getEvents()
                .filter((e) => e.type === 'QUIZ_ERROR')
                .map((e) => e.id);
              const hasQuizError = quizErrorHotspotIds.includes(h.id);
              const isFound = pins.some((p) => p.id === h.id);

              const isSuccess = isFound && !hasQuizError;
              const borderColorClass = isSuccess ? "border-emerald-400" : "border-classic-crimson-400";
              const bgColor = isSuccess ? "rgba(52, 211, 153, 0.1)" : "rgba(220, 38, 38, 0.1)";

              if (h.width !== undefined && h.height !== undefined) {
                return (
                  <div 
                    key={`hotspot-${h.id}`}
                    className={clsx(
                      "absolute border-2 border-dashed rounded-lg animate-pulse pointer-events-none",
                      borderColorClass
                    )}
                    style={{ 
                      left: `${h.x}%`, 
                      top: `${h.y}%`, 
                      width: `${h.width}%`, 
                      height: `${h.height}%`,
                      backgroundColor: bgColor
                    }}
                  />
                );
              }
              const rad = h.radius || 8;
              return (
                <div 
                  key={`hotspot-${h.id}`}
                  className={clsx(
                    "absolute border-2 border-dashed rounded-full animate-pulse pointer-events-none",
                    borderColorClass
                  )}
                  style={{ 
                    left: `${h.x}%`, 
                    top: `${h.y}%`, 
                    width: `${rad * 2}%`, 
                    height: `${rad * 2}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: bgColor
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Info Panel (30%) */}
        <div className="w-[30%] bg-slate-indigo-900 border-l border-slate-indigo-800 p-6 flex flex-col overflow-y-auto">
          {!isFinished ? (
            config?.simulationType === 'GUIDED_SEQUENCE' ? (
              <div className="space-y-6 flex-1 flex flex-col">
                <div>
                  <Badge className="bg-amber-500 hover:bg-amber-500 text-amber-950 font-bold mb-2">
                    PROTOCOLO NOM-029 / NFPA 70E
                  </Badge>
                  <h2 className="text-xl font-bold text-white mb-1">
                    Disciplina Operativa
                  </h2>
                  <p className="text-slate-indigo-300 text-sm">
                    Sigue estrictamente la secuencia técnica de seguridad eléctrica.
                  </p>
                </div>

                {/* Progress bar */}
                <div className="bg-slate-indigo-950 rounded-xl p-4 border border-slate-indigo-800/85">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-indigo-400 font-semibold uppercase tracking-wider text-[10px]">Progreso de la Libranza</span>
                    <span className="text-amber-400 font-bold text-xs">{Math.min(currentStepOrder, hotspots.length)} / {hotspots.length} Pasos</span>
                  </div>
                  <div className="w-full bg-slate-indigo-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2 transition-all duration-500"
                      style={{ width: `${hotspots.length > 0 ? ((Math.min(currentStepOrder, hotspots.length) - 1) / hotspots.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Quiz Panel or Navigation Panel */}
                {activeQuiz ? (
                  <div className="bg-slate-indigo-950 rounded-xl p-5 border-2 border-amber-500/30 flex-1 flex flex-col space-y-4 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Medida Preventiva: {activeQuiz.riskType}
                    </div>
                    
                    <h3 className="text-md font-bold text-white leading-snug">
                      {activeQuiz.quiz?.question}
                    </h3>

                    <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[40vh] pr-1">
                      {activeQuiz.quiz?.options?.map((opt) => {
                        const isSelected = selectedOptionId === opt.id;
                        let optionStyle = "border-slate-indigo-800 bg-slate-indigo-900/60 hover:bg-slate-indigo-800/60 text-slate-indigo-200";
                        if (isSelected) {
                          optionStyle = "border-amber-500 bg-amber-500/10 text-white font-medium";
                        }
                        if (quizFeedback !== null) {
                          const isCorrectOption = opt.isCorrect;
                          if (isCorrectOption) {
                            optionStyle = "border-emerald-500 bg-emerald-500/15 text-white font-medium";
                          } else if (isSelected && !isCorrectOption) {
                            optionStyle = "border-classic-crimson-500 bg-classic-crimson-500/15 text-white";
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            disabled={isQuizSuccess !== null}
                            onClick={() => handleAnswerOptionSelect(opt.id)}
                            className={clsx(
                              "w-full text-left p-3.5 rounded-xl border text-sm transition-all duration-300 leading-relaxed shadow-sm flex items-start gap-2.5",
                              optionStyle
                            )}
                          >
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                              {isSelected ? "●" : ""}
                            </span>
                            <span>{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback Explanation */}
                    {quizFeedback && (
                      <div className={clsx(
                        "p-4 rounded-xl text-xs leading-relaxed border",
                        isQuizSuccess 
                          ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                          : "bg-classic-crimson-950/40 border-classic-crimson-500/30 text-classic-crimson-300"
                      )}>
                        <div className="font-bold mb-1 uppercase tracking-wider text-[10px]">
                          {isQuizSuccess ? "Justificación Técnica (NOM-029):" : "Desviación de Seguridad:"}
                        </div>
                        {quizFeedback}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-2">
                      {isQuizSuccess !== null ? (
                        <Button 
                          onClick={handleQuizNext}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 text-sm font-semibold shadow-lg shadow-emerald-900/20"
                        >
                          Continuar al Siguiente Paso
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleQuizSubmit}
                          disabled={!selectedOptionId}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-amber-950 py-5 text-sm font-bold shadow-lg shadow-amber-900/20"
                        >
                          Confirmar Acción Segura
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col space-y-4">
                    <div className="bg-slate-indigo-950 rounded-xl p-5 border border-slate-indigo-800/80 flex-1 flex flex-col">
                      <h3 className="font-semibold text-slate-indigo-200 mb-4 text-xs uppercase tracking-wider">
                        Lista de Verificación de Seguridad
                      </h3>

                      <div className="space-y-3 flex-1 overflow-y-auto">
                        {hotspots.map((h) => {
                          const isCompleted = h.stepOrder < currentStepOrder;
                          const isActive = h.stepOrder === currentStepOrder;
                          const isPending = h.stepOrder > currentStepOrder;

                          return (
                            <div 
                              key={h.id}
                              className={clsx(
                                "flex items-start gap-3 p-3 rounded-xl border transition-all duration-300",
                                isCompleted && "bg-emerald-950/10 border-emerald-950/30 text-slate-indigo-300",
                                isActive && "bg-amber-500/5 border-amber-500/30 text-white font-medium ring-1 ring-amber-500/20 shadow-md",
                                isPending && "bg-slate-indigo-900/20 border-slate-indigo-900/40 text-slate-indigo-500 opacity-60"
                              )}
                            >
                              <div className="mt-0.5">
                                {isCompleted ? (
                                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                                ) : isActive ? (
                                  <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center">
                                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-slate-indigo-700" />
                                )}
                              </div>
                              <div>
                                <span className="text-sm font-bold block">
                                  Paso {h.stepOrder}: {h.riskType}
                                </span>
                                {isActive && (
                                  <p className="text-xs text-amber-400 mt-1 leading-relaxed animate-pulse">
                                    {h.instruction}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
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
            )
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
                    {foundHotspots.map((h, index) => {
                      const quizErrorEvent = getEvents().find(
                        (e) => e.type === 'QUIZ_ERROR' && e.id === h.id
                      );
                      const hasQuizError = !!quizErrorEvent;

                      if (config?.simulationType === 'GUIDED_SEQUENCE' && hasQuizError) {
                        const selectedOption = h.quiz?.options?.find((o) => o.id === quizErrorEvent.optionId);
                        return (
                          <li key={`found-${index}`} className="flex gap-3 border-l-2 border-classic-crimson-500 pl-3 py-1">
                            <XCircle className="text-classic-crimson-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="text-classic-crimson-400 font-medium text-sm block mb-1">
                                Paso Incorrecto (Quiz Fallado): {h.riskType}
                              </span>
                              <p className="text-slate-indigo-300 text-xs leading-relaxed mb-2">
                                {h.justification || 'Riesgo detectado de forma incorrecta.'}
                              </p>
                              {selectedOption && (
                                <div className="bg-classic-crimson-950/40 border border-classic-crimson-900/60 rounded p-2.5 text-xs">
                                  <p className="text-classic-crimson-300 font-semibold mb-1">
                                    Respuesta incorrecta seleccionada:
                                  </p>
                                  <p className="text-slate-200 italic mb-1">"{selectedOption.text}"</p>
                                  <p className="text-classic-crimson-400">
                                    <strong>Motivo:</strong> {selectedOption.feedback || "Esta medida no cumple con las directrices de seguridad de la planta."}
                                  </p>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      }

                      return (
                        <li key={`found-${index}`} className="flex gap-3">
                          <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-emerald-400 font-medium text-sm block mb-1">
                              {config?.simulationType === 'GUIDED_SEQUENCE' ? "Paso Completado" : "Identificado"}: {h.riskType}
                            </span>
                            <p className="text-slate-indigo-300 text-xs leading-relaxed">
                              {h.justification || 'Riesgo detectado correctamente.'}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                    {missedHotspots.map((h, index) => (
                      <li key={`missed-${index}`} className="flex gap-3">
                        <XCircle className="text-classic-crimson-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-classic-crimson-400 font-medium text-sm block mb-1">
                            {config?.simulationType === 'GUIDED_SEQUENCE' ? "Paso Omitido" : "Omitido"}: {h.riskType}
                          </span>
                          <p className="text-slate-indigo-300 text-xs leading-relaxed">
                            {h.justification || 'No lograste completar esta fase. Es fundamental seguir toda la secuencia de seguridad.'}
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
