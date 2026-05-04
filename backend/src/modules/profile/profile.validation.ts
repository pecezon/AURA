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

export const nameSchema = z.string({}).min(1, "Name query parameter is required");


export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
  