export interface SimulationCreateDTO{
    moduleId : string,
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

export interface SimulationByTitle{
    moduleId : string,
    title : string
}

export interface SimulationChangeDTO{
    title : string,
    content : string,
    passingScore : number,
}

