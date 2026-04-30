export interface ModuleCreateDTO {
  title: string;
  order: number;
  createdAt?: number;
}

export interface ModuleResponse {
  id: string;
  title: string;
  order: number;
  createdAt: string;
}

export interface ModuleContentCreateDTO {
  type: "READING" | "VIDEO" | "IMAGE";
  title?: string | null;
  content?: string | null;
  url?: string | null;
  order: number;
}

export interface ModuleContentResponse {
  id: string;
  type: "READING" | "VIDEO" | "IMAGE";
  title?: string | null;
  content?: string | null;
  url?: string | null;
  order: number;
}

export interface ReactiveCreateDTO {
  text: string;
  isCorrect?: boolean;
}

export interface ReactiveResponse {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionCreateDTO {
  text: string;
  reactives?: ReactiveCreateDTO[];
}

export interface QuestionResponse {
  id: string;
  text: string;
  reactives: ReactiveResponse[];
}

export interface QuizCreateDTO {
  title: string;
  isGeneratedByAI?: boolean;
  questions?: QuestionCreateDTO[];
}

export interface QuizResponse {
  id: string;
  title: string;
  isGeneratedByAI: boolean;
  questions: QuestionResponse[];
}

export interface SimulationCreateDTO {
  title: string;
  passingScore: number;
}

export interface SimulationResponse {
  id: string;
  title: string;
  passingScore: number;
}

export interface CourseCreateDTO {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  duration?: string | null;
  type?: "TECHNICAL" | "SECURITY";
  regulations?: string[];
  isPublished: boolean;
  createdAt?: number;
  updatedAt?: number;
  modules?: (ModuleCreateDTO & {
    contents?: ModuleContentCreateDTO[];
    quizzes?: QuizCreateDTO[];
    simulation?: SimulationCreateDTO | null;
  })[];
}

export interface CourseResponse {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  duration?: string | null;
  type: string;
  regulations: { id: string; name: string }[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  modules: (ModuleResponse & {
    contents: ModuleContentResponse[];
    quizzes: QuizResponse[];
    simulation?: SimulationResponse | null;
  })[];
}
