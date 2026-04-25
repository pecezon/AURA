import React from "react";
import { Button } from "../../ui/button";
import { Pencil, Trash2, CheckCircle2, FileText, Film, Image, GripVertical } from "lucide-react";
import { type EditableModule, type ContentType } from "./types/module.types";
import { Draggable } from "@hello-pangea/dnd";

const CONTENT_TYPE_ICON: Record<ContentType, React.ReactNode> = {
  READING: <FileText className="w-3.5 h-3.5" />,
  PDF:     <FileText className="w-3.5 h-3.5" />,
  IMAGE:   <Image    className="w-3.5 h-3.5" />,
  VIDEO:   <Film     className="w-3.5 h-3.5" />,
};

const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  READING: "Lectura",
  PDF:     "PDF",
  IMAGE:   "Imagen",
  VIDEO:   "Video",
};

interface ModuleCardProps {
  module: EditableModule;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, index, onEdit, onDelete }) => (
  <Draggable draggableId={module.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        className={`bg-white border rounded-lg p-4 flex gap-3 ${
          snapshot.isDragging ? "shadow-lg border-blue-400" : "border-gray-200"
        }`}
      >
        <div {...provided.dragHandleProps} className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab">
          <GripVertical className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{module.title}</h4>
              <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{module.description}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onEdit(index)}>
                <Pencil className="w-3.5 h-3.5" />
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete(index)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              🕐 {module.duration || "—"}
            </span>
            {module.contents.length > 0 ? (
              module.contents.map((c) => (
                <span
                  key={c.id}
                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                    c.url || c.text || c.file
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {CONTENT_TYPE_ICON[c.type]}
                  {CONTENT_TYPE_LABEL[c.type]}
                  {(c.url || c.text || c.file) && <CheckCircle2 className="w-3 h-3 ml-0.5" />}
                </span>
              ))
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                Vacío
              </span>
            )}
          </div>
        </div>
      </div>
    )}
  </Draggable>
);
