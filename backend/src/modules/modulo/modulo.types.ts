export interface ModuleContentCreateDTO {
    type : "READING" | "VIDEO" | "IMAGE";
    title?: string | null;
    content?: string | null;
    url?: string | null;
    order: number;
}

export interface ResponseModuleContentDTO {
    id: string;
    moduleId: string;
    type: "READING" | "VIDEO" | "IMAGE";
    title: string | null;
    content: string | null;
    url: string | null;
    order: number;
}

export interface ModuleCreateDTO {
    title : string,
    order : number,
    courseId : string,
    contents : ModuleContentCreateDTO[];
    quizzes : QuizCreateDTO[];
    simulation ?: SimulationCreateDTO | null
}

export interface ModuleResponseDTO {
    id : string,
    title : string,
    order : number,
    createdAt : string,
    courseId : string,
    contents  : ResponseModuleContentDTO[];
    quizzes : QuizResponseDTO[];
    simulation: SimulationResponseDTO | null
}

export interface QuizCreateDTO{
    title: string,
    isGeneratedByAI?: boolean,
    questions : QuestionCreateDTO[]
}

export interface QuizResponseDTO{
    id : string,
    title : string,
    isGeneratedByAI: boolean,
    moduleId : string
    questions : QuestionResponseDTO[]
}

export interface QuestionCreateDTO{
    text : string,
    reactives ?: ReactiveCreateDTO[]
}

export interface QuestionResponseDTO{
    id : string,
    text : string,
    reactives :  ReactiveResponseDTO[]
}

export interface ReactiveResponseDTO {
    id : string,
    text : string,
    isCorrect : boolean,
    questionId : string
}

export interface ReactiveCreateDTO{
    text : string,
    isCorrect?: boolean,
}

export interface SimulationCreateDTO{
    title : string,
    content : string,
    passingScore : number,
}

export interface SimulationResponseDTO{
    id : string,
    title : string,
    content : string,
    passingScore : number,
    moduleId : string
}

export interface ModuleGetByTypeAndCourseDTO {
    courseId : string,
    type: "READING" | "VIDEO" | "IMAGE";
}

export interface ModuleGetByName{
    courseId : string,
    title : string
}