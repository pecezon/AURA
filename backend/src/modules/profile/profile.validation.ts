import { z } from "zod";
import { id } from "zod/v4/locales";

export const updateProfileSchema = z.object({
  id : z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  area: z.string().optional(),
});



export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
  