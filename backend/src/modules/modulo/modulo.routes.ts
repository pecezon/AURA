import { Router } from "express";
import { createFullModule, getAllModulesByCourseId, getAllModulesContentByTypeAndCourseId } from "./modulo.controller";

const router = Router();

router.post("/create-module", createFullModule)
router.get("/get-all-modules-by-course/:courseId", getAllModulesByCourseId)
router.get("/get-all-modules-content-by-type", getAllModulesContentByTypeAndCourseId)

export default router