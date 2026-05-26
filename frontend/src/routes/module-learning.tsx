import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Loader2, Download, ExternalLink, Play, Pause, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useModuleById } from "@/hooks/useModules";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { useSessionId } from "@/hooks/useSession";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { useCreateQuizAttempt } from "@/hooks/useQuizzes";
import { toast } from "react-hot-toast";

const sanitizeUrl = (url: string, type?: string): string => {
  if (!url) return "";
  const trimmed = url.trim();

  if (type === 'IMAGE' && /^data:image\//i.test(trimmed)) {
    return trimmed;
  }

  const isSafeScheme = /^(https?:\/\/|\/|blob:)/i.test(trimmed);
  return isSafeScheme ? trimmed : "about:blank";
};

export default function ModuleLearning() {
  const { courseId, moduleId } = useParams({ strict: false }) as { courseId: string; moduleId: string };
  const navigate = useNavigate();

  const { data: sessionId } = useSessionId();
  const profileId = sessionId || "";

  const { data: moduleData, isLoading, isError } = useModuleById(moduleId);
  const { markModuleAsCompleted, isLoading: isProgressLoading } = useCourseProgress(profileId, courseId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizResults, setQuizResults] = useState<Record<string, any>>({});

  // Audio playback state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Stop audio on slide change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentIndex]);

  // Stop audio on route exit/unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const { mutateAsync: submitQuiz, isPending: isSubmittingQuiz } = useCreateQuizAttempt();

  if (isLoading || isProgressLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 pb-12">
        <Navbar role="EMPLOYEE" />

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col justify-between animate-pulse">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <Skeleton className="h-5 w-32 bg-gray-200" />
            <Skeleton className="h-5 w-16 bg-gray-200" />
          </div>

          {/* Progress Bar Skeleton */}
          <Skeleton className="h-2 w-full mb-6 bg-gray-200 shrink-0" />

          {/* Main Card Skeleton */}
          <div className="flex-1 mb-6 flex flex-col">
            <Card className="border-0 shadow-sm flex flex-col h-[60vh] overflow-hidden">
              <CardContent className="p-8 md:p-12 flex-1 space-y-6">
                <Skeleton className="h-8 w-2/3 bg-gray-200" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-[90%] bg-gray-200" />
                  <Skeleton className="h-4 w-[95%] bg-gray-200" />
                  <Skeleton className="h-4 w-[85%] bg-gray-200" />
                </div>
                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <Skeleton className="h-12 w-full max-w-md bg-gray-200 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Skeleton */}
          <div className="flex items-center justify-between mt-auto bg-white p-4 rounded-xl border border-gray-200 shadow-sm shrink-0">
            <Skeleton className="h-10 w-28 bg-gray-200" />
            <Skeleton className="h-10 w-28 bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !moduleData) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar role="EMPLOYEE" />
        <div className="p-6 text-center text-red-500 mt-10">Error al cargar el módulo.</div>
      </div>
    );
  }

  const slides = [...(moduleData.contents || [])];

  if (moduleData.quizzes && moduleData.quizzes.length > 0) {
    slides.push(...moduleData.quizzes.map((q: any) => ({ ...q, type: 'QUIZ' })));
  }

  const isLastSlide = currentIndex === slides.length - 1;
  const currentSlide = slides[currentIndex];

  const progressPercent = slides.length > 1 ? (currentIndex / (slides.length - 1)) * 100 : 100;

  const handleNext = () => {
    if (!isLastSlide) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      await markModuleAsCompleted(moduleId);
    } catch (err) {
      console.error("Error saving progress:", err);
    }
    navigate({ to: `/course/$courseId`, params: { courseId } });
  };

  const handleQuizSubmit = async (quiz: any) => {
    // Check if all questions are answered
    const allAnswered = quiz.questions.every((q: any) => selectedAnswers[q.id]);
    if (!allAnswered) {
      toast.error("Por favor, responde todas las preguntas");
      return;
    }

    const payload = {
      quizId: quiz.id,
      profileId,
      answers: quiz.questions.map((q: any) => ({
        questionId: q.id,
        reactiveId: selectedAnswers[q.id]
      }))
    };

    try {
      const result = await submitQuiz(payload);
      setQuizResults(prev => ({ ...prev, [quiz.id]: result }));
      if (result.passed) {
        toast.success(`¡Quiz aprobado! Calificación: ${result.score.toFixed(0)}`);
      } else {
        toast.error(`Quiz no superado. Calificación: ${result.score.toFixed(0)}`);
      }
    } catch (error) {
      toast.error("Error al enviar el quiz");
    }
  };

  const renderContent = (slide: any) => {
    if (slide.type === 'READING') {
      const safeUrl = sanitizeUrl(slide.url, slide.type);
      const hasUrl = safeUrl && safeUrl !== "about:blank" && safeUrl.trim().length > 0;

      if (hasUrl) {
        const isPdf = safeUrl.toLowerCase().endsWith('.pdf') || safeUrl.toLowerCase().includes('.pdf');

        return (
          <div className="flex flex-col md:flex-row gap-6 items-stretch w-full min-h-[600px] h-[75vh]">
            {/* Left Panel: Details and action */}
            <Card className="border-0 shadow-sm flex-1 md:max-w-[28%] flex flex-col justify-between overflow-hidden h-full">
              <CardContent className="p-6 flex flex-col justify-between h-full overflow-y-auto">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800">{slide.title}</h2>
                  <div className="prose prose-slate text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">
                    {slide.content || "Lee el recurso adjunto a la derecha para continuar con el módulo."}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 shrink-0">
                  <a
                    href={safeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isPdf ? "Descargar archivo PDF" : "Abrir enlace externo"}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Right Panel: Embedded Document / External URL warning card */}
            <Card className="border-0 shadow-sm flex-[2.5] flex flex-col overflow-hidden h-full p-0">
              {isPdf ? (
                <iframe
                  src={`${safeUrl}#toolbar=0&navpanes=0`}
                  className="w-full h-full border-0 bg-slate-50"
                  title={slide.title || "Lector PDF"}
                />
              ) : (
                <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full my-auto">
                  <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-4">
                    <ExternalLink className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Recurso Externo</h3>
                  <p className="text-gray-500 text-sm max-w-md mb-6">
                    Este recurso informativo se encuentra alojado de forma segura en un sitio externo. Haz clic abajo para abrir el enlace en una nueva pestaña del navegador.
                  </p>
                  <a
                    href={safeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors text-sm shadow"
                  >
                    Abrir enlace en pestaña nueva
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </CardContent>
              )}
            </Card>
          </div>
        );
      }

      // Default single column view (no URL)
      return (
        <Card className="border-0 shadow-sm flex flex-col h-full overflow-hidden">
          <CardContent className="p-8 md:p-12 flex-1 overflow-y-auto min-h-0">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-800">{slide.title}</h2>
            <div className="prose prose-slate max-w-none text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {slide.content}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (slide.type === 'IMAGE') {
      return (
        <Card className="border-0 shadow-sm flex flex-col h-full overflow-hidden">
          <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center h-full min-h-0 overflow-y-auto">
            {slide.title && <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 w-full text-left shrink-0">{slide.title}</h2>}
            {slide.content && <p className="text-gray-600 text-sm md:text-base mb-4 w-full text-left shrink-0">{slide.content}</p>}
            <div className="w-full max-w-2xl rounded-xl overflow-hidden border border-gray-150 bg-slate-50 flex items-center justify-center flex-1 min-h-0">
              <img src={sanitizeUrl(slide.url, slide.type)} alt={slide.title || "Imagen del módulo"} className="max-w-full max-h-[55vh] object-contain" />
            </div>
          </CardContent>
        </Card>
      );
    }

    if (slide.type === 'VIDEO') {
      const safeUrl = sanitizeUrl(slide.url, slide.type);
      const ytMatch = safeUrl?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      const isYouTube = ytMatch && ytMatch[2].length === 11;
      const videoId = isYouTube ? ytMatch[2] : null;

      return (
        <Card className="border-0 shadow-sm flex flex-col h-full overflow-hidden">
          <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center h-full min-h-0 overflow-y-auto">
            {slide.title && <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 w-full text-left shrink-0">{slide.title}</h2>}
            {slide.content && <p className="text-gray-600 text-sm md:text-base mb-4 w-full text-left shrink-0">{slide.content}</p>}
            <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-gray-200 bg-black flex-1 min-h-0">
              {isYouTube ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <video src={safeUrl} controls className="w-full h-full" />
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (slide.type === 'QUIZ') {
      const result = quizResults[slide.id];
      return (
        <Card className="border-0 shadow-sm flex flex-col h-full overflow-hidden">
          <CardContent className="p-8 md:p-12 flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-start mb-6 shrink-0">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">Evaluación: {slide.title}</h2>
              {result && (
                <div className={`px-4 py-2 rounded-full font-bold text-sm ${result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {result.passed ? 'Aprobado' : 'Reprobado'} - {result.score.toFixed(0)}%
                </div>
              )}
            </div>
            <div className="space-y-8 flex-1 overflow-y-auto min-h-0 pr-2 pb-4">
              {slide.questions?.map((q: any, qIdx: number) => (
                <div key={q.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-medium mb-4 text-slate-900">{qIdx + 1}. {q.text}</h3>
                  <div className="space-y-3">
                    {q.reactives?.map((r: any) => {
                      const isSelected = selectedAnswers[q.id] === r.id;
                      const isCorrectReactive = r.isCorrect;

                      let itemClass = "bg-white border-gray-200 hover:border-slate-400";
                      let icon = null;

                      if (result) {
                        if (isSelected) {
                          if (isCorrectReactive) {
                            itemClass = "bg-green-50 border-green-500 text-green-900";
                            icon = <CheckCircle className="h-5 w-5 text-green-600" />;
                          } else {
                            itemClass = "bg-red-50 border-red-500 text-red-900";
                            icon = <XCircle className="h-5 w-5 text-red-600" />;
                          }
                        } else if (isCorrectReactive) {
                          itemClass = "bg-green-50 border-green-300 border-dashed text-green-700";
                        }
                      } else if (isSelected) {
                        itemClass = "bg-blue-50 border-blue-500";
                      }

                      return (
                        <label key={r.id} className={`flex items-center justify-between gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${itemClass}`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={r.id}
                              disabled={!!result}
                              checked={isSelected}
                              onChange={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: r.id }))}
                              className="mt-1 disabled:opacity-50"
                            />
                            <span className="text-gray-700">{r.text}</span>
                          </div>
                          {icon}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (slide.type === 'AUDIO') {
      const handlePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          const audio = audioRef.current;
          audio.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(e => {
              console.error("Playback failed", e);
              setIsPlaying(false);
            });
        }
      };

      const handleTimeUpdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      };

      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration || 0);
        }
      };

      const handleAudioEnded = () => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setCurrentTime(0);
      };

      const handleScrubChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (audioRef.current) {
          audioRef.current.currentTime = val;
          setCurrentTime(val);
        }
      };

      const formatTime = (secs: number) => {
        if (isNaN(secs)) return "00:00";
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      };

      return (
        <Card className="border-0 shadow-sm flex flex-col h-full overflow-hidden">
          <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full flex-1 overflow-y-auto min-h-0">
            <audio
              ref={audioRef}
              src={sanitizeUrl(slide.url, slide.type)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleAudioEnded}
              className="hidden"
            />

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-4">
                <Headphones className="w-3.5 h-3.5" />
                Audio Instructivo
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">{slide.title}</h2>
              <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
                {slide.content || "Escucha atentamente el audio explicativo de este módulo."}
              </p>
            </div>

            {/* Visualizer and controls */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto w-full space-y-6 shrink-0">
              {/* Waveform Animation */}
              <div className="h-20 flex items-center justify-center gap-1.5">
                {[...Array(15)].map((_, i) => {
                  const delays = [0.1, 0.4, 0.2, 0.5, 0.3, 0.6, 0.1, 0.4, 0.2, 0.5, 0.3, 0.6, 0.1, 0.4, 0.2];
                  const heights = [16, 28, 44, 56, 32, 48, 36, 20, 12, 32, 48, 36, 20, 28, 16];
                  return (
                    <div
                      key={i}
                      style={{
                        height: isPlaying ? `${heights[i]}px` : '6px',
                        animation: isPlaying ? `wave 1.2s ease-in-out infinite alternate` : 'none',
                        animationDelay: isPlaying ? `${delays[i]}s` : '0s',
                      }}
                      className="w-1.5 bg-blue-500 rounded-full transition-all duration-300"
                    />
                  );
                })}
              </div>

              {/* Scrubber Timeline */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleScrubChange}
                  className="w-full h-1.5 bg-slate-200 hover:bg-slate-300 accent-blue-600 rounded-lg appearance-none cursor-pointer transition-colors"
                />
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Player Button Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePlayPause}
                  className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>

          {/* Inline CSS animation keyframes */}
          <style>{`
            @keyframes wave {
              0% { transform: scaleY(0.4); }
              100% { transform: scaleY(1.4); }
            }
          `}</style>
        </Card>
      );
    }

    return (
      <Card className="border-0 shadow-sm flex items-center justify-center p-8 text-gray-500 h-full">
        Contenido no soportado
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-12">
      <Navbar role="EMPLOYEE" />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <Link
            to="/course/$courseId"
            params={{ courseId }}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Curso
          </Link>
          <div className="text-sm font-medium text-gray-500">
            {slides.length > 0 ? `${currentIndex + 1} de ${slides.length}` : '0 de 0'}
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progressPercent} className="h-2 mb-6 bg-gray-200 shrink-0" />

        {/* Content Area */}
        <div className="flex-1 mb-6 flex flex-col">
          {slides.length > 0 ? renderContent(currentSlide) : (
            <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200 flex-1 flex items-center justify-center">
              Este módulo no tiene contenido aún.
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between mt-auto bg-white p-4 rounded-xl border border-gray-200 shadow-sm shrink-0">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-6 cursor-pointer"
          >
            Anterior
          </Button>

          {slides.length === 0 ? (
            <Button onClick={handleComplete} className="bg-green-600 text-white hover:bg-green-700 px-8 font-medium cursor-pointer">
              Finalizar Módulo sin contenido
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          ) : !isLastSlide ? (
            <Button onClick={handleNext} className="bg-slate-900 text-white hover:bg-slate-800 px-6 cursor-pointer">
              Siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : currentSlide.type === 'QUIZ' && !quizResults[currentSlide.id] ? (
            <Button
              onClick={() => handleQuizSubmit(currentSlide)}
              className="bg-blue-600 text-white hover:bg-blue-700 px-8 font-medium cursor-pointer"
              disabled={isSubmittingQuiz}
            >
              {isSubmittingQuiz ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enviar Respuestas
            </Button>
          ) : (
            <Button onClick={handleComplete} className="bg-green-600 text-white hover:bg-green-700 px-8 font-medium cursor-pointer">
              Finalizar Módulo
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
