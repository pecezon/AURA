import React from "react";
import { Button } from "../../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { ChevronLeft } from "lucide-react";
import type{ CreateFormData } from "../types";

interface Step4Props {
  formData: CreateFormData;
  onPrevious: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const Step4Review: React.FC<Step4Props> = ({
  formData,
  onPrevious,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
            ✓
          </span>
          Revisar y Publicar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="font-semibold text-blue-900 mb-2">Resumen del Curso</p>
          <div className="space-y-1 text-sm text-blue-800">
            <p>
              <strong>Título:</strong> {formData.courseTitle}
            </p>
            <p>
              <strong>Módulos:</strong> {formData.modules.length}
            </p>
            <p>
              <strong>Total de Contenidos:</strong>{" "}
              {formData.modules.reduce((acc, m) => acc + m.contentItems.length, 0)}
            </p>
            <p>
              <strong>Total de Preguntas:</strong>{" "}
              {formData.modules.reduce((acc, m) => acc + m.quizzes.length, 0)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-gray-900">Módulos incluidos:</p>
          <div className="space-y-2">
            {formData.modules.map((module, index) => (
              <div key={module.id} className="p-3 border border-gray-200 rounded-md bg-gray-50">
                <p className="font-semibold text-sm text-gray-900">
                  Módulo {index + 1}: {module.title || "Sin título"}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {module.contentItems.length} contenido
                  {module.contentItems.length !== 1 ? "s" : ""} •{" "}
                  {module.quizzes.length} pregunta
                  {module.quizzes.length !== 1 ? "s" : ""}
                  {module.simulation && " • Con simulación"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-4">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? "Creando..." : "Publicar Curso"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
