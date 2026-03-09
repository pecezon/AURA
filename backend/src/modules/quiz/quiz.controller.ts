import { Request, Response, NextFunction } from "express";
import { QuizService } from "./quiz.service";

const quizService = new QuizService()

export async function createQuizController(req : Request, res : Response, next : NextFunction) {
    try{
        const quiz = await quizService.createQuiz(req.body)
        return res.status(201).json(quiz)
    }catch(error : any ){
        next(error)
    }
    
}