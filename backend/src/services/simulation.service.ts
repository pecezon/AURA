import { prisma } from "../config/prisma";
import { SimulationResponseDTO } from "../modules/modulo/modulo.types";
import { SimulationByTitle } from "../modules/simulation/simulation.types";

export class NotFoundError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.name = "NotFoundError"
    this.statusCode = 404
  }
}

export class SimulationService{
    async getSimulationByModuleId(moduleId : string) : Promise<SimulationResponseDTO>{
        const exist = prisma.module.findUnique({where : {id : moduleId}})
        if(!exist){
            throw new NotFoundError("The module with ID : " + moduleId + "doesnt exist")
        }

        const simulation = await prisma.simulation.findUnique({
            where : {
                moduleId : moduleId
            }
        })

        if(!simulation){
            throw new NotFoundError("The not simulation on this module")
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
         const exist = prisma.module.findUnique({where : {id : dto.moduleId}})
        if(!exist){
            throw new NotFoundError("The module with id : " + dto.moduleId + "doesnt exist")
        }

        const simulation = await prisma.simulation.findUnique({
            where : {
                moduleId : dto.title
            }
        })

        if(!simulation){
            throw new NotFoundError("The not simulation on this module")
        }

        return {
            id : simulation.id,
            title : simulation.title,
            content : simulation.content,
            passingScore : simulation.passingScore,
            moduleId : simulation.moduleId
        }
    }
}