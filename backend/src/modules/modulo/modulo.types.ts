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
}

export interface ModuleResponseDTO {
    id : string,
    title : string,
    order : number,
    createdAt : string,
    courseId : string,
    contents  : ResponseModuleContentDTO[];
}

export interface ModuleGetByTypeAndCourseDTO {
    courseId : string,
    type: "READING" | "VIDEO" | "IMAGE";
}