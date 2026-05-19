import { Request, Response, NextFunction } from "express";
import { OpenAIService } from "../../services/openai.service";
import { prisma } from "../../config/prisma";
import { z } from "zod";

const openAiService = new OpenAIService();

const generateCourseSchema = z.object({
  topic: z.string().min(1, "El campo 'topic' es requerido."),
  courseType: z.string().optional().default("TECHNICAL"),
  duration: z.string().optional().default("1"),
  applicableNorms: z.array(z.string().uuid("Invalid regulation ID")).optional().default([]),
});

export async function generateCourseController(req: Request, res: Response, next: NextFunction) {
  try {
    const parseResult = generateCourseSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Datos de entrada inválidos.",
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { topic, courseType, duration, applicableNorms } = parseResult.data;

    // Fetch details of selected norms for the prompt
    const regulations = await prisma.regulation.findMany({
      where: {
        id: { in: applicableNorms }
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
