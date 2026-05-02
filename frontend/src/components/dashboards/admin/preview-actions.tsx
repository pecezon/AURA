import React from "react";
import { Button } from "../../ui/button";
import { Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";

interface PreviewActionsProps {
  isLoading: boolean;
  isPublishing: boolean;
  publishError: string | null;
  publishSuccess: boolean;
  onClearError: () => void;
  onClearSuccess: () => void;
  onDiscard: () => void;
  onPublish: () => void;
}

/**
 * Barra de acciones del preview: botones Descartar / Publicar + banner de error.
 * Separado del orquestador para mantener cada archivo bajo las 200 líneas.
 */
export const PreviewActions: React.FC<PreviewActionsProps> = ({
  isLoading,
  isPublishing,
  publishError,
  publishSuccess,
  onClearError,
  onClearSuccess,
  onDiscard,
  onPublish,
}) => (
  <div className="shrink-0 mt-auto">
    {publishSuccess && (
      <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200 mb-3">
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
        <span className="flex-1">¡Curso publicado exitosamente!</span>
        <button
          onClick={onClearSuccess}
          className="text-green-500 hover:text-green-700 shrink-0"
          aria-label="Cerrar y volver al inicio"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )}
    {publishError && (
      <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-md border border-red-200 mb-3">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <span className="flex-1">{publishError}</span>
        <button
          onClick={onClearError}
          className="text-red-400 hover:text-red-600 shrink-0"
          aria-label="Cerrar mensaje de error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )}
    <div className="flex gap-2 pt-4 border-t bg-white">
      <Button
        onClick={onDiscard}
        variant="outline"
        className="flex-1"
        disabled={isPublishing}
      >
        Descartar
      </Button>
      <Button
        className="flex-1"
        onClick={onPublish}
        disabled={isLoading || isPublishing}
      >
        {isPublishing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Publicando...
          </>
        ) : (
          "Publicar Curso"
        )}
      </Button>
    </div>
  </div>
);
