import { useState, useEffect } from "react";
import { useModuleUpload } from "./use-module-upload";
import { type EditableModule, type ModuleContent, type ContentType } from "../types/module.types";

export interface UseModuleEditorReturn {
  draft: EditableModule;
  updateDraft: (partial: Partial<EditableModule>) => void;
  // Content operations
  addContent: (type: ContentType) => void;
  updateContent: (id: string, partial: Partial<ModuleContent>) => void;
  removeContent: (id: string) => void;
  moveContent: (fromIndex: number, toIndex: number) => void;

  // Save state
  handleSave: () => Promise<void>;
  isSaving: boolean;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  uploadError: string | null;
  saveError: string | null;       // partial save failures (bad file uploads)
  clearSaveError: () => void;
}

export function useModuleEditor(
  module: EditableModule,
  onSave: (updated: EditableModule) => void,
  onClose: () => void
): UseModuleEditorReturn {
  const [draft, setDraft] = useState<EditableModule>({ ...module, contents: module.contents || [] });
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    uploadFile,
    status: uploadStatus,
    error: uploadError,
    reset: resetUpload,
  } = useModuleUpload();

  useEffect(() => {
    setDraft({ ...module, contents: module.contents || [] });
    setSaveError(null);
    resetUpload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module.id]);

  const updateDraft = (partial: Partial<EditableModule>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  };

  const addContent = (type: ContentType) => {
    const newContent: ModuleContent = {
      id: crypto.randomUUID(),
      title: "",
      type,
      text: "",
      url: "",
      file: null,
    };
    updateDraft({ contents: [...draft.contents, newContent] });
  };

  const updateContent = (id: string, partial: Partial<ModuleContent>) => {
    updateDraft({
      contents: draft.contents.map((c) => (c.id === id ? { ...c, ...partial } : c)),
    });
  };

  const removeContent = (id: string) => {
    updateDraft({
      contents: draft.contents.filter((c) => c.id !== id),
    });
  };

  const moveContent = (fromIndex: number, toIndex: number) => {
    const newContents = Array.from(draft.contents);
    const [moved] = newContents.splice(fromIndex, 1);
    newContents.splice(toIndex, 0, moved);
    updateDraft({ contents: newContents });
  };

  const handleSave = async () => {
    setSaveError(null);

    // Upload any staged files and collect results (null = upload failed for that content)
    const results = await Promise.all(
      draft.contents.map(async (content) => {
        if (content.file) {
          const publicUrl = await uploadFile(content.file, `${draft.title}-${content.type}`);
          if (!publicUrl) {
            // Signal failure — we'll strip this content's file and report it
            return { content, failed: true };
          }
          return { content: { ...content, url: publicUrl, file: null }, failed: false };
        }
        return { content, failed: false };
      })

    );

    const failedCount = results.filter((r) => r.failed).length;

    if (failedCount > 0) {
      // Remove staged files from failed items so the user can retry or delete them
      const cleanedContents = results.map((r) =>
        r.failed ? { ...r.content, file: null } : r.content
      );
      updateDraft({ contents: cleanedContents });
      setSaveError(
        `${failedCount} archivo${failedCount > 1 ? "s" : ""} no pudo subirse y fue eliminado de la lista. Revisa tu conexión e intenta de nuevo.`
      );
      return; // Keep modal open
    }

    onSave({ ...draft, contents: results.map((r) => r.content) });
    console.log("draft : ", draft);
    onClose();
  };

  return {
    draft,
    updateDraft,
    addContent,
    updateContent,
    removeContent,
    moveContent,
    handleSave,
    isSaving: uploadStatus === "uploading",
    uploadStatus,
    uploadError,
    saveError,
    clearSaveError: () => setSaveError(null),
  };
}
