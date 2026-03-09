import { prisma } from "../../config/prisma";
import { QuizCreateDTO, QuizResponse } from "./quiz.types";

class ConflictError extends Error {
    statusCode = 409;
    constructor(message : string){
        super(message)
        this.name = "ConflictError"
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
            ...created
        }


    }
}