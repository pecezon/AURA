import { z } from "zod";

export const simulationEventSchema = z.object({
  type: z.enum(['PLACE_PIN', 'REMOVE_PIN']),
  id: z.string().min(1, "Event ID is required"),
  x: z.number().optional(),
  y: z.number().optional(),
  timestamp: z.number().nonnegative("Timestamp must be a positive number")
});

export const simulationAttemptProgressSchema = z.object({
  score: z.number().min(0).max(100).optional(),
  events: z.array(simulationEventSchema).optional(),
  timeTakenSeconds: z.number().nonnegative().optional()
});

export type SimulationEventInput = z.infer<typeof simulationEventSchema>;
export type SimulationAttemptProgressInput = z.infer<typeof simulationAttemptProgressSchema>;
