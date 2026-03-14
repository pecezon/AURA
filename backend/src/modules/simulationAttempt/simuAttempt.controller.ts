export interface SimulationAttempCreateDTO{
    score : number,
    passed : boolean,
    createdAt : Date
}

export interface SimulationAttempResponseDTO{
    id : string,
    simulationId : string,
    score : number,
    passed : boolean,
    createdAt : Date,
    profileId : string
}