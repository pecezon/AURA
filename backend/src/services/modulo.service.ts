import { prisma } from "../config/prisma";
import { ModulesResponseReturn, ModuleResponseReturn } from "../modules/modulo/modulo.mapper";
import { ModuleCreateDTO, ModuleGetByName, ModuleGetByTypeAndCourseDTO, ModuleResponseDTO } from "../modules/modulo/modulo.types";

class ConflictError extends Error {
    statusCode = 409;
    constructor(message : string){
        super(message)
        this.name = "ConflictError"
    }

}

export class NotFoundError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.name = "NotFoundError"
    this.statusCode = 404
  }
}

export class ModuleService {

    //GET METHODS (Get All modules by CourseId, Get all Modules by Type and CourseId, get by ID)
    //Get All modules by CourseId
    async getAllModulesByCourseId(courseId : string) : Promise<ModuleResponseDTO[]>{
        const existsCourse = await prisma.course.findUnique({where : {id : courseId}})
        if(!existsCourse){
            throw new ConflictError("The course with id: " + courseId + "doesn't exist")
        }

        const findedModules = await prisma.module.findMany({
            where : {
                courseId : courseId,
            },
            include : {
                contents : true,
                quizzes : {
                    include : {
                        questions : {
                            include : {
                                reactives : true
                            }
                        }
                    }
                },
                simulation : true
            },
        });

        return ModulesResponseReturn(findedModules)
    }
    
    //Get all Modules by Type and CourseId
    async getAllModulesContentByTypeAndCourseId(dto : ModuleGetByTypeAndCourseDTO) : Promise<ModuleResponseDTO[]>{
        const existCourse = await prisma.course.findUnique({where : {id : dto.courseId}})
        if(!existCourse){
            throw new ConflictError("The course with id: " + dto.courseId + "doesn't exist")
        }

        const findedModules = await prisma.module.findMany({
            where : {
                courseId : dto.courseId,
            },
            include : {
                contents : {
                    where : {type : dto.type}
                },
                quizzes : {
                    include : {
                        questions : {
                            include : {
                                reactives : true
                            }
                        }
                    }
                },
                simulation : true
            },
        });

        return ModulesResponseReturn(findedModules)
    }

    //Get module by name
    async getModuleByTitle(dto : ModuleGetByName) : Promise<ModuleResponseDTO> { //Do it later
        const existCourse = await prisma.course.findUnique({where : {id : dto.courseId}})
        if(!existCourse){
            throw new ConflictError("The course with id: " + dto.courseId + "doesn't exist")
        }

        const module = await prisma.module.findFirst({
            where : {
                title : dto.title
            },
            include : {
                contents : true,
                quizzes : {
                    include : {
                        questions : {
                            include : {
                                reactives : true
                            }
                        }
                    }
                },
                simulation : true
            },
        });

        if(!module){
            throw new NotFoundError("Module Not Found")
        }

        return ModuleResponseReturn(module)
    }

    //POST METHODS (Create Full Module)
    async createFullModule(dto : ModuleCreateDTO): Promise <ModuleResponseDTO> {
        const existsModule = await prisma.module.findFirst({where : {title : dto.title}})
        if(existsModule) throw new ConflictError("This module already exists")

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
                        url : contentModule.url ?? null,
                        order : contentModule.order
                    }))
                },
                quizzes : {
                    create : dto.quizzes.map(quiz => ({
                        title : quiz.title,
                        isGeneratedByAI : quiz.isGeneratedByAI,
                        questions : {
                            create : quiz.questions.map(question => ({
                                text : question.text,
                                reactives : {
                                    create : question.reactives?.map(reactive => ({
                                        text : reactive.text,
                                        isCorrect : reactive.isCorrect
                                    })) ?? []
                                }
                            }))
                        }
                    }))
                },
                simulation : dto.simulation ? {
                    create :  {
                        title : dto.simulation.title,
                        content : dto.simulation.content,
                        passingScore : dto.simulation.passingScore
                    } 
                    
                } : undefined
                        
            },
            include : {
                contents : true,
                quizzes : {
                    include : {
                        questions : {
                            include : {
                                reactives : true
                            }
                        }
                    }
                },
                simulation : true,
            }
        });
        return {
            ...createdModule,
            createdAt : createdModule.createdAt.toISOString(),
            simulation: createdModule.simulation
            ? {
                id: createdModule.simulation.id,
                title: createdModule.simulation.title,
                moduleId: createdModule.simulation.moduleId,
                content: createdModule.simulation.content,
                passingScore: createdModule.simulation.passingScore
            }
            : null
        } 
    }
}