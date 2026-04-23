import React, { useState, useRef, useCallback } from "react";
import { Button } from "../../ui/button"
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { X, FileText, Link, Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useModuleUpload } from "./hooks/use-module-upload";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentType = "READING" | "VIDEO" | "IMAGE" | "PDF";

export interface EditableModule {
  title: string;
  description: string;
  duration: string;
  contentType: ContentType;
  contentText: string;
  contentUrl: string;
  contentFile: File | null;
}

type EditorTab = "text" | "file" | "url";

const ACCEPTED_EXTENSIONS: Record<ContentType, string> = {
  READING: ".txt,.md",
  PDF: ".pdf",
  IMAGE: ".jpg,.jpeg,.png,.webp,.gif",
  VIDEO: ".mp4,.mov,.webm",
};

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  READING: "Texto / Lectura",
  PDF: "PDF",
  IMAGE: "Imagen",
  VIDEO: "Video",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface EditModuleModalProps {
  module: EditableModule;
  open: boolean;
  onClose: () => void;
  onSave: (updated: EditableModule) => void;
}

export const EditModuleModal: React.FC<EditModuleModalProps> = ({
  module,
  open,
  onClose,
  onSave,
}) => {
  const [draft, setDraft] = useState<EditableModule>({ ...module });
  const [activeTab, setActiveTab] = useState<EditorTab>("text");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, status: uploadStatus, error: uploadError, reset: resetUpload } = useModuleUpload();

  const updateDraft = (partial: Partial<EditableModule>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  };

  // ── File handling ────────────────────────────────────────────────────────

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draft.contentType]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    let finalUrl = draft.contentUrl;

    // If user selected a file, upload to Supabase Storage first
    if (draft.contentFile && activeTab === "file") {
      const publicUrl = await uploadFile(draft.contentFile, draft.title);
      if (!publicUrl) return; // upload failed, error shown by hook
      finalUrl = publicUrl;
    }

    onSave({ ...draft, contentUrl: finalUrl, contentFile: null });
    onClose();
  };

  const isSaving = uploadStatus === "uploading";

  // ── Tabs ─────────────────────────────────────────────────────────────────

  const tabs: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
    { id: "text", label: "Texto", icon: <FileText className="w-4 h-4" /> },
    { id: "file", label: "Subir archivo", icon: <Upload className="w-4 h-4" /> },
    { id: "url", label: "URL externa", icon: <Link className="w-4 h-4" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            Editar módulo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* ── Module metadata ─────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="mod-title">Título del módulo</Label>
              <Input
                id="mod-title"
                value={draft.title}
                onChange={(e) => updateDraft({ title: e.target.value })}
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="mod-desc">Descripción</Label>
              <Textarea
                id="mod-desc"
                rows={3}
                value={draft.description}
                onChange={(e) => updateDraft({ description: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mod-duration">Duración estimada</Label>
              <Input
                id="mod-duration"
                value={draft.duration}
                onChange={(e) => updateDraft({ duration: e.target.value })}
                placeholder="Ej. 45 min"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mod-type">Tipo de contenido</Label>
              <select
                id="mod-type"
                value={draft.contentType}
                onChange={(e) =>
                  updateDraft({
                    contentType: e.target.value as ContentType,
                    contentFile: null,
                    contentUrl: "",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {(Object.keys(CONTENT_TYPE_LABELS) as ContentType[]).map((ct) => (
                  <option key={ct} value={ct}>
                    {CONTENT_TYPE_LABELS[ct]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Content source tabs ─────────────────────────────────── */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors flex-1 justify-center
                    ${activeTab === tab.id
                      ? "bg-white border-b-2 border-blue-600 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4">
              {/* Tab: Texto */}
              {activeTab === "text" && (
                <div className="space-y-2">
                  <Label htmlFor="mod-content-text">
                    Contenido del módulo (texto / markdown)
                  </Label>
                  <Textarea
                    id="mod-content-text"
                    rows={8}
                    value={draft.contentText}
                    onChange={(e) => updateDraft({ contentText: e.target.value })}
                    placeholder="Escribe o pega el contenido del módulo aquí..."
                    className="font-mono text-sm"
                  />
                </div>
              )}

              {/* Tab: Archivo */}
              {activeTab === "file" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    Tipos aceptados para{" "}
                    <strong>{CONTENT_TYPE_LABELS[draft.contentType]}</strong>:{" "}
                    {ACCEPTED_EXTENSIONS[draft.contentType]}
                  </p>

                  {/* Drag & drop zone */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors
                      ${isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                  >
                    <Upload
                      className={`w-10 h-10 ${isDragging ? "text-blue-500" : "text-gray-400"
                        }`}
                    />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        Arrastra el archivo aquí o{" "}
                        <span className="text-blue-600 underline underline-offset-2">
                          haz clic para seleccionar
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Máx. 50 MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPTED_EXTENSIONS[draft.contentType]}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                      }}
                    />
                  </div>

                  {/* File selected feedback */}
                  {draft.contentFile && uploadStatus !== "success" && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md text-sm">
                      <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="truncate text-gray-700 flex-1">
                        {draft.contentFile.name}
                      </span>
                      <button
                        onClick={() => updateDraft({ contentFile: null })}
                        className="text-gray-400 hover:text-red-500 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload status feedback */}
                  {uploadStatus === "uploading" && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subiendo archivo a Supabase Storage...
                    </div>
                  )}
                  {uploadStatus === "success" && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Archivo subido exitosamente
                    </div>
                  )}
                  {uploadStatus === "error" && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      {uploadError}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: URL externa */}
              {activeTab === "url" && (
                <div className="space-y-2">
                  <Label htmlFor="mod-url">URL del recurso</Label>
                  <Input
                    id="mod-url"
                    type="url"
                    value={draft.contentUrl}
                    onChange={(e) =>
                      updateDraft({ contentUrl: e.target.value, contentFile: null })
                    }
                    placeholder="https://..."
                  />
                  <p className="text-xs text-gray-400">
                    Puede ser un video de YouTube, PDF público, imagen o cualquier
                    recurso accesible.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Subiendo...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
