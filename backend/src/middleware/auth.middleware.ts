import { ensureProfile } from "../services/profile.service";
import { supabase } from "../config/supabase";

export async function requireAuth(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user)
    return res.status(403).json({ message: "Invalid token" });

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
