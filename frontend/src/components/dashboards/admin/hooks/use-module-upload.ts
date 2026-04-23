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

      const fileExt = file.name.split(".").pop();
      const timestamp = Date.now();
      const filePath = `${sanitizedTitle}/${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, { upsert: false });

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
