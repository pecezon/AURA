import { z } from "zod";

export const simulationEventSchema = z.object({
  type: z.enum(['PLACE_PIN', 'REMOVE_PIN', 'WRONG_CLICK', 'QUIZ_ERROR']),
  id: z.string().optional().default(""),
  x: z.number().optional(),
  y: z.number().optional(),
  timestamp: z.number().nonnegative("Timestamp must be a positive number"),
  expectedStep: z.number().optional(),
  optionId: z.string().optional()
});

export const simulationAttemptProgressSchema = z.object({
  score: z.number().min(0).max(100).optional(),
  events: z.array(simulationEventSchema).optional(),
  timeTakenSeconds: z.number().nonnegative().optional()
});

export type SimulationEventInput = z.infer<typeof simulationEventSchema>;
export type SimulationAttemptProgressInput = z.infer<typeof simulationAttemptProgressSchema>;
