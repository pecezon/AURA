import React from "react";
import { type ModuleContent, type ContentType } from "./types/module.types";
import { ModuleContentItem } from "./module-content-item";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";

interface Props {
  contents: ModuleContent[];
  onAdd: (type: ContentType) => void;
  onUpdate: (id: string, partial: Partial<ModuleContent>) => void;
  onRemove: (id: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

export const ModuleContentList: React.FC<Props> = ({ contents, onAdd, onUpdate, onRemove, onMove }) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    onMove(result.source.index, result.destination.index);
  };

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="module-contents">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[100px]">
              {contents.map((content, index) => (
                <ModuleContentItem
                  key={content.id}
                  content={content}
                  index={index}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onAdd("READING")} className="text-xs">
          <Plus className="w-3 h-3 mr-1" /> Añadir Texto
        </Button>
        <Button variant="outline" size="sm" onClick={() => onAdd("IMAGE")} className="text-xs">
          <Plus className="w-3 h-3 mr-1" /> Añadir Imagen
        </Button>
        <Button variant="outline" size="sm" onClick={() => onAdd("VIDEO")} className="text-xs">
          <Plus className="w-3 h-3 mr-1" /> Añadir Video
        </Button>
      </div>
    </div>
  );
};
