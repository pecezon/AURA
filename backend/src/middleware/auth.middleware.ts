import { ensureProfile } from "../services/profile.service";
import { supabase } from "../config/supabase";

export async function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const profile = await ensureProfile(data.user);

  req.user = data.user;
  req.profile = profile;

  next();
}

export function requireCompleteProfile(req: any, res: any, next: any) {
  if (!req.profile.isProfileComplete) {
    return res.status(403).json({ needsCompletion: true });
  }
  next();
}
