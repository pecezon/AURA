import { ensureProfile } from "../services/profile.service";
import { supabase } from "../config/supabase";
import { prisma } from "../config/prisma";

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

  let profile = await ensureProfile(data.user);

  // Bypass de contexto para el Demo Mode
  const demoOverrideRole = req.headers["x-demo-override-role"];
  if (process.env.DEMO_MODE === "true" && demoOverrideRole) {
    let targetEmail = "";
    if (demoOverrideRole === "ADMIN") {
      targetEmail = "admin@aura.com";
    } else if (demoOverrideRole === "SUPERVISOR") {
      targetEmail = "supervisor@aura.com";
    } else if (demoOverrideRole === "EMPLOYEE" || demoOverrideRole === "WORKER") {
      targetEmail = "worker@aura.com";
    }

    if (targetEmail) {
      const demoProfile = await prisma.profile.findFirst({
        where: { email: targetEmail }
      });

      if (demoProfile) {
        profile = demoProfile;
        req.user = { id: demoProfile.id, email: demoProfile.email };

        // Intercept query/body profileId in demo mode
        if (req.body && typeof req.body === "object" && req.body.profileId) {
          req.body.profileId = demoProfile.id;
        }
        if (req.query && typeof req.query === "object" && req.query.profileId) {
          req.query.profileId = demoProfile.id;
        }
      }
    }
  }

  req.user = req.user || data.user;
  req.profile = profile;

  next();
}

export function requireCompleteProfile(req: any, res: any, next: any) {
  if (!req.profile.isProfileComplete) {
    return res.status(403).json({ needsCompletion: true });
  }
  next();
}

export function requireAdmin(req: any, res: any, next: any) {
  if (req.profile?.role !== "ADMIN" && req.profile?.role !== "SUPERVISOR") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
