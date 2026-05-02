import { type EditableModule } from "./module.types";

// ─── Domain Models ─────────────────────────────────────────────────────────────

export interface Scenario {
  question: string;
  description: string;
  type: string;
}

export interface GeneratedContent {
  title?: string;
  description?: string;
  duration?: string;
  courseType?: string;
  applicableNorms?: string[];
  modules?: EditableModule[];
  scenarios?: Scenario[];
}

// ─── API DTOs ──────────────────────────────────────────────────────────────────

export interface CourseContentDTO {
  type: string;
  title: string | null;
  content: string | null;
  url: string | null;
  order: number;
}

export interface CourseModuleDTO {
  title: string;
  order: number;
  contents: CourseContentDTO[];
}

export interface CourseCreateDTO {
  title: string;
  description: string | null;
  isPublished: boolean;
  duration: string | null;
  type: string | null;
  modules: CourseModuleDTO[];
}
