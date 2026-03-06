import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  isPublished: z.boolean(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  modules: z
    .array(
      z.object({
        title: z.string().min(1, "Module title is required"),
        order: z.number().int(),
        createdAt: z.number().optional(),
        contents: z
          .array(
            z.object({
              type: z.enum(["READING", "VIDEO", "IMAGE"]),
              title: z.string().optional().nullable(),
              content: z.string().optional().nullable(),
              url: z.string().optional().nullable(),
              order: z.number().int(),
              createdAt: z.number().optional(),
            })
          )
          .optional(),
        quizzes: z
          .array(
            z.object({
              title: z.string().min(1, "Quiz title is required"),
              isGeneratedByAI: z.boolean().optional(),
              questions: z
                .array(
                  z.object({
                    text: z.string().min(1, "Question text is required"),
                    reactives: z
                      .array(
                        z.object({
                          text: z.string().min(1, "Reactive text required"),
                          isCorrect: z.boolean().optional(),
                        })
                      )
                      .optional(),
                  })
                )
                .optional(),
            })
          )
          .optional(),
        simulation: z
          .object({
            title: z.string().min(1, "Simulation title required"),
            content: z.string().min(1, "Simulation content required"),
            passingScore: z.number().int(),
          })
          .optional(),
      })
    )
    .optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
