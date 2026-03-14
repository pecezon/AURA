export interface SimulationAttemptProgress{
    score : number
}

export interface SimulationAttempCreateDTO{
    simulationId : string,
    profileId : string
}

export interface SimulationAttempResponseDTO{
    id : string,
    simulationId : string,
    score: number,
    passed: boolean,
    createdAt : string,
    profileId : string
}