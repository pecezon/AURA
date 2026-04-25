import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { BookOpen, Loader2 } from "lucide-react";
import { EditModuleModal } from "./edit-module-modal";
import { PreviewModuleList } from "./preview-module-list";
import { type EditableModule, type ContentType } from "./types/module.types";
import { type DropResult } from "@hello-pangea/dnd";
import { useCreateCourse } from "../../../hooks/useCourses";

interface Scenario {
  question: string;
  description: string;
  type: string;
}

interface GeneratedContent {
  title?: string;
  description?: string;
  duration?: string;
  modules?: EditableModule[];
  scenarios?: Scenario[];
}

interface GeneratedPreviewProps {
  content?: GeneratedContent;
  isLoading?: boolean;
  setGeneratedContent?: React.Dispatch<React.SetStateAction<GeneratedContent | undefined>>;
}

/** Converts a raw AI module (old flat format OR new `contents` array) to EditableModule */
function toEditableModule(mod: any, idx: number): EditableModule {
  if (mod.contents) {
    return {
      id: mod.id ?? crypto.randomUUID(),
      title: mod.title ?? `Módulo ${idx + 1}`,
      description: mod.description ?? "",
      duration: mod.duration ?? "",
      contents: mod.contents,
    };
  }
  const type = (mod.contentType as ContentType) ?? "READING";
  return {
    id: crypto.randomUUID(),
    title: mod.title ?? `Módulo ${idx + 1}`,
    description: mod.description ?? "",
    duration: mod.duration ?? "",
    contents: [{ id: crypto.randomUUID(), title: "", type, content: mod.contentText ?? "", url: mod.contentUrl ?? "", file: null }],
  };
}

/**
 * Serializes editor state into the shape CourseCreateDTO expects.
 * Index → order for both modules and their contents.
 */
function buildPayload(content: GeneratedContent) {
  return {
    title: content.title ?? "Curso sin título",
    description: content.description ?? null,
    isPublished: true,
    duration: content.duration ?? "",
    modules: (content.modules ?? []).map((mod, mIdx) => ({
      title: mod.title,
      order: mIdx,
      contents: mod.contents.map((c, cIdx) => ({
        type: c.type,
        title: c.title || null,
        content: c.content || null,
        url: c.url || null,
        order: cIdx,
      })),
    })),
  };
}


export const GeneratedPreview: React.FC<GeneratedPreviewProps> = ({
  content,
  isLoading = false,
  setGeneratedContent,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { mutate: publishCourse, isPending: isPublishing } = useCreateCourse();
  const hasContent = content && content.title;

  // Normalize all modules to EditableModule (supports old AI flat format)
  const modules: EditableModule[] = (content?.modules ?? []).map(toEditableModule);


  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !content?.modules) return;
    if (result.source.index === result.destination.index) return;
    const reordered = Array.from(content.modules);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setGeneratedContent?.((prev) => prev ? { ...prev, modules: reordered } : prev);
  };

  const handleAddModule = () => {
    const blank: EditableModule = {
      id: crypto.randomUUID(),
      title: "Nuevo módulo",
      description: "",
      duration: "",
      contents: [],
    };
    setGeneratedContent?.((prev) =>
      prev ? { ...prev, modules: [...(prev.modules ?? []), blank] } : prev
    );
  };

  const handleDeleteModule = (idx: number) => {
    const title = modules[idx]?.title ?? "este módulo";
    if (!window.confirm(`¿Eliminar el módulo "${title}"?\nEsta acción no se puede deshacer.`)) return;
    setGeneratedContent?.((prev) => {
      if (!prev?.modules) return prev;
      return { ...prev, modules: prev.modules.filter((_, i) => i !== idx) };
    });
  };

  const handleModuleSave = (updated: EditableModule) => {
    if (editingIndex === null || !content?.modules) return;
    const updatedModules = content.modules.map((mod, idx) =>
      idx === editingIndex ? updated : mod
    );
    setGeneratedContent?.((prev) => prev ? { ...prev, modules: updatedModules } : prev);
    setEditingIndex(null);
  };

  const handleDiscard = () => {
    if (window.confirm("¿Descartar el contenido generado? Esta acción no se puede deshacer.")) {
      setGeneratedContent?.(undefined);
    }
  };

  const handlePublish = () => {
    if (!content) return;
    publishCourse(buildPayload(content), {
      onSuccess: () => {
        alert(`Curso "${content.title}" publicado exitosamente.`);
        setGeneratedContent?.(undefined);
      },
      onError: (err: any) => {
        alert(`Error al publicar: ${err?.response?.data?.message ?? err.message}`);
      },
    });
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
                      <div key={idx} className="bg-purple-50 border border-purple-200 p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold text-purple-900">¿{scenario.question}?</h4>
                        <p className="text-sm text-purple-700">{scenario.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-4 border-t mt-auto shrink-0 bg-white">
                <Button onClick={handleDiscard} variant="outline" className="flex-1" disabled={isPublishing}>
                  Descartar
                </Button>
                <Button className="flex-1" onClick={handlePublish} disabled={isLoading || isPublishing}>
                  {isPublishing
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Publicando...</>
                    : "Publicar Curso"}
                </Button>
              </div>
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

