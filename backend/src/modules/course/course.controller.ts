import { Request, Response, NextFunction } from "express";
import { createCourseSchema } from "./course.validation";
import { courseService } from "../../services/course.service";

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

export async function searchCoursesByNameController(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: "Name query parameter is required" });
    }
    const courses = await courseService.searchCoursesByName(name);
    return res.json(courses);
  } catch (err) {
    return next(err);
  }
}

export async function getCourseByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const course = await courseService.getCourseById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.json(course);
  } catch (err) {
    return next(err);
  }
}