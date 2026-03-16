import { Request, Response, NextFunction } from "express";
import { QuizAttemptService } from "../../services/quizAttempt.service";

const quizAttemptService = new QuizAttemptService()

export async function createQuizAttemptController(req: Request, res: Response, next : NextFunction) {
    try{
        const quizAttempt = await quizAttemptService.createQuizAttempt(req.body)
        return res.status(201).json(quizAttempt)
    }catch(error: any ){
        next(error)
    }
}