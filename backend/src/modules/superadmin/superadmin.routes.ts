import { Router } from "express";
import { requireSuperAdmin } from "../../middleware/requireSuperAdmin";
import {
  getSuperAdminUsersController,
  updateUserRoleController,
} from "./superadmin.controller";

const router = Router();

// Apply requireSuperAdmin to all routes in this module
router.use(requireSuperAdmin);

router.get("/users", getSuperAdminUsersController);
router.patch("/users/:id/role", updateUserRoleController);

export default router;
