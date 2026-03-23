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
                reactiveText : aa.reactive.text,
                reactiveCorrect : aa.reactive.isCorrect
            })),
        }
    }

    async getAllAttemptsOfQuizByUser(profileId : string, quizId : string){
        const profile = await prisma.profile.findUnique({where: {id: profileId}})
        if(!profile) throw new NotFoundError(`Profile with id: ${profileId} Not Found`)
        const quiz = await prisma.quiz.findFirst({where: {id: quizId}});
        if(!quiz) throw new NotFoundError(`Quiz with id: ${quizId} doesn't exist.`)

        const attempts = await prisma.quizAttempt.findMany({
            where: {
                profileId,
                quizId
            },
            include:{
                profile : true,
                quiz : true
            }
        });

        return attempts.map(attemp => ({
            id: attemp.id,
            quizName : attemp.quiz.title,
            firstName: attemp.profile.firstName,
            score : attemp.score,
            passed : attemp.passed,
            createdAt : attemp.createdAt.toISOString(),

        }));
    }

    async getAttemptsByProfile(profileId : string){
        const profile = await prisma.profile.findUnique({where : {id : profileId}});

        if(!profile) throw new NotFoundError(`Profile not Found`);

        const attempts = await prisma.quizAttempt.findMany({
            where: {
                profileId
            },
            include: {
                quiz: true,
            }
        });

        return attempts.map(attempt => ({
            id: attempt.id,
            quizId : attempt.quizId,
            quizName : attempt.quiz.title,
            profileId : attempt.profileId,
            score : attempt.score,
            passed : attempt.passed,
            createdAt : attempt.createdAt.toISOString()
        }));
    }

    async getAttemptsByQuizId(quizId : string){
        const quiz = await prisma.quiz.findUnique({where : {id : quizId}})
        if(!quiz) throw new NotFoundError(`Quiz with id: ${quizId} Not Found`)

        const attempts = await prisma.quizAttempt.findMany({
            where: {
                quizId: quiz.id
            },
            select: {
                id: true,
                quiz: {
                    select: {
                        id : true,
                        title : true
                    }
                },
                profile: {
                    select : {
                        id: true,
                        firstName : true,
                        lastName : true,
                        employeeId : true
                    }
                },
                score: true,
                passed : true,
                createdAt : true
            }
        });

        return attempts.map(att => ({
            id : att.id,
            quizId : att.quiz.id,
            quizName : att.quiz.title,
            profileId : att.profile.id,
            profileFirstName : att.profile.firstName,
            profileLastName : att.profile.lastName,
            employeeId : att.profile.employeeId,
            score : att.score,
            passed : att.passed,
            createdAt : att.createdAt.toISOString()
        }))
    }

}

export const quizAttemptService = new QuizAttemptService()