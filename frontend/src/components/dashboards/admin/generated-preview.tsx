import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { BookOpen, Pencil, CheckCircle2, Link, FileText, Film, Image } from "lucide-react";
import { EditModuleModal } from "./edit-module-modal";
import { type EditableModule, type ContentType } from "./types/module.types";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  return {
    title: mod.title ?? `Módulo ${idx + 1}`,
    description: mod.description ?? "",
    duration: mod.duration ?? "",
    contentType: (mod.contentType as ContentType) ?? "READING",
    contentText: mod.contentText ?? "",
    contentUrl: mod.contentUrl ?? "",
    contentFile: null,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  const moduleBeingEdited =
    editingIndex !== null && content?.modules
      ? toEditableModule(content.modules[editingIndex], editingIndex)
      : null;

  return (
    <>
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Vista Previa del Contenido</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            // ── Loading state ────────────────────────────────────────────
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              <p className="text-sm text-gray-600">Generando contenido...</p>
            </div>
          ) : hasContent ? (
            // ── Content state ────────────────────────────────────────────
            <div>
              {/* Course header */}
              <div className="space-y-1 mb-5">
                <h3 className="text-2xl font-bold">{content!.title}</h3>
                <p className="text-gray-600">{content!.description}</p>
              </div>

              <div className="space-y-6 overflow-y-auto max-h-[500px] pr-1">
                {/* Modules */}
                {content!.modules && content!.modules.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      <span className="text-lg font-semibold">
                        Módulos Generados ({content!.modules.length})
                      </span>
                    </div>

                    {content!.modules.map((mod, idx) => {
                      const module = toEditableModule(mod, idx);
                      const hasResource = module.contentUrl || module.contentText;

                      return (
                        <div
                          key={idx}
                          className="bg-white border border-gray-200 p-4 rounded-lg space-y-3"
                        >
                          {/* Module header row */}
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

                          {/* Module meta row */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              🕐 {module.duration}
                            </span>

                            {/* Content type badge */}
                            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              {CONTENT_TYPE_ICON[module.contentType]}
                              {CONTENT_TYPE_LABEL[module.contentType]}
                            </span>

                            {/* Resource status badge */}
                            {hasResource ? (
                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                                <CheckCircle2 className="w-3 h-3" />
                                Contenido listo
                              </span>
                            ) : module.contentUrl ? (
                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                <Link className="w-3 h-3" />
                                URL adjunta
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                                Sin contenido
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
              <div className="flex gap-2 pt-4 border-t mt-4">
                <Button
                  onClick={handleDiscard}
                  variant="outline"
                  className="flex-1"
                >
                  Descartar
                </Button>
                <Button className="flex-1" disabled={isLoading}>
                  Publicar Curso
                </Button>
              </div>
            </div>
          ) : (
            // ── Empty state ───────────────────────────────────────────────
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

      {/* Edit modal — rendered outside Card to avoid stacking context issues */}
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
