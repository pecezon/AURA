import { z } from "zod";

export const updateProfileSchema = z.object({

  firstName: z.string().optional(),
  lastName: z.string().optional(),
  area: z.string().optional(),
});

export const profileIdParamsSchema = z.object({
  id: z.string(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ProfileIdParams = z.infer<typeof profileIdParamsSchema>;