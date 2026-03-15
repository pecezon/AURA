import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { BookOpen } from "lucide-react";

interface Module {
  title: string;
  description: string;
  duration: string;
}

interface Scenario {
  question: string;
  description: string;
  type: string;
}

interface GeneratedContent {
  title?: string;
  description?: string;
  modules?: Module[];
  scenarios?: Scenario[];
}

interface GeneratedPreviewProps {
  content?: GeneratedContent;
  isLoading?: boolean;
  setGeneratedContent?: React.Dispatch<React.SetStateAction<GeneratedContent | undefined>>;
}

export const GeneratedPreview: React.FC<GeneratedPreviewProps> = ({ 
  content, 
  isLoading = false, 
  setGeneratedContent
}) => {
  const hasContent = content && content.title;


  
  const handleDiscard = () => {
    if (window.confirm("¿Estás seguro de que deseas descartar el contenido generado? Esta acción no se puede deshacer.")) {
      setGeneratedContent?.(undefined);
    }
  };


  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Vista Previa del Contenido</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-sm text-gray-600">Generando contenido...</p>
          </div>
        ) : hasContent ? (
            <div>
                <div className="space-y-2">
              <h3 className="text-2xl font-bold">{content!.title}</h3>
              <p className="text-gray-600">{content!.description}</p>
            </div>
          <div className="space-y-6 overflow-y-auto max-h-[500px]">
            

            {content!.modules && content!.modules.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <label className="text-lg font-semibold">Módulos Generados ({content!.modules.length})</label>
                </div>
                {content!.modules.map((module, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 p-4 rounded-lg space-y-2">
                    <h4 className="font-semibold text-gray-900">{module.title}</h4>
                    <p className="text-sm text-gray-600">{module.description}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <span>🕐</span>
                      {module.duration}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {content!.scenarios && content!.scenarios.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <label className="text-lg font-semibold">Escenarios de Simulación ({content!.scenarios.length})</label>
                </div>
                {content!.scenarios.map((scenario, idx) => (
                  <div key={idx} className="bg-purple-50 border border-purple-200 p-4 rounded-lg space-y-2">
                    <h4 className="font-semibold text-purple-900">¿{scenario.question}?</h4>
                    <p className="text-sm text-purple-700">{scenario.description}</p>
                  </div>
                ))}
              </div>
            )}

            </div>
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleDiscard} variant="outline" className="flex-1">
                Descartar
              </Button>
              <Button className="flex-1" disabled={isLoading}>
                Publicar Curso
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <BookOpen className="w-12 h-12 text-gray-300" />
            <p className="text-center text-gray-500">
              El contenido generado aparecerá aquí
            </p>
            <p className="text-sm text-gray-400">
              Completa el formulario y genera contenido con IA
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
