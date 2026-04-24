import React from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Loader2, AlertCircle, X } from "lucide-react";
import { useModuleEditor } from "./hooks/use-module-editor";
import { type EditableModule } from "./types/module.types";
import { ModuleContentList } from "./module-content-list";

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
  const {
    draft,
    updateDraft,
    addContent,
    updateContent,
    removeContent,
    moveContent,
    handleSave,
    isSaving,
    uploadStatus,
    uploadError,
    saveError,
    clearSaveError,
  } = useModuleEditor(module, onSave, onClose);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            Editar módulo: {module.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* ── Module metadata ─────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
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
                rows={2}
                value={draft.description}
                onChange={(e) => updateDraft({ description: e.target.value })}
              />
            </div>

            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label htmlFor="mod-duration">Duración estimada</Label>
              <Input
                id="mod-duration"
                value={draft.duration}
                onChange={(e) => updateDraft({ duration: e.target.value })}
                placeholder="Ej. 45 min"
              />
            </div>
          </div>

          {/* ── Module Contents List ─────────────────────────────────── */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-900 border-b pb-2">Contenidos del Módulo</h4>
            <ModuleContentList
              contents={draft.contents}
              onAdd={addContent}
              onUpdate={updateContent}
              onRemove={removeContent}
              onMove={moveContent}
            />
          </div>

          {/* Upload error feedback */}
          {uploadStatus === "error" && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
              <AlertCircle className="w-4 h-4" />
              Error subiendo archivos: {uploadError}
            </div>
          )}

          {/* Save error banner — shown when one or more file uploads fail */}
          {saveError && (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-md border border-red-200">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="flex-1">{saveError}</span>
              <button onClick={clearSaveError} className="text-red-400 hover:text-red-600 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
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
