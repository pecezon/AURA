import { Router } from "express";
import { createCourseController, getAllCoursesController } from "./course.controller";

const router = Router();

router.post("/create-course", createCourseController);
router.get("/get-all-courses", getAllCoursesController);

export default router;
