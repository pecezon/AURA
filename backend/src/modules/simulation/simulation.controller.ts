import { NextFunction, Request, Response  } from "express";
import { SimulationService } from "../../services/simulation.service";

const simulationService = new SimulationService()

export async function getSimulationByModuleId(req : Request, res : Response, next : NextFunction){
    try{
        const {moduleId} = req.params as {moduleId : string}
        const simulation = await simulationService.getSimulationByModuleId(moduleId)
        return res.status(200).json(simulation)
    } catch (error){
        next(error)
    }
}

export async function getSimulationByTitle(req : Request, res : Response, next : NextFunction){
    try{
        const simulation = await simulationService.getSimulationByTitle(req.body)
        return res.status(200).json(simulation)
    } catch (error){
        next(error)
    }
}

export async function createNewSimulation(req : Request, res : Response, next : NextFunction) {
    try{
        const simulation = await simulationService.createNewSimulation(req.body)
        return res.status(201).json(simulation)
    } catch (error){
        next(error)
    }
}

export async function updateSimulation(req: Request, res : Response, next : NextFunction){
    try{
        const { simulationId } = req.params as {simulationId : string}
        const updatedSimulation = await simulationService.changeValuesFromSimulation(simulationId,req.body)
        return res.status(200).json(updatedSimulation)
    } catch (error){
        next(error)
    }
}