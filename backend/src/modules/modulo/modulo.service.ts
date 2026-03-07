import { prisma } from "../../config/prisma";
import { ModuleCreateDTO, ModuleResponseDTO } from "./modulo.types";

class ConclictError extends Error {
    statusCode = 409;
    constructor(message : string){
        super(message)
        this.name = "ConflictError"
    }

}

export class ModuleService {


    //GET METHODS (Get All modules by CourseId, Get all Modules by Type and CourseId, get by ID)



    //POST METHODS (Create Full Module)
    async createFullModule(dto : ModuleCreateDTO): Promise <ModuleResponseDTO> {
        const existsModule = await prisma.module.findFirst({where : {title : dto.title}})
        if(existsModule) throw new ConclictError("This module already exists")

        const createdModule = await prisma.module.create({
            data : {
                title : dto.title,
                order : dto.order,
                courseId : dto.courseId,
                contents : {
                    create : dto.contents.map(contentModule => ({
                        type : contentModule.type,
                        title : contentModule.title ?? null,
                        content : contentModule.content ?? null,
                        url : contentModule.content ?? null,
                        order : contentModule.order
                    }))
                }
                //TODO --- Add quizes, simulation, simulation attemp etc.
            },
            include : {
                contents : true
            }
        });
        return {
            ...createdModule,
            createdAt : createdModule.createdAt.toISOString()
        } 
    }
}