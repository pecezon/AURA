import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

export function requireRole(roles: string[]) {
  return async (req: any, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const profile = await prisma.profile.findUnique({
      where: { id: userId },
    });

    if (!profile || !roles.includes(profile.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}
