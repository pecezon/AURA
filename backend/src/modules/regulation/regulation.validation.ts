import { z } from "zod";

export const createRegulationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
});

export type CreateRegulationInput = z.infer<typeof createRegulationSchema>;
