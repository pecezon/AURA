import React from "react";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import { Textarea } from "../../../../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { ChevronRight } from "lucide-react";
import type { CreateFormData } from "../types";

interface Step1Props {
  formData: CreateFormData;
  onCourseInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
}

export const Step1CourseInfo: React.FC<Step1Props> = ({
  formData,
  onCourseInputChange,
  onNext,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
            1
          </span>
          Información del Curso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="courseTitle">Título del Curso *</Label>
          <Input
            id="courseTitle"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={onCourseInputChange}
            placeholder="Ej. Introducción a Excel"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="courseDescription">Descripción del Curso</Label>
          <Textarea
            id="courseDescription"
            name="courseDescription"
            value={formData.courseDescription}
            onChange={onCourseInputChange}
            placeholder="Describe brevemente el contenido y objetivos del curso"
            rows={3}
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={onNext}
            disabled={!formData.courseTitle.trim()}
            className="gap-2"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
