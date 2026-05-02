import { type EditableModule, type ContentType, type RawModule } from "../types/module.types";
import { type GeneratedContent, type CourseCreateDTO } from "../types/course.types";
import { ensureEnglish } from "../../../../lib/courseTypeConverter";

/** Tamaño máximo permitido por archivo antes de intentar el upload (50 MB). */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Convierte un módulo en formato plano del AI (RawModule) a EditableModule.
 * Soporta el formato antiguo (campos flat) y el nuevo (array `contents`).
 */
export function toEditableModule(mod: RawModule, idx: number): EditableModule {
  if (mod.contents) {
    return {
      id: mod.id ?? crypto.randomUUID(),
      title: mod.title ?? `Módulo ${idx + 1}`,
      description: mod.description ?? "",
      duration: mod.duration ?? "",
      contents: mod.contents,
    };
  }
  const type = (mod.contentType as ContentType) ?? "READING";
  return {
    id: crypto.randomUUID(),
    title: mod.title ?? `Módulo ${idx + 1}`,
    description: mod.description ?? "",
    duration: mod.duration ?? "",
    contents: [
      {
        id: crypto.randomUUID(),
        title: "",
        type,
        content: mod.contentText ?? "",
        url: mod.contentUrl ?? "",
        file: null,
      },
    ],
  };
}

/**
 * Serializa el estado del editor al shape que espera CourseCreateDTO.
 * El índice de cada item determina su `order` en backend.
 * Valida que:
 * - courseType esté en inglés
 * - Cada módulo tenga al menos un contenido con datos
 */
export function buildPayload(content: GeneratedContent): CourseCreateDTO {
  // Validar que cada módulo tenga contenido
  const modules = content.modules ?? [];
  for (const mod of modules) {
    if (!mod.contents || mod.contents.length === 0) {
      throw new Error(`El módulo "${mod.title}" no tiene contenido. Cada módulo debe tener al menos un elemento de contenido.`);
    }
    const hasContent = mod.contents.some((c) => c.content?.trim() || c.url?.trim() || c.title?.trim());
    if (!hasContent) {
      throw new Error(`El módulo "${mod.title}" está vacío. Debe contener texto, URL u otro contenido antes de publicar.`);
    }
  }

  return {
    title: content.title ?? "Curso sin título",
    description: content.description ?? null,
    isPublished: true,
    duration: content.duration || null,
    type: ensureEnglish(content.courseType || "TECHNICAL"),
    modules: modules.map((mod, mIdx) => ({
      title: mod.title,
      order: mIdx,
      contents: mod.contents.map((c, cIdx) => ({
        type: c.type,
        title: c.title || null,
        content: c.content || null,
        url: c.url || null,
        order: cIdx,
      })),
    })),
  };
}
