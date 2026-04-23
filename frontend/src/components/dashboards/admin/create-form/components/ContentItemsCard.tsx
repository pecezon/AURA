import React from "react";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import { Textarea } from "../../../../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { Trash2 } from "lucide-react";
import type { ContentItem } from "../types";

interface ContentItemsCardProps {
  contentItems: ContentItem[];
  moduleId: string;
  onAddContentItem: (moduleId: string, type: "lectura" | "video" | "imagen") => void;
  onRemoveContentItem: (moduleId: string, itemId: string) => void;
  onUpdateContentItem: (moduleId: string, itemId: string, updates: Partial<ContentItem>) => void;
}

export const ContentItemsCard: React.FC<ContentItemsCardProps> = ({
  contentItems,
  moduleId,
  onAddContentItem,
  onRemoveContentItem,
  onUpdateContentItem,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Contenido</CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={() => onAddContentItem(moduleId, "lectura")}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            + Lectura
          </Button>
          <Button
            onClick={() => onAddContentItem(moduleId, "video")}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            + Video
          </Button>
          <Button
            onClick={() => onAddContentItem(moduleId, "imagen")}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            + Imagen
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {contentItems.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Sin contenido. Agrega lectura, video o imagen.
          </p>
        ) : (
          contentItems.map((item) => (
            <div key={item.id} className="p-3 border border-gray-200 rounded-md space-y-3 bg-gray-50">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-blue-600 uppercase">
                  {item.type === "lectura" && "📄 Lectura"}
                  {item.type === "video" && "▶️ Video"}
                  {item.type === "imagen" && "🖼️ Imagen"}
                </span>
                <button
                  onClick={() => onRemoveContentItem(moduleId, item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Título</Label>
                <Input
                  value={item.title}
                  onChange={(e) =>
                    onUpdateContentItem(moduleId, item.id, { title: e.target.value })
                  }
                  placeholder="Ej. ¿Qué es una fórmula?"
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">
                  {item.type === "lectura" && "Contenido de Lectura"}
                  {item.type === "video" && "URL del Video"}
                  {item.type === "imagen" && "URL de la Imagen"}
                </Label>
                <Textarea
                  value={item.content}
                  onChange={(e) =>
                    onUpdateContentItem(moduleId, item.id, { content: e.target.value })
                  }
                  placeholder={
                    item.type === "lectura"
                      ? "Escribe el contenido de lectura..."
                      : "Pega la URL..."
                  }
                  rows={item.type === "lectura" ? 3 : 2}
                  className="text-sm"
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
