import { Request, Response, NextFunction } from "express";
import { QuizService } from "../../services/quiz.service";

const quizService = new QuizService()

export async function createQuizController(req : Request, res : Response, next : NextFunction) {
    try{
        const quiz = await quizService.createQuiz(req.body)
        return res.status(201).json(quiz)
    }catch(error : any ){
        next(error)
    }
    
}

export async function getQuizByIdController(req : Request, res : Response, next : NextFunction) {
    try{
        const {id} = req.params as {id: string}
        const quiz = await quizService.getQuizById(id)

        if(!quiz) {
            return res.status(404).json({error: "Quiz not Found."})
        }
        return res.status(200).json(quiz)
        
            
    }catch(error : any ){
        next(error)
    }
    
}

export async function getAllQuizzesInAModuleController(req : Request, res : Response, next : NextFunction) {
    try{
        const {moduleId} = req.params as {moduleId: string}
        const courses = await quizService.getAllQuizzesInAModule(moduleId); 
        return res.status(200).json(courses)
    }catch(error : any ){
        next(error)
    }
    
}

export async function getQuizByNameController(req : Request, res : Response, next : NextFunction) {
    try{
        const name = req.query.name;
        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ error: 'Query parameter "name" is required and must be a non-empty string.' });
        }
        const response = await quizService.getQuizByName(name);
        return res.status(200).json(response)
    }catch(error : any ){
        next(error)
    }
    
}

export async function getAllQuizzesController(req : Request, res : Response, next : NextFunction) {
    try{
        const response = await quizService.getQuizzes()
        return res.status(200).json(response)
    }catch(error : any ){
        next(error)
    }
    
}