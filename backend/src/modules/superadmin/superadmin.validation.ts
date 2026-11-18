import { z } from "zod";

export const changeRoleSchema = z.object({
  role: z.enum(["EMPLOYEE", "SUPERVISOR", "ADMIN"], {
    message: "Rol inválido. Opciones permitidas: EMPLOYEE, SUPERVISOR, ADMIN",
  }),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid("El ID de usuario debe ser un UUID válido"),
});

export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
