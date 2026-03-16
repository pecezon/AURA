import { prisma } from "../config/prisma";
import { AnswerResponse, QuizAttemptDTO, QuizAttemptResponse } from "../modules/quizAttempt/quizAttempt.types";

class NotFoundError extends Error {
    statusCode = 404;
    constructor(message : string){
        super(message)
        this.name = "NotFoundError"
    }
}

export class QuizAttemptService{
    async createQuizAttempt(dto : QuizAttemptDTO) {

        const profile = await prisma.profile.findFirst({where: {id: dto.profileId}});
        if(!profile) throw new NotFoundError(`Profile with id: ${dto.profileId} doesn't exist.`)
        
        const quiz = await prisma.quiz.findFirst({where: {id: dto.quizId}});
        if(!quiz) throw new NotFoundError(`Quiz with id: ${dto.quizId} doesn't exist.`)
        
        // calculate score 
        const totalQuestions = dto.answers.length;
        const reactiveIds = dto.answers.map(a => a.reactiveId);
        const reactives = await prisma.reactive.findMany({
            where: { id: { in: reactiveIds } },
            select: { id: true, isCorrect: true }
        });
        const correctCount = reactives.filter(r => r.isCorrect).length;
        const score = (correctCount / totalQuestions) * 100;
        const passed = score >= 70;// 7 passing score
                

        const attempt = await prisma.quizAttempt.create({
            data: {
                quizId : dto.quizId,
                profileId : dto.profileId,
                score :  score,
                passed : passed,
                answers : {
                    create : dto.answers.map(aa => ({
                        questionId: aa.questionId,
                        reactiveId : aa.reactiveId
                    })),
                },
            },
            include: {
                quiz : true,
                profile : true,
                answers: {
                    include: {
                        question : true,
                        reactive : true,
                    }

                }
            }
        });

        return {
            id: attempt.id,
            quizName: attempt.quiz.title,
            firstName: attempt.profile.firstName,
            score : attempt.score,
            passed : attempt.passed,
            createdAt : attempt.createdAt.toISOString(),
            answers : attempt.answers.map(aa  => ({
                id: aa.id,
                questionText: aa.question.text,
                reactivetext : aa.reactive.text,
                reactiveCorrect : aa.reactive.isCorrect
            })),
        }
    }
}

export const quizAttemptService = new QuizAttemptService()