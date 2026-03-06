import { Request, Response, NextFunction } from "express";
import { createCourseSchema } from "./course.validation";
import { courseService } from "./course.service";

export async function createCourseController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createCourseSchema.parse(req.body);

    const course = await courseService.createCourse(parsed);

    return res.status(201).json(course);
  } catch (err) {
    return next(err);
  }
}

export async function getAllCoursesController(req: Request, res: Response, next: NextFunction) {
  try {
    const courses = await courseService.getAllCourses();
    return res.json(courses);
  } catch (err) {
    return next(err); 
  }
}
