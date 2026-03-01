import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";

export async function requireAuth(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user)
    return res.status(403).json({ message: "Invalid token" });

  req.user = data.user;
  next();
}
