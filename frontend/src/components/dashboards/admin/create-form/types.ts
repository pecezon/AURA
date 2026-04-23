export interface ContentItem {
  id: string;
  type: "lectura" | "video" | "imagen";
  title: string;
  content: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface SimulationData {
  title: string;
  instructions: string;
  minScore: number;
}

export interface ModuleData {
  id: string;
  title: string;
  contentItems: ContentItem[];
  quizzes: QuizQuestion[];
  simulation?: SimulationData;
}

export interface CreateFormData {
  courseTitle: string;
  courseDescription: string;
  modules: ModuleData[];
}

export type Step = "courseInfo" | "modules" | "moduleContent" | "review";
