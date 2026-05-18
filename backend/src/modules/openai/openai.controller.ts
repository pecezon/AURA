import { Request, Response, NextFunction } from "express";
import { OpenAIService } from "../../services/openai.service";
import { prisma } from "../../config/prisma";

const openAiService = new OpenAIService();

export async function generateCourseController(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic, courseType, duration, applicableNorms } = req.body as {
      topic: string;
      courseType: string;
      duration: string;
      applicableNorms: string[];
    };

    if (!topic) {
      return res.status(400).json({ error: "El campo 'topic' es requerido." });
    }

    // Fetch details of selected norms for the prompt
    const regulations = await prisma.regulation.findMany({
      where: {
        id: { in: applicableNorms || [] }
      },
      select: {
        id: true,
        name: true,
        description: true
      }
    });

    const mappedNorms = regulations.map(reg => ({
      id: reg.id,
      code: reg.name,
      title: reg.description || ""
    }));

    const result = await openAiService.generateCourse(topic, courseType, duration, mappedNorms);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}
