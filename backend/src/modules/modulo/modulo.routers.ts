import { Router } from "express";
import { createFullModule, getAllModulesByCourseId, getAllModulesByTypeAndCourseId } from "./modulo.controller";

const router = Router();

router.post("/create-module", createFullModule)
router.get("/get-all-modules-by-course", getAllModulesByCourseId)
router.get("/get-all-modules-by-type", getAllModulesByTypeAndCourseId)