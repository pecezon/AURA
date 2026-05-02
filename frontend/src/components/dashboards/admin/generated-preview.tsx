import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { BookOpen } from "lucide-react";
import { EditModuleModal } from "./edit-module-modal";
import { PreviewModuleList } from "./preview-module-list";
import { PreviewActions } from "./preview-actions";
import { PreviewScenarios } from "./preview-scenarios";
import { useGeneratedPreview } from "./hooks/use-generated-preview";
import { type GeneratedContent } from "./types/course.types";

interface GeneratedPreviewProps {
  content?: GeneratedContent;
  isLoading?: boolean;
  setGeneratedContent?: React.Dispatch<React.SetStateAction<GeneratedContent | undefined>>;
}

/**
 * Orquestador de la vista previa del contenido generado por IA.
 * Toda la lógica de estado vive en useGeneratedPreview; este componente
 * solo ensambla las piezas visuales.
 */
export const GeneratedPreview: React.FC<GeneratedPreviewProps> = ({
  content,
  isLoading = false,
  setGeneratedContent,
}) => {
  const {
    modules,
    editingIndex,
    moduleBeingEdited,
    publishError,
    publishSuccess,
    isPublishing,
    clearPublishError,
    clearPublishSuccess,
    setEditingIndex,
    handleDragEnd,
    handleAddModule,
    handleDeleteModule,
    handleModuleSave,
    handleDiscard,
    handlePublish,
  } = useGeneratedPreview(content, setGeneratedContent);

  const hasContent = content?.title;

  return (
    <>
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle>Vista Previa del Contenido</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2 flex-1">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              <p className="text-sm text-gray-600">Generando contenido...</p>
            </div>
          ) : hasContent ? (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Encabezado del curso */}
              <div className="space-y-1 mb-5 shrink-0">
                <h3 className="text-2xl font-bold">{content!.title}</h3>
                <p className="text-gray-600">{content!.description}</p>
              </div>

              {/* Cuerpo scrolleable */}
              <div className="space-y-6 overflow-y-auto flex-1 pr-2 pb-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-lg font-semibold">
                      Módulos Generados ({modules.length})
                    </span>
                  </div>
                  <PreviewModuleList
                    modules={modules}
                    onDragEnd={handleDragEnd}
                    onEdit={setEditingIndex}
                    onDelete={handleDeleteModule}
                    onAdd={handleAddModule}
                  />
                </div>

                {content!.scenarios && (
                  <PreviewScenarios scenarios={content!.scenarios} />
                )}
              </div>

              {/* Barra de acciones fija al fondo */}
              <PreviewActions
                isLoading={isLoading}
                isPublishing={isPublishing}
                publishError={publishError}
                publishSuccess={publishSuccess}
                onClearError={clearPublishError}
                onClearSuccess={clearPublishSuccess}
                onDiscard={handleDiscard}
                onPublish={handlePublish}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-3 flex-1">
              <BookOpen className="w-12 h-12 text-gray-300" />
              <p className="text-center text-gray-500">El contenido generado aparecerá aquí</p>
              <p className="text-sm text-gray-400">Completa el formulario y genera contenido con IA</p>
            </div>
          )}
        </CardContent>
      </Card>

      {moduleBeingEdited && (
        <EditModuleModal
          open={editingIndex !== null}
          module={moduleBeingEdited}
          onClose={() => setEditingIndex(null)}
          onSave={handleModuleSave}
        />
      )}
    </>
  );
};
