import React from "react";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { type EditableModule } from "./types/module.types";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { ModuleCard } from "./module-card";

interface PreviewModuleListProps {
  modules: EditableModule[];
  onDragEnd: (result: DropResult) => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
}

export const PreviewModuleList: React.FC<PreviewModuleListProps> = ({
  modules,
  onDragEnd,
  onEdit,
  onDelete,
  onAdd,
}) => (
  <div className="space-y-3">
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="modules-list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
            {modules.map((mod, idx) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                index={idx}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>

    <Button
      variant="outline"
      size="sm"
      className="w-full gap-1.5 border-dashed text-gray-500 hover:text-gray-700"
      onClick={onAdd}
    >
      <Plus className="w-4 h-4" />
      Añadir módulo
    </Button>
  </div>
);
