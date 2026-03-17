import { prisma } from "../config/prisma";
import { SimulationByTitle, SimulationResponseDTO, SimulationCreateDTO, SimulationChangeDTO} from "../modules/simulation/simulation.types";

export class NotFoundError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.name = "NotFoundError"
    this.statusCode = 404
  }
}

export class ConflictError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.name = "Conflict error"
    this.statusCode = 409
  }
}

export class SimulationService{
    async getSimulationByModuleId(moduleId : string) : Promise<SimulationResponseDTO>{
        const exist = await prisma.module.findUnique({where : {id : moduleId}})
        if(!exist){
            throw new NotFoundError("The module with ID : " + moduleId + "doesn't exist")
        }

        const simulation = await prisma.simulation.findUnique({
            where : {
                moduleId : moduleId
            }
        })

        if(!simulation){
            throw new NotFoundError("No simulation found for this module")
        }

        return {
            id : simulation.id,
            title : simulation.title,
            content : simulation.content,
            passingScore : simulation.passingScore,
            moduleId : simulation.moduleId
        }
    }

    async getSimulationByTitle(dto : SimulationByTitle) : Promise<SimulationResponseDTO>{
         const exist = await prisma.module.findUnique({where : {id : dto.moduleId}})
        if(!exist){
            throw new NotFoundError("The module with id : " + dto.moduleId + "doesn't exist")
        }

        const simulation = await prisma.simulation.findUnique({
            where : {
                moduleId : dto.title
            }
        })

        if(!simulation){
            throw new NotFoundError("No simulation found for this module")
        }

        return {
            id : simulation.id,
            title : simulation.title,
            content : simulation.content,
            passingScore : simulation.passingScore,
            moduleId : simulation.moduleId
        }
    }


    //CREATE /POST METHODS -- Relation with module
    async createNewSimulation(dto : SimulationCreateDTO) : Promise<SimulationResponseDTO>{
        const existModule = await prisma.module.findUnique({where : {id : dto.moduleId}, include : {simulation : true}})
        if(!existModule){
            throw new NotFoundError("The module with id : " + dto.moduleId + "doesn't exist")
        }

        if(existModule.simulation){
            throw new ConflictError("This module has already a simulation")
        }

        const newSimulation = await prisma.simulation.create({
            data : {
                title : dto.title,
                content : dto.content,
                passingScore : dto.passingScore,
                moduleId : dto.moduleId
            }
        })

        return {
            ...newSimulation
        }
    }

    async changeValuesFromSimulation(dto : SimulationChangeDTO, moduleId : string) : Promise<SimulationResponseDTO>{
        const existModule = await prisma.module.findUnique({where : {id : moduleId}, include : {simulation : true}})
        if(!existModule){
            throw new NotFoundError("The module with id : " + moduleId + "doesn't exist")
        }

        if(!existModule.simulation){
            throw new ConflictError("This module does not have a simulation")
        }

        const simulation = existModule.simulation

        const updatedSimulation = await prisma.simulation.update({
            where : {id : simulation.id},
            data : {
                title : dto.title,
                content : dto.content,
                passingScore : dto.passingScore
            },
        })

        return {
            ...updatedSimulation
        }
    }

}