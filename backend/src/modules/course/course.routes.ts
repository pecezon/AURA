import { Router } from "express";
import { createCourseController, getAllCoursesController, searchCoursesByNameController, getCourseByIdController } from "./course.controller";

const router = Router();

router.get("/get-all-courses", getAllCoursesController);
router.get("/search", searchCoursesByNameController);
router.get("/:id", getCourseByIdController);

router.post("/create-course", createCourseController);

export default router;
