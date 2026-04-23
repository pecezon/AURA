import React from "react";
import { Button } from "../../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { ModuleData } from "../types";

interface Step2Props {
  modules: ModuleData[];
  onAddModule: () => void;
  onSelectModule: (moduleId: string) => void;
  onRemoveModule: (moduleId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const Step2Modules: React.FC<Step2Props> = ({
  modules,
  onAddModule,
  onSelectModule,
  onRemoveModule,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
              2
            </span>
            Crear Módulos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Tienes {modules.length} módulo{modules.length !== 1 ? "s" : ""} creado
              {modules.length !== 1 ? "s" : ""}
            </p>
            <Button
              onClick={onAddModule}
              variant="outline"
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Módulo
            </Button>

            {modules.length > 0 && (
              <div className="mt-4 space-y-2 pt-4 border-t">
                {modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="p-3 rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => onSelectModule(module.id)}
                      >
                        <p className="font-semibold text-sm text-gray-900">
                          {module.title || `Módulo ${index + 1}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {module.contentItems.length} contenido
                          {module.contentItems.length !== 1 ? "s" : ""} •{" "}
                          {module.quizzes.length} pregunta
                          {module.quizzes.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => onSelectModule(module.id)}
                          size="sm"
                          variant="ghost"
                          className="text-blue-600"
                        >
                          Editar
                        </Button>
                        <button
                          onClick={() => onRemoveModule(module.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between gap-3">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>
        <Button
          onClick={onNext}
          disabled={modules.length === 0}
          className="gap-2"
        >
          Revisar y Publicar
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
