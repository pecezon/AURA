export interface SimulationAttemptProgress{
    score : number
}

export interface SimulationAttemptCreateDTO{
    simulationId : string,
    profileId : string
}

export interface SimulationAttemptResponseDTO{
    id : string,
    simulationId : string,
    score: number,
    passed: boolean,
    createdAt : string,
    profileId : string
}