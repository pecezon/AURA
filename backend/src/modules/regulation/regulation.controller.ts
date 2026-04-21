import { Request, Response, NextFunction } from "express";
import { createRegulationSchema } from "./regulation.validation";
import { regulationService } from "../../services/regulation.service";

export async function createRegulationController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createRegulationSchema.parse(req.body);
    const regulation = await regulationService.createRegulation(parsed);
    return res.status(201).json(regulation);
  } catch (err) {
    return next(err);
  }
}

export async function getAllRegulationsController(req: Request, res: Response, next: NextFunction) {
  try {
    const regulations = await regulationService.getAllRegulations();
    return res.json(regulations);
  } catch (err) {
    return next(err);
  }
}
