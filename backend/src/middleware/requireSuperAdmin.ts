import { Request, Response, NextFunction } from "express";

export const SUPERADMIN_DEFAULT_EMAIL = "diego.lopez171205@gmail.com";

export function getSuperAdminEmail(): string {
  return (process.env.SUPERADMIN_EMAIL || SUPERADMIN_DEFAULT_EMAIL).trim().toLowerCase();
}

export function requireSuperAdmin(
  req: Request & { user?: any; profile?: any },
  res: Response,
  next: NextFunction
) {
  const superAdminEmail = getSuperAdminEmail();
  const userEmail = req.user?.email?.trim().toLowerCase();
  const profileEmail = req.profile?.email?.trim().toLowerCase();

  if (!userEmail || userEmail !== superAdminEmail || profileEmail !== superAdminEmail) {
    console.warn(
      `[SECURITY ALERT] Unauthorized access attempt to SuperAdmin endpoint by userId: ${req.user?.id}, email: ${userEmail}, ip: ${req.ip || req.socket.remoteAddress}`
    );
    return res.status(403).json({ message: "Forbidden: SuperAdmin privileges required" });
  }

  next();
}
