import { useState, useRef, useCallback, useEffect } from "react";
import { useModuleUpload } from "./use-module-upload";
import { type EditableModule, type EditorTab, ACCEPTED_EXTENSIONS, } from "../types/module.types";

// ─── Return shape ─────────────────────────────────────────────────────────────

export interface UseModuleEditorReturn {
  // Draft state
  draft: EditableModule;
  updateDraft: (partial: Partial<EditableModule>) => void;

  // Tab state
  activeTab: EditorTab;
  setActiveTab: (tab: EditorTab) => void;

  // Drag & drop
  isDragging: boolean;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;

  // File selection (for hidden input)
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearFile: () => void;
  acceptedExtensions: string;

  // Save
  handleSave: () => Promise<void>;
  isSaving: boolean;

  // Upload feedback
  uploadStatus: "idle" | "uploading" | "success" | "error";
  uploadError: string | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useModuleEditor(
  module: EditableModule,
  onSave: (updated: EditableModule) => void,
  onClose: () => void
): UseModuleEditorReturn {
  const [draft, setDraft] = useState<EditableModule>({ ...module });
  const [activeTab, setActiveTab] = useState<EditorTab>("text");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploadFile,
    status: uploadStatus,
    error: uploadError,
    reset: resetUpload,
  } = useModuleUpload();

  // Reset draft when the module prop changes (e.g. user opens a different module)
  useEffect(() => {
    setDraft({ ...module });
    setActiveTab("text");
    resetUpload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module.title]);

  // ── Draft ────────────────────────────────────────────────────────────────

  const updateDraft = (partial: Partial<EditableModule>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  };

  // ── File handling ─────────────────────────────────────────────────────────

  const handleFile = (file: File) => {
    updateDraft({ contentFile: file, contentUrl: "" });
    resetUpload();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    // handleFile closes over updateDraft which is stable; only re-create on type change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draft.contentType]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClearFile = () => updateDraft({ contentFile: null });

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    let finalUrl = draft.contentUrl;

    // If a file is staged, upload to Supabase Storage first and use the public URL
    if (draft.contentFile && activeTab === "file") {
      const publicUrl = await uploadFile(draft.contentFile, draft.title);
      if (!publicUrl) return; // upload failed — error is surfaced via uploadError
      finalUrl = publicUrl;
    }

    onSave({ ...draft, contentUrl: finalUrl, contentFile: null });
    onClose();
  };

  return {
    draft,
    updateDraft,
    activeTab,
    setActiveTab,
    isDragging,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    fileInputRef,
    handleFileInputChange,
    handleClearFile,
    acceptedExtensions: ACCEPTED_EXTENSIONS[draft.contentType],
    handleSave,
    isSaving: uploadStatus === "uploading",
    uploadStatus,
    uploadError,
  };
}
