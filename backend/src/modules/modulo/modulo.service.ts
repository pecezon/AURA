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
    //Get All modules by CourseId
    async getAllModulesByCourseId(courseId : string) : Promise<ModuleResponseDTO[]>{
        const existsCourse = await prisma.course.findUnique({where : {id : courseId}})
        if(!existsCourse){
            throw new ConclictError("The course with id: " + courseId + "dont exist")
        }

        const findedModules = await prisma.module.findMany({
            where : {courseId : courseId},
            include : {contents : true},
        });

        return findedModules as unknown as ModuleResponseDTO[]
    }

    //Get all Modules by Type and CourseId
    async getAllModulesByTypeAndCourseId(){
        
    }

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
                //TODO --- Add quizes, simulation, simulation attemp, question, question attemp, and reactives etc.
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