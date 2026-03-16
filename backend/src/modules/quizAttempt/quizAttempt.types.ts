export interface AnswerDTO{
    questionId : string,
    reactiveId : string
}

export interface AnswerResponse{
    id: string,
    questionText : string,
    reactiveText : string
    reactiveCorrect : boolean
}

export interface QuizAttemptDTO{
    quizId : string,
    profileId : string,
    answers : AnswerDTO[]
}

export interface QuizAttemptResponse{
    id: string
    quizName : string,
    firstName : string,
    score : number,
    passed : boolean,
    createdAt : string
    answers : AnswerResponse[]
}