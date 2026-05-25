import { z } from "zod";

export const simulationEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("PLACE_PIN"),
    id: z.string().min(1, "PLACE_PIN must have a valid non-empty id"),
    x: z.number(),
    y: z.number(),
    timestamp: z.number().nonnegative("Timestamp must be a positive number"),
  }),
  z.object({
    type: z.literal("REMOVE_PIN"),
    id: z.string().min(1, "REMOVE_PIN must have a valid non-empty id"),
    timestamp: z.number().nonnegative("Timestamp must be a positive number"),
  }),
  z.object({
    type: z.literal("WRONG_CLICK"),
    id: z.string().optional().default(""),
    x: z.number(),
    y: z.number(),
    expectedStep: z.number().int().nonnegative(),
    timestamp: z.number().nonnegative("Timestamp must be a positive number"),
  }),
  z.object({
    type: z.literal("QUIZ_ERROR"),
    id: z.string().min(1, "QUIZ_ERROR must have a valid non-empty id"),
    optionId: z.string().min(1, "QUIZ_ERROR must have a valid non-empty optionId"),
    timestamp: z.number().nonnegative("Timestamp must be a positive number"),
  }),
]);

export const simulationAttemptProgressSchema = z.object({
  score: z.number().min(0).max(100).optional(),
  events: z.array(simulationEventSchema).optional(),
  timeTakenSeconds: z.number().nonnegative().optional()
});

export type SimulationEventInput = z.infer<typeof simulationEventSchema>;
export type SimulationAttemptProgressInput = z.infer<typeof simulationAttemptProgressSchema>;
