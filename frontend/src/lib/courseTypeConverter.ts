// Conversión entre tipos de curso en español e inglés

export const courseTypeMap = {
  // Spanish to English
  "Técnico": "TECHNICAL",
  "Seguridad": "SECURITY",
  "Conceptual": "CONCEPTUAL",
  "Procedural": "PROCEDURAL",
  "Habilidades": "SKILLS",
  // English to Spanish
  "TECHNICAL": "Técnico",
  "SECURITY": "Seguridad",
  "CONCEPTUAL": "Conceptual",
  "PROCEDURAL": "Procedural",
  "SKILLS": "Habilidades",
} as const;

export type CourseTypeES = "Técnico" | "Seguridad" | "Conceptual" | "Procedural" | "Habilidades";
export type CourseTypeEN = "TECHNICAL" | "SECURITY" | "CONCEPTUAL" | "PROCEDURAL" | "SKILLS";

/**
 * Convierte un tipo de curso en español a inglés
 */
export function toEnglish(spanishType: string): CourseTypeEN | null {
  const english = courseTypeMap[spanishType as CourseTypeES];
  return (english as CourseTypeEN) || null;
}

/**
 * Convierte un tipo de curso en inglés a español
 */
export function toSpanish(englishType: string): CourseTypeES | null {
  const spanish = courseTypeMap[englishType as CourseTypeEN];
  return (spanish as CourseTypeES) || null;
}

/**
 * Asegura que el tipo sea inglés (convierte si es necesario)
 */
export function ensureEnglish(type: string): CourseTypeEN {
  if (["TECHNICAL", "SECURITY", "CONCEPTUAL", "PROCEDURAL", "SKILLS"].includes(type)) {
    return type as CourseTypeEN;
  }
  return toEnglish(type) || "TECHNICAL";
}
