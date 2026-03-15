import { NextFunction, Request, Response } from "express";
import { SimulationAttemptService } from "../../services/simuAttempt.service";


const simulationAttemptService = new SimulationAttemptService()

export async function getAllAttemptsByProfile(req : Request, res : Response, next : NextFunction){
    try{
        const {profileId} = req.params as {profileId : string}
        const attemps = await simulationAttemptService.getAllAttemptsByProfile(profileId)
        return res.status(200).json(attemps)
    } catch (error){
        next(error)
    }
}

export async function createNewAttempt(req : Request, res : Response, next : NextFunction){
    try{
        const newAttempt = await simulationAttemptService.startAttempt(req.body)
        return res.status(200).json(newAttempt)
    } catch (error){
        next(error)
    }
}

export async function saveProgress(req : Request, res : Response, next : NextFunction){
    try{
        const {attemptId} = req.query as {attemptId : string} 
        const savedAttempt = await simulationAttemptService.saveProgress(attemptId,req.body)
        return res.status(200).json(savedAttempt)
    } catch(error){
        next(error)
    }
}

export async function submitAttempt(req : Request, res : Response, next : NextFunction){
    try{
        const {attemptId} = req.query as {attemptId : string} 
        const submitedAttempt = await simulationAttemptService.submitAttempt(attemptId,req.body)
        return res.status(200).json(submitedAttempt)
    } catch (error){
        next(error)
    }
}