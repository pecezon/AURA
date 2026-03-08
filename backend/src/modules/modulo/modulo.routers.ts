import { Router } from "express";
import { createFullModule, getAllModulesByCourseId } from "./modulo.controller";

const router = Router();

router.post("/create-module", createFullModule)
router.post("/get/all-modules-ny-course", getAllModulesByCourseId)