import { Request, Response, NextFunction } from "express";
import { getSuperAdminUsersService, updateUserRoleService } from "../../services/superadmin.service";
import { changeRoleSchema, userIdParamSchema } from "./superadmin.validation";

export async function getSuperAdminUsersController(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getSuperAdminUsersService();
    res.json(users);
  } catch (err: any) {
    next(err);
  }
}

export async function updateUserRoleController(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = userIdParamSchema.parse(req.params);
    const { role } = changeRoleSchema.parse(req.body);

    const superAdminUserId = req.user?.id;
    const updatedUser = await updateUserRoleService(superAdminUserId, id, role);

    res.json(updatedUser);
  } catch (err: any) {
    if (err?.statusCode) {
      return res.status(err.statusCode).json({ message: err.message, error: err.message });
    }
    next(err);
  }
}
