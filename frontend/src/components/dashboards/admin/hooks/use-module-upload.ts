import { useState } from "react";
import { supabase } from "../../../../lib/supabase";

const BUCKET_NAME = "module-content";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UseModuleUploadReturn {
  uploadFile: (file: File, moduleTitle: string) => Promise<string | null>;
  status: UploadStatus;
  error: string | null;
  reset: () => void;
}

export function useModuleUpload(): UseModuleUploadReturn {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStatus("idle");
    setError(null);
  };

  const uploadFile = async (
    file: File,
    moduleTitle: string
  ): Promise<string | null> => {
    setStatus("uploading");
    setError(null);

    try {
      // Sanitize module title for use in path
      const sanitizedTitle = moduleTitle
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const lastDotIndex = file.name.lastIndexOf(".");
      const fileExt =
        lastDotIndex > -1 && lastDotIndex < file.name.length - 1
          ? file.name.slice(lastDotIndex + 1).toLowerCase().replace(/[^a-z0-9]/g, "")
          : "";
      const timestamp = Date.now();
      // Flat path — no subfolders. contentType is required so Supabase
      // stores the correct MIME type (needed for PDF inline-open and video uploads).
      const filePath = fileExt
        ? `${timestamp}-${sanitizedTitle}.${fileExt}`
        : `${timestamp}-${sanitizedTitle}`;
      
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, { upsert: false, contentType: file.type });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      setStatus("success");
      return data.publicUrl;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error desconocido al subir archivo";
      setError(message);
      setStatus("error");
      return null;
    }
  };

  return { uploadFile, status, error, reset };
}
