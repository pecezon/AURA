import React from "react";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import { Textarea } from "../../../../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { Zap } from "lucide-react";
import type { SimulationData } from "../types";

interface SimulationCardProps {
  simulation: SimulationData | undefined;
  moduleId: string;
  onAddSimulation: (moduleId: string) => void;
  onRemoveSimulation: (moduleId: string) => void;
  onUpdateSimulation: (moduleId: string, updates: Partial<SimulationData>) => void;
}

export const SimulationCard: React.FC<SimulationCardProps> = ({
  simulation,
  moduleId,
  onAddSimulation,
  onRemoveSimulation,
  onUpdateSimulation,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Simulación (Opcional)
        </CardTitle>
        {!simulation ? (
          <Button
            onClick={() => onAddSimulation(moduleId)}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            + Agregar
          </Button>
        ) : (
          <Button
            onClick={() => onRemoveSimulation(moduleId)}
            size="sm"
            variant="outline"
            className="text-xs text-red-600"
          >
            Remover
          </Button>
        )}
      </CardHeader>
      {simulation && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Título</Label>
            <Input
              value={simulation.title}
              onChange={(e) =>
                onUpdateSimulation(moduleId, { title: e.target.value })
              }
              placeholder="Ej. Crear una fórmula SUMA"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Instrucciones</Label>
            <Textarea
              value={simulation.instructions}
              onChange={(e) =>
                onUpdateSimulation(moduleId, { instructions: e.target.value })
              }
              placeholder="Describe el escenario y qué debe hacer el usuario..."
              rows={3}
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Puntaje Mínimo (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={simulation.minScore}
              onChange={(e) =>
                onUpdateSimulation(moduleId, {
                  minScore: parseInt(e.target.value) || 0,
                })
              }
              className="text-sm"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};
