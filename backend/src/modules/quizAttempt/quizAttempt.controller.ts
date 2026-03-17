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

export async function getAllAttemptsOfQuizByUserController(req: Request, res : Response, next : NextFunction) {
    try{
        const {quizId, userId} = req.query as {quizId : string, userId : string}
        const response = await quizAttemptService.getAllAttemptsOfQuizByUser(quizId,userId)
        return res.status(200).json(response)
    }catch(error: any){
        next(error)
    }
}

export async function getAttemptsByProfileController(req: Request, res : Response, next : NextFunction) {
    try{    
        const {profileId} = req.params as {profileId : string}
        const response = await quizAttemptService.getAttemptsByProfile(profileId)
        return res.status(200).json(response)
    }catch(error){
        next(error)
    }
}

export async function getAttemptsByQuizIdController(req: Request, res : Response, next : NextFunction) {
    try{
        const {quizId} = req.params as {quizId : string}
        const response = await quizAttemptService.getAttemptsByQuizId(quizId)
        return res.status(200).json(response)
    }catch(error : any){
        next(error)
    }
}