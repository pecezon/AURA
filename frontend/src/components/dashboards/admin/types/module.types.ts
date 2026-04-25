// ─── Content Types ────────────────────────────────────────────────────────────

export type ContentType = "READING" | "VIDEO" | "IMAGE";

export type EditorTab = "text" | "file" | "url";

export interface ModuleContent {
  id: string;
  title: string;
  type: ContentType;
  content: string;
  url: string;
  file: File | null;
}

export interface EditableModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  contents: ModuleContent[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const ACCEPTED_EXTENSIONS: Record<ContentType, string> = {
  READING: ".txt,.md,.pdf",
  IMAGE: ".jpg,.jpeg,.png,.webp,.gif",
  VIDEO: ".mp4,.mov,.webm",
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  READING: "Texto / Lectura / PDF",
  IMAGE: "Imagen",
  VIDEO: "Video",
};
