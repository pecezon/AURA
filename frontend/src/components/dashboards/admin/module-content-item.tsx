import React, { useRef, useState } from "react";
import { type ModuleContent, type ContentType, CONTENT_TYPE_LABELS, ACCEPTED_EXTENSIONS } from "./types/module.types";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { X, FileText, Upload, GripVertical } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

// Types that show a description field instead of a text editor
const DESCRIPTION_TYPES: ContentType[] = ["VIDEO", "IMAGE"];

interface Props {
  content: ModuleContent;
  index: number;
  onUpdate: (id: string, partial: Partial<ModuleContent>) => void;
  onRemove: (id: string) => void;
}

export const ModuleContentItem: React.FC<Props> = ({ content, index, onUpdate, onRemove }) => {
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDescriptionType = DESCRIPTION_TYPES.includes(content.type);
  const acceptedExtensions = ACCEPTED_EXTENSIONS[content.type];

  // Exclusivity: a content item can have a URL or a File, never both
  const hasUrl = content.url.trim().length > 0;
  const hasFile = content.file !== null;
  const fileTabDisabled = hasUrl;
  const urlTabDisabled = hasFile;

  // Derive active tab: if file is set → force "file", if url is set → force "url"
  const [activeTab, setActiveTab] = useState<"text" | "file" | "url">("text");

  const handleTabChange = (tab: "text" | "file" | "url") => {
    if (tab === "file" && fileTabDisabled) return;
    if (tab === "url" && urlTabDisabled) return;
    setActiveTab(tab);
  };

  const handleFile = (file: File) => {
    // Setting a file clears any URL
    onUpdate(content.id, { file, url: "" });
  };

  const handleUrlChange = (url: string) => {
    // Setting a URL clears any staged file
    onUpdate(content.id, { url, file: null });
  };

  const tabClass = (tab: "text" | "file" | "url") => {
    const isActive = activeTab === tab;
    const isDisabled = (tab === "file" && fileTabDisabled) || (tab === "url" && urlTabDisabled);
    if (isDisabled)
      return "flex-1 py-2 text-sm font-medium text-gray-300 cursor-not-allowed bg-gray-50";
    if (isActive)
      return "flex-1 py-2 text-sm font-medium bg-white border-b-2 border-blue-600 text-blue-700";
    return "flex-1 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 cursor-pointer";
  };

  return (
    <Draggable draggableId={content.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white border rounded-lg p-4 mb-4 ${snapshot.isDragging ? "shadow-lg border-blue-400" : "border-gray-200"}`}
        >
          <div className="flex items-start gap-3">
            <div {...provided.dragHandleProps} className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab">
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-4">
              {/* Row: type selector + remove button */}


              {/* Content title */}
              <div className="space-y-1.5">
                <Label>Título del contenido</Label>
                <Input
                  value={content.title}
                  onChange={(e) => onUpdate(content.id, { title: e.target.value })}
                  placeholder={`Ej. ${CONTENT_TYPE_LABELS[content.type]} principal del módulo`}
                />
              </div>


              <div className="flex justify-between items-center">
                <div className="space-y-1.5 flex-1 max-w-sm">
                  <Label>Tipo de contenido</Label>
                  <select
                    value={content.type}
                    onChange={(e) => {
                      setActiveTab("text"); // reset tab when type changes
                      onUpdate(content.id, {
                        type: e.target.value as ContentType,
                        file: null,
                        url: "",
                        content: "",
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {(Object.keys(CONTENT_TYPE_LABELS) as ContentType[]).map((ct) => (
                      <option key={ct} value={ct}>
                        {CONTENT_TYPE_LABELS[ct]}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(content.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" /> Quitar
                </Button>
              </div>

              {/* Tabs */}
              <div>
                <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-md overflow-hidden">
                  <button onClick={() => handleTabChange("text")} className={tabClass("text")}>
                    {isDescriptionType ? "Descripción" : "Texto"}
                  </button>
                  <button
                    onClick={() => handleTabChange("file")}
                    className={tabClass("file")}
                    title={fileTabDisabled ? "Limpia la URL para subir un archivo" : undefined}
                  >
                    Archivo{fileTabDisabled ? " 🔒" : ""}
                  </button>
                  <button
                    onClick={() => handleTabChange("url")}
                    className={tabClass("url")}
                    title={urlTabDisabled ? "Elimina el archivo para usar una URL" : undefined}
                  >
                    URL{urlTabDisabled ? " 🔒" : ""}
                  </button>
                </div>

                <div className="pt-3">
                  {/* Tab: Texto / Descripción */}
                  {activeTab === "text" && (
                    <Textarea
                      rows={isDescriptionType ? 3 : 5}
                      value={content.content}
                      onChange={(e) => onUpdate(content.id, { content: e.target.value })}
                      placeholder={
                        isDescriptionType
                          ? "Describe brevemente este contenido..."
                          : "Escribe o pega el contenido del módulo aquí..."
                      }
                      className="font-mono text-sm"
                    />
                  )}

                  {/* Tab: Archivo */}
                  {activeTab === "file" && !fileTabDisabled && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500">
                        Aceptados para <strong>{CONTENT_TYPE_LABELS[content.type]}</strong>:{" "}
                        {acceptedExtensions}
                      </p>
                      <div
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingFile(false);
                          const f = e.dataTransfer.files[0];
                          if (f) handleFile(f);
                        }}
                        onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                        onDragLeave={() => setIsDraggingFile(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${isDraggingFile
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                          }`}
                      >
                        <Upload className={`w-8 h-8 ${isDraggingFile ? "text-blue-500" : "text-gray-400"}`} />
                        <p className="text-sm font-medium text-gray-700 text-center">
                          Arrastra el archivo o haz clic
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={acceptedExtensions}
                          className="hidden"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                        />
                      </div>

                      {hasFile && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md text-sm">
                          <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                          <span className="truncate text-gray-700 flex-1">{content.file!.name}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); onUpdate(content.id, { file: null }); }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab: URL */}
                  {activeTab === "url" && !urlTabDisabled && (
                    <div className="space-y-1.5">
                      <Input
                        type="url"
                        value={content.url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://..."
                      />
                      <p className="text-xs text-gray-400">
                        Puede ser un video de YouTube, PDF público, imagen o cualquier recurso accesible.
                      </p>
                    </div>
                  )}

                  {/* Locked state messages — shown whenever a tab is blocked, regardless of active tab */}
                  {fileTabDisabled && (
                    <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
                      🔒 El tab <strong>Archivo</strong> está deshabilitado. Limpia la URL para poder subir un archivo.
                    </p>
                  )}
                  {urlTabDisabled && (
                    <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
                      🔒 El tab <strong>URL</strong> está deshabilitado. Quita el archivo adjunto para usar una URL.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
