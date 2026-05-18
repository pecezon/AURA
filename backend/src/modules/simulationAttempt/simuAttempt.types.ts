import { SimulationEvent } from "../../services/scoring.service";

export interface SimulationAttemptProgress{
    score? : number;
    events?: SimulationEvent[];
    timeTakenSeconds?: number;
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
    profileId : string,
    riskScore?: number,
    feedback?: string
}