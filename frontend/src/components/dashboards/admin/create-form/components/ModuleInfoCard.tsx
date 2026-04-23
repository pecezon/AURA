import React from "react";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";

interface ModuleInfoCardProps {
  title: string;
  onTitleChange: (title: string) => void;
}

export const ModuleInfoCard: React.FC<ModuleInfoCardProps> = ({
  title,
  onTitleChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Información del Módulo</CardTitle>
      </CardHeader>
      <CardContent>
        <Label className="text-sm">Título del Módulo</Label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ej. Fórmulas básicas"
          className="mt-2"
        />
      </CardContent>
    </Card>
  );
};
