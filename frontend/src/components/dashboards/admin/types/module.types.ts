// ─── Content Types ────────────────────────────────────────────────────────────

export type ContentType = "READING" | "VIDEO" | "IMAGE" | "PDF";

export type EditorTab = "text" | "file" | "url";

// ─── Module Shape ─────────────────────────────────────────────────────────────

export interface EditableModule {
  title: string;
  description: string;
  duration: string;
  contentType: ContentType;
  contentText: string;
  contentUrl: string;
  contentFile: File | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const ACCEPTED_EXTENSIONS: Record<ContentType, string> = {
  READING: ".txt,.md",
  PDF: ".pdf",
  IMAGE: ".jpg,.jpeg,.png,.webp,.gif",
  VIDEO: ".mp4,.mov,.webm",
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  READING: "Texto / Lectura",
  PDF: "PDF",
  IMAGE: "Imagen",
  VIDEO: "Video",
};
