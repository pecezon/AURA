import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { BookOpen, AlertTriangle } from "lucide-react";
import { EditModuleModal } from "./edit-module-modal";
import { PreviewModuleList } from "./preview-module-list";
import { PreviewActions } from "./preview-actions";
import { PreviewScenarios } from "./preview-scenarios";
import { useGeneratedPreview } from "./hooks/use-generated-preview";
import { type GeneratedContent } from "./types/course.types";
import { type EditableModule } from "./types/module.types";
import { useRegulations } from "@/hooks/useRegulations";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "../../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../ui/dialog";

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
    deleteIndex,
    setDeleteIndex,
    showDiscardConfirm,
    setShowDiscardConfirm,
    confirmDeleteModule,
    confirmDiscard,
    handleModuleSave,
    handlePublish,
  } = useGeneratedPreview(content, setGeneratedContent);

  const { data: regulations } = useRegulations();
  const selectedRegulations = content?.applicableNorms
    ? (regulations || []).filter((r: any) => content.applicableNorms?.includes(r.id))
    : [];

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
              <div className="space-y-2 mb-5 shrink-0">
                <input
                  type="text"
                  value={content!.title || ""}
                  onChange={(e) => setGeneratedContent?.(prev => prev ? { ...prev, title: e.target.value } : prev)}
                  className="w-full text-2xl font-bold text-gray-900 bg-transparent border-0 border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-0 px-0 py-0.5 transition-all"
                  placeholder="Título del curso"
                />
                <textarea
                  value={content!.description || ""}
                  onChange={(e) => setGeneratedContent?.(prev => prev ? { ...prev, description: e.target.value } : prev)}
                  className="w-full text-gray-600 bg-transparent border-0 border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-0 px-0 py-0.5 transition-all resize-none text-sm leading-relaxed overflow-hidden"
                  placeholder="Descripción del curso..."
                  ref={(el) => {
                    if (el) {
                      el.style.height = "auto";
                      el.style.height = `${el.scrollHeight}px`;
                    }
                  }}
                />
                {selectedRegulations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedRegulations.map((r: any) => (
                      <span
                        key={r.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        {r.name}
                      </span>
                    ))}
                  </div>
                )}
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
                    onDelete={setDeleteIndex}
                    onAdd={handleAddModule}
                  />
                </div>

                <PreviewScenarios
                  hasSimulation={modules.some((m) => m.simulation !== undefined)}
                  simulationTitle={modules.find((m) => m.simulation)?.simulation?.title}
                />
              </div>

              {/* Barra de acciones fija al fondo */}
              <PreviewActions
                isLoading={isLoading}
                isPublishing={isPublishing}
                publishError={publishError}
                publishSuccess={publishSuccess}
                onClearError={clearPublishError}
                onClearSuccess={clearPublishSuccess}
                onDiscard={() => setShowDiscardConfirm(true)}
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

      {/* Modal de Edición de Módulo */}
      {moduleBeingEdited && (
        <EditModuleModal
          open={editingIndex !== null}
          module={moduleBeingEdited}
          onClose={() => setEditingIndex(null)}
          onSave={handleModuleSave}
        />
      )}

      {/* Diálogo Shadcn para Confirmar Eliminación de Módulo */}
      <Dialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="p-3 bg-red-50 rounded-full text-red-500 mb-2 border border-red-100">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">¿Eliminar módulo?</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2">
              ¿Estás seguro de que deseas eliminar el módulo{" "}
              <strong>"{deleteIndex !== null && modules[deleteIndex]?.title}"</strong>? Esta acción es irreversible y se perderán todos sus contenidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-center gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeleteIndex(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteModule}>
              Eliminar Módulo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Shadcn para Confirmar Descarte de Curso */}
      <Dialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="p-3 bg-red-50 rounded-full text-red-500 mb-2 border border-red-100">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">¿Descartar contenido?</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2">
              ¿Estás seguro de que deseas descartar este curso generado? Se perderá todo el borrador y volverás al formulario inicial. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-center gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowDiscardConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDiscard}>
              Descartar Curso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
