import { useState } from "react";
import { type DropResult } from "@hello-pangea/dnd";
import { type EditableModule } from "../types/module.types";
import { type GeneratedContent } from "../types/course.types";
import { toEditableModule, buildPayload } from "../utils/course.utils";
import { useCreateCourse } from "../../../../hooks/useCourses";

export interface UseGeneratedPreviewReturn {
  modules: EditableModule[];
  editingIndex: number | null;
  moduleBeingEdited: EditableModule | null;
  publishError: string | null;
  publishSuccess: boolean;
  isPublishing: boolean;
  clearPublishError: () => void;
  clearPublishSuccess: () => void;
  setEditingIndex: (idx: number | null) => void;
  handleDragEnd: (result: DropResult) => void;
  handleAddModule: () => void;
  handleDeleteModule: (idx: number) => void;
  handleModuleSave: (updated: EditableModule) => void;
  handleDiscard: () => void;
  handlePublish: () => void;
}

export function useGeneratedPreview(
  content: GeneratedContent | undefined,
  setGeneratedContent: React.Dispatch<React.SetStateAction<GeneratedContent | undefined>> | undefined
): UseGeneratedPreviewReturn {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const { mutate: publishCourse, isPending: isPublishing } = useCreateCourse();

  // Normalizamos todos los módulos una sola vez (soporta formato plano antiguo del AI).
  // Usamos este array derivado en todos los handlers para evitar llamar
  // toEditableModule varias veces y generar UUIDs distintos para el mismo módulo.
  const modules: EditableModule[] = (content?.modules ?? []).map(toEditableModule);

  const moduleBeingEdited = editingIndex !== null ? (modules[editingIndex] ?? null) : null;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !content?.modules) return;
    if (result.source.index === result.destination.index) return;
    // Reordenamos sobre los módulos ya normalizados para mantener consistencia de IDs.
    const reordered = Array.from(modules);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setGeneratedContent?.((prev) => (prev ? { ...prev, modules: reordered } : prev));
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
    if (editingIndex === null) return;
    // Escribimos de vuelta sobre el array normalizado para mantener IDs estables.
    const updatedModules = modules.map((mod, idx) =>
      idx === editingIndex ? updated : mod
    );
    setGeneratedContent?.((prev) => (prev ? { ...prev, modules: updatedModules } : prev));
    setEditingIndex(null);
  };

  const handleDiscard = () => {
    if (window.confirm("¿Descartar el contenido generado? Esta acción no se puede deshacer.")) {
      setGeneratedContent?.(undefined);
    }
  };

  const handlePublish = () => {
    if (!content) return;
    setPublishError(null);

    if (!content.modules?.length) {
      setPublishError("El curso debe tener al menos un módulo antes de publicar.");
      return;
    }

    try {
      const payload = buildPayload(content);
      publishCourse(payload, {
        onSuccess: () => {
          // No limpiamos el contenido inmediatamente: el componente se desmontaría
          // antes de que el banner de éxito se renderice. El usuario lo cierra manualmente.
          setPublishSuccess(true);
        },
        onError: (err: Error & { response?: { data?: { message?: string } } }) => {
          setPublishError(
            err?.response?.data?.message ?? err.message ?? "Error desconocido al publicar."
          );
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al validar el contenido del curso.";
      setPublishError(errorMessage);
    }
  };

  return {
    modules,
    editingIndex,
    moduleBeingEdited,
    publishError,
    publishSuccess,
    isPublishing,
    clearPublishError: () => setPublishError(null),
    // Cierra el banner de éxito Y limpia el contenido generado.
    clearPublishSuccess: () => {
      setPublishSuccess(false);
      setGeneratedContent?.(undefined);
    },
    setEditingIndex,
    handleDragEnd,
    handleAddModule,
    handleDeleteModule,
    handleModuleSave,
    handleDiscard,
    handlePublish,
  };
}
