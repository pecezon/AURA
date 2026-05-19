import { useState } from "react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Loader2 } from "lucide-react";
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
  
  const { mutateAsync: submitQuiz, isPending: isSubmittingQuiz } = useCreateQuizAttempt();

  if (isLoading || isProgressLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar role="EMPLOYEE" />
        <div className="max-w-4xl mx-auto p-6 w-full space-y-6 mt-8 animate-pulse">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-64 w-full rounded-xl" />
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

  const handleComplete = () => {
    markModuleAsCompleted(moduleId);
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
      return (
        <Card className="border-0 shadow-sm min-h-[400px]">
          <CardContent className="p-8 md:p-12">
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
        <Card className="border-0 shadow-sm min-h-[400px] flex flex-col items-center justify-center p-8">
          {slide.title && <h2 className="text-2xl font-semibold mb-6 w-full text-slate-800 text-left">{slide.title}</h2>}
          <div className="w-full max-w-3xl rounded-xl overflow-hidden border border-gray-200">
             <img src={slide.url} alt={slide.title || "Imagen del módulo"} className="w-full h-auto object-cover" />
          </div>
        </Card>
      );
    }

    if (slide.type === 'VIDEO') {
      const ytMatch = slide.url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      const isYouTube = ytMatch && ytMatch[2].length === 11;
      const videoId = isYouTube ? ytMatch[2] : null;

      return (
        <Card className="border-0 shadow-sm min-h-[400px] flex flex-col items-center justify-center p-8">
          {slide.title && <h2 className="text-2xl font-semibold mb-6 w-full text-slate-800 text-left">{slide.title}</h2>}
          <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-gray-200 bg-black">
             {isYouTube ? (
               <iframe 
                 src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
                 className="w-full h-full border-0"
               />
             ) : (
               <video src={slide.url} controls className="w-full h-full" />
             )}
          </div>
        </Card>
      );
    }

    if (slide.type === 'QUIZ') {
      const result = quizResults[slide.id];
      return (
        <Card className="border-0 shadow-sm min-h-[400px]">
          <CardContent className="p-8 md:p-12">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">Evaluación: {slide.title}</h2>
              {result && (
                <div className={`px-4 py-2 rounded-full font-bold text-sm ${result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {result.passed ? 'Aprobado' : 'Reprobado'} - {result.score.toFixed(0)}%
                </div>
              )}
            </div>
            <div className="space-y-8">
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

    return (
       <Card className="border-0 shadow-sm min-h-[400px] flex items-center justify-center p-8 text-gray-500">
         Contenido no soportado
       </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar role="EMPLOYEE" />
      
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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
        <Progress value={progressPercent} className="h-2 mb-8 bg-gray-200" />

        {/* Content Area */}
        <div className="flex-1 mb-8">
          {slides.length > 0 ? renderContent(currentSlide) : (
            <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
              Este módulo no tiene contenido aún.
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between mt-auto bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
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
