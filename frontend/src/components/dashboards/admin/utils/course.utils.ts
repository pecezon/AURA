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
    const contentsWithIds = mod.contents.map((c) => ({
      ...c,
      id: c.id ?? crypto.randomUUID(),
      title: c.title ?? "",
      content: c.content ?? "",
      url: c.url ?? "",
      file: c.file ?? null,
    }));
    return {
      id: mod.id ?? crypto.randomUUID(),
      title: mod.title ?? `Módulo ${idx + 1}`,
      description: mod.description ?? "",
      duration: mod.duration ?? "",
      contents: contentsWithIds,
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
    modules: modules.map((mod, mIdx) => {
      const contentsOnly = mod.contents.filter((c) => c.type !== "QUIZ");
      const quizContents = mod.contents.filter((c) => c.type === "QUIZ");

      const quizzes = quizContents.map((c) => {
        let questionText = "Pregunta de Evaluación";
        let reactives: { text: string; isCorrect: boolean }[] = [];
        try {
          if (c.content) {
            const parsed = JSON.parse(c.content);
            questionText = parsed.question || questionText;
            const options = parsed.options || [];
            const correctAnswer = typeof parsed.correctAnswer === "number" ? parsed.correctAnswer : 0;
            reactives = options.map((opt: string, oIdx: number) => ({
              text: opt,
              isCorrect: oIdx === correctAnswer,
            }));
          }
        } catch (e) {
          console.error("Error parsing quiz content:", e);
        }
        return {
          title: c.title || "Evaluación Rápida",
          isGeneratedByAI: false,
          questions: [
            {
              text: questionText,
              reactives,
            },
          ],
        };
      });

      return {
        title: mod.title,
        order: mIdx,
        contents: contentsOnly.map((c, cIdx) => ({
          type: c.type as "READING" | "VIDEO" | "IMAGE",
          title: c.title || null,
          content: c.content || null,
          url: c.url || null,
          order: cIdx,
        })),
        quizzes: quizzes.length > 0 ? quizzes : undefined,
      };
    }),
  };
}
