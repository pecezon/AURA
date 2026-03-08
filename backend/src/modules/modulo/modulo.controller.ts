import { NextFunction, Request, Response } from "express"
import { ModuleService } from "./modulo.service"

const moduleService = new ModuleService()

export async function getAllModulesByCourseId(req : Request, res: Response, next : NextFunction){
    try{
        const { courseId } = req.params as { courseId : string };
        const response = await moduleService.getAllModulesByCourseId(courseId)
        return res.status(200).json(response)
    } catch(error){
        next(error)
    }
}

export async function getAllModulesContentByTypeAndCourseId(req : Request, res : Response, next : NextFunction){
    try{
        const response = await moduleService.getAllModulesContentByTypeAndCourseId(req.body)
        return res.status(200).json(response)
    } catch (error){
        next(error)
    }
}

export async function createFullModule(req : Request, res : Response, next : NextFunction){
    try{
        const response = await moduleService.createFullModule(req.body)
        return res.status(201).json(response)
    } catch(error : any){
        next(error)
    }
}

