import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  area: z.string().optional(),
  birthDate: z
    .string()
    .datetime({ message: "birthDate must be a valid ISO 8601 datetime string" })
    .transform((value) => new Date(value))
    .nullable()
    .optional(),
  employeeId: z.string().optional(),
});

export const profileIdParamsSchema = z.object({
  id: z.string(),
});

export const searchProfilesQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});


export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
  