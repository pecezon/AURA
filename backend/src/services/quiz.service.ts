import { prisma } from "../config/prisma";
import { QuestionResponse, QuizCreateDTO, QuizResponse } from "../modules/quiz/quiz.types";


class ConflictError extends Error {
    statusCode = 409;
    constructor(message : string){
        super(message)
        this.name = "ConflictError"
    }
}

class NotFoundError extends Error {
    statusCode = 404;
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class QuizService{

    //post 
    async createQuiz(dto: QuizCreateDTO) : Promise<QuizResponse>{
        const exists = await prisma.quiz.findFirst({where: {moduleId : dto.moduleId, title : dto.title}}) // avoid quizzes with the same name under the same module, ask pez
        if(exists) throw new ConflictError("Quiz with the same name is already registered under the same module")

        const created = await prisma.quiz.create({
            data : {
                moduleId : dto.moduleId,
                title : dto.title,
                isGeneratedByAI : dto.isGeneratedByAI ?? true,
                questions : {
                    create : dto.questions.map(q => ({
                        text : q.text,
                        reactives : {
                            create : q.reactives.map(r => ({
                                text : r.text,
                                isCorrect : r.isCorrect ?? false
                            }) ),
                        },
                    })),
                },
            },
            include : {
                questions : {
                    include : {
                        reactives : true
                    },
                },
            },
        });

        return {
            id : created.id,
            moduleId : created.moduleId,
            title: created.title,
            isGeneratedByAI: created.isGeneratedByAI,
            questions : created.questions.map((qq : QuestionResponse) => ({
                id: qq.id,
                text: qq.text,
                reactives : qq.reactives.map((r) => ({
                    id: r.id,
                    text : r.text,
                    isCorrect : r.isCorrect
                })),
            })) ,
        }
    }


    //get quiz by id
    async getQuizById(id: string){
        const quiz = await prisma.quiz.findUnique({
            where: { id },
            include : {
                module : true,
                questions: {
                    include : {
                        reactives: true
                }}
            },
        });

        if(!quiz) return null

        return {
            id: quiz.id,
            quizModule: quiz.module?.title ?? "Unknown", 
            moduleId : quiz.moduleId,
            title: quiz.title,
            isGeneratedByAI : quiz.isGeneratedByAI,
            questions: quiz.questions.map(qq => ({
                id : qq.id,
                text : qq.text,
                reactives : qq.reactives.map(r => ({
                    id: r.id,
                    text : r.text,
                    isCorrect: r.isCorrect
                }))
            })),
        };
    }

    //get all quizzes by moduleId
    async getAllQuizzesInAModule(moduleId: string) : Promise<QuizResponse[]>{
        const moduleExists = await prisma.module.findUnique({
            where:{
                id: moduleId
            }
        });

        if(!moduleExists) throw new NotFoundError(`Module with ID ${moduleId} doesn't exists.`);

        const quizzes = await prisma.quiz.findMany({
            where: {moduleId},
            include: {
                questions: {
                    include :{
                        reactives: true
                    }
                }
            }
        });

        return quizzes.map((quiz) => ({
            id: quiz.id,
            moduleId: quiz.moduleId,
            title : quiz.title,
            isGeneratedByAI : quiz.isGeneratedByAI,
            questions : quiz.questions.map((q) => ({
                id : q.id,
                text: q.text,
                reactives: q.reactives.map(r => ({
                    id: r.id,
                    text: r.text,
                    isCorrect: r.isCorrect
                })),
            })),
        }))
    }

    // get by name
    async getQuizByName(name: string){ //this could change so that it also searches within a module
        const quizzes = await prisma.quiz.findMany({ 
            where: {
                title : {
                    contains: name,
                    mode : 'insensitive'
                }
            },
            select : {
                id:true,
                title: true,
                isGeneratedByAI: true,
                module: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        return quizzes.map(quiz => ({
            id: quiz.id,
            moduleName: quiz.module.title,
            moduleId : quiz.module.id,
            title : quiz.title,
            isGeneratedByAI : quiz.isGeneratedByAI,
        }))
    }

    // get all quizzes
    async getQuizzes() : Promise<QuizResponse[]>{
        const quizzes = await prisma.quiz.findMany({
            include: {
                questions : {
                    include : {
                        reactives: true
                    }
                }
            }
        });

        return quizzes.map(q => ({
            id : q.id,
            moduleId : q.moduleId,
            title : q.title,
            isGeneratedByAI: q.isGeneratedByAI,
            questions: q.questions.map(qq => ({
                id: qq.id,
                text: qq.text,
                reactives: qq.reactives.map(r => ({
                    id: r.id,
                    text: r.text,
                    isCorrect: r.isCorrect
                }))
            }))
        }))
    }

}

export const quizService = new QuizService();