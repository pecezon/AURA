
export interface ReactiveCreateDTO{
    text : string,
    isCorrect? : boolean
}

export interface ReactiveResponse{
    id : string,
    text : string,
    isCorrect : boolean
}

export interface QuestionCreateDTO{
    text : string, 
    reactives : ReactiveCreateDTO[],
}

export interface QuestionResponse{
    id : string,
    text : string, 
    reactives : ReactiveCreateDTO[],
}

export interface QuizCreateDTO{
    moduleId : string,
    title : string,
    isGeneratedByAI? : boolean,
    questions : QuestionCreateDTO[],
}

export interface QuizResponse{
    id : string,
    moduleId : string,
    title : string,
    isGeneratedByAI : boolean,
    questions : QuestionCreateDTO[],
}