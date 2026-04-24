import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { BookOpen, Pencil, CheckCircle2, FileText, Film, Image, GripVertical } from "lucide-react";
import { EditModuleModal } from "./edit-module-modal";
import { type EditableModule, type ContentType } from "./types/module.types";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

interface Scenario {
  question: string;
  description: string;
  type: string;
}

interface GeneratedContent {
  title?: string;
  description?: string;
  modules?: EditableModule[];
  scenarios?: Scenario[];
}

interface GeneratedPreviewProps {
  content?: GeneratedContent;
  isLoading?: boolean;
  setGeneratedContent?: React.Dispatch<React.SetStateAction<GeneratedContent | undefined>>;
}

const CONTENT_TYPE_ICON: Record<ContentType, React.ReactNode> = {
  READING: <FileText className="w-3.5 h-3.5" />,
  PDF: <FileText className="w-3.5 h-3.5" />,
  IMAGE: <Image className="w-3.5 h-3.5" />,
  VIDEO: <Film className="w-3.5 h-3.5" />,
};

const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  READING: "Lectura",
  PDF: "PDF",
  IMAGE: "Imagen",
  VIDEO: "Video",
};

/** Converts a raw AI-generated module (with description) to an EditableModule */
function toEditableModule(mod: any, idx: number): EditableModule {
  // Backwards compatibility with the old AI format or handle already-migrated modules
  if (mod.contents) {
    return {
      id: mod.id ?? crypto.randomUUID(),
      title: mod.title ?? `Módulo ${idx + 1}`,
      description: mod.description ?? "",
      duration: mod.duration ?? "",
      contents: mod.contents,
    };
  }

  // Convert old single-content format to the new contents array
  const type = (mod.contentType as ContentType) ?? "READING";
  return {
    id: crypto.randomUUID(),
    title: mod.title ?? `Módulo ${idx + 1}`,
    description: mod.description ?? "",
    duration: mod.duration ?? "",
    contents: [
      {
        id: crypto.randomUUID(),
        title: "",
        type: type,
        text: mod.contentText ?? "",
        url: mod.contentUrl ?? "",
        file: null,
      },
    ],
  };
}

export const GeneratedPreview: React.FC<GeneratedPreviewProps> = ({
  content,
  isLoading = false,
  setGeneratedContent,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const hasContent = content && content.title;

  const handleDiscard = () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas descartar el contenido generado? Esta acción no se puede deshacer."
      )
    ) {
      setGeneratedContent?.(undefined);
    }
  };

  const handleModuleSave = (updated: EditableModule) => {
    if (editingIndex === null || !content?.modules) return;
    const updatedModules = content.modules.map((mod, idx) =>
      idx === editingIndex ? updated : mod
    );
    setGeneratedContent?.((prev) =>
      prev ? { ...prev, modules: updatedModules } : prev
    );
    setEditingIndex(null);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !content?.modules) return;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) return;

    const newModules = Array.from(content.modules);
    const [moved] = newModules.splice(sourceIndex, 1);
    newModules.splice(destIndex, 0, moved);

    setGeneratedContent?.((prev) =>
      prev ? { ...prev, modules: newModules } : prev
    );
  };

  const moduleBeingEdited =
    editingIndex !== null && content?.modules
      ? toEditableModule(content.modules[editingIndex], editingIndex)
      : null;

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
              <div className="space-y-1 mb-5 shrink-0">
                <h3 className="text-2xl font-bold">{content!.title}</h3>
                <p className="text-gray-600">{content!.description}</p>
              </div>

              <div className="space-y-6 overflow-y-auto flex-1 pr-2 pb-4">
                {/* Modules */}
                {content!.modules && content!.modules.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      <span className="text-lg font-semibold">
                        Módulos Generados ({content!.modules.length})
                      </span>
                    </div>

                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="modules-list">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                            {content!.modules!.map((mod, idx) => {
                              const module = toEditableModule(mod, idx);
                              return (
                                <Draggable key={module.id} draggableId={module.id} index={idx}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`bg-white border rounded-lg p-4 flex gap-3 ${snapshot.isDragging ? "shadow-lg border-blue-400" : "border-gray-200"
                                        }`}
                                    >
                                      <div
                                        {...provided.dragHandleProps}
                                        className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab"
                                      >
                                        <GripVertical className="w-5 h-5" />
                                      </div>

                                      <div className="flex-1 space-y-3 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 truncate">
                                              {module.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                                              {module.description}
                                            </p>
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="shrink-0 gap-1.5"
                                            onClick={() => setEditingIndex(idx)}
                                          >
                                            <Pencil className="w-3.5 h-3.5" />
                                            Editar
                                          </Button>
                                        </div>

                                        <div className="flex items-center gap-3 flex-wrap">
                                          <span className="flex items-center gap-1 text-xs text-gray-500">
                                            🕐 {module.duration}
                                          </span>

                                          {/* Badge list for contents */}
                                          {module.contents.length > 0 ? (
                                            module.contents.map((c) => (
                                              <span
                                                key={c.id}
                                                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${c.url || c.text || c.file
                                                  ? "bg-green-50 text-green-700 border-green-200"
                                                  : "bg-gray-50 text-gray-600 border-gray-200"
                                                  }`}
                                              >
                                                {CONTENT_TYPE_ICON[c.type]}
                                                {CONTENT_TYPE_LABEL[c.type]}
                                                {(c.url || c.text || c.file) && <CheckCircle2 className="w-3 h-3 ml-0.5" />}
                                              </span>
                                            ))
                                          ) : (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                                              Vacío
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                )}

                {/* Scenarios */}
                {content!.scenarios && content!.scenarios.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      <span className="text-lg font-semibold">
                        Escenarios de Simulación ({content!.scenarios.length})
                      </span>
                    </div>
                    {content!.scenarios.map((scenario, idx) => (
                      <div
                        key={idx}
                        className="bg-purple-50 border border-purple-200 p-4 rounded-lg space-y-2"
                      >
                        <h4 className="font-semibold text-purple-900">
                          ¿{scenario.question}?
                        </h4>
                        <p className="text-sm text-purple-700">
                          {scenario.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-4 border-t mt-auto shrink-0 bg-white">
                <Button onClick={handleDiscard} variant="outline" className="flex-1">
                  Descartar
                </Button>
                <Button className="flex-1" disabled={isLoading}>
                  Publicar Curso
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-3 flex-1">
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
