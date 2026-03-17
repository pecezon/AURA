import { prisma } from "../config/prisma";
import { SimulationAttemptCreateDTO, SimulationAttemptResponseDTO, SimulationAttemptProgress } from "../modules/simulationAttempt/simuAttempt.types";

export class NotFoundError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.name = "NotFoundError"
    this.statusCode = 404
  }
}

export class NotCompletedError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.name = "NotCompletedError"
    this.statusCode = 400
  }
}

export class SimulationAttemptService{

    async getAllAttemptsByProfile(profileId : string) : Promise<SimulationAttemptResponseDTO[]>{
        const existProfile = await prisma.profile.findUnique({where : {id : profileId}})
        if(!existProfile){
            throw new NotFoundError("The profile with ID : " + profileId + " doesn't exist")   
        }

        const attempts = await prisma.simulationAttempt.findMany({
            where : {profileId : existProfile.id}
        })

        return attempts.map(attempt => ({
            id : attempt.id,
            simulationId : attempt.simulationId,
            profileId : attempt.profileId,
            score : attempt.score,
            passed : attempt.passed,
            createdAt : attempt.createdAt.toISOString()
        }))
    }

    async startAttempt(dto : SimulationAttemptCreateDTO) : Promise<SimulationAttemptResponseDTO>{
        const existSimulation = await prisma.simulation.findUnique({where : {id : dto.simulationId}}) //1. verify if the simulation already exists
        if(!existSimulation){
            throw new NotFoundError("The simulation with ID : " + dto.simulationId + " doesn't exist")   
        }

        const existProfile = await prisma.profile.findUnique({where : {id : dto.profileId}})
        if(!existProfile){
            throw new NotFoundError("The profile with ID : " + dto.profileId + " doesn't exist")   
        }

        const newAttempt = await prisma.simulationAttempt.create({
            data : {
                simulationId : dto.simulationId,
                profileId : dto.profileId,
                score: 0, //The score and passed are already defined by backend when you start a new Attempt, to prevent errors from frontend
                passed: false, 
            },
        })

        return {
            id : newAttempt.id,
            simulationId : newAttempt.simulationId,
            profileId : newAttempt.profileId,
            score : newAttempt.score,
            passed : newAttempt.passed,
            createdAt : newAttempt.createdAt.toISOString()
        }  
    }


    async saveProgress(attemptId : string, dto : SimulationAttemptProgress) : Promise<SimulationAttemptResponseDTO>{
        const exist = await prisma.simulationAttempt.findUnique({where : {id : attemptId}})
        if(!exist){
            throw new NotFoundError("The attempt with ID : " + attemptId + " doesn't exist")   
        }

        const patchedAttempt = await prisma.simulationAttempt.update({
            where : {
                id : attemptId
            },
            data : {
                score : dto.score
            }
        })

        return {
            id : patchedAttempt.id,
            simulationId : patchedAttempt.simulationId,
            profileId : patchedAttempt.profileId,
            score : patchedAttempt.score,
            passed : patchedAttempt.passed,
            createdAt : patchedAttempt.createdAt.toISOString()
        }
    }

    async submitAttempt(attemptId : string, dto : SimulationAttemptProgress) : Promise<SimulationAttemptResponseDTO>{
        const exist = await prisma.simulationAttempt.findUnique({where : {id : attemptId}})
        if(!exist){
            throw new NotFoundError("The attempt with ID : " + attemptId + " doesn't exist")   
        }

        const simulation = await prisma.simulation.findUnique({where : {id : exist.simulationId}})
        if(!simulation){
            throw new NotFoundError("The simulation with ID : " + exist.simulationId + " doesn't exist")   
        }

        const passed = dto.score >= simulation.passingScore 

        const submitedAttempt = await prisma.simulationAttempt.update({
            where : {
                id : attemptId
            },
            data : {
                score : dto.score,
                passed
            }
        })

        if(!submitedAttempt.passed){
            throw new NotCompletedError("The current score : " + dto.score + " is not enough to pass this simulation")
        }

        return {
            id : submitedAttempt.id,
            simulationId : submitedAttempt.simulationId,
            profileId : submitedAttempt.profileId,
            score : submitedAttempt.score,
            passed : submitedAttempt.passed,
            createdAt : submitedAttempt.createdAt.toISOString()
        }
    }
}