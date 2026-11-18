import { supabase } from "./supabase";

export const SUPERADMIN_DEFAULT_EMAIL = "diego.lopez171205@gmail.com";

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const configuredEmail = (
    import.meta.env.VITE_SUPERADMIN_EMAIL || SUPERADMIN_DEFAULT_EMAIL
  )
    .trim()
    .toLowerCase();
  return email.trim().toLowerCase() === configuredEmail;
}

export interface UserState {
  isAuthenticated: boolean;
  isProfileComplete?: boolean;
  role?: string;
  email?: string;
  isSuperAdmin?: boolean;
}

export async function getUserState(): Promise<UserState> {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    return { isAuthenticated: false };
  }

  const token = data.session.access_token;

  const rawUrl =
    import.meta.env.VITE_AURA_BACKEND_URL || "http://localhost:4000";
  const baseUrl = rawUrl.replace(/\/$/, "");

  const currUserId = data.session.user?.id;
  if (!currUserId) {
    return { isAuthenticated: false };
  }

  const res = await fetch(
    `${baseUrl}/api/profile/dashboard-data/${currUserId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res.status === 401) {
    return { isAuthenticated: false };
  }

  if (res.status === 403) {
    const body = await res.json();

    if (body?.needsCompletion) {
      const userEmail = data.session.user?.email;
      return {
        isAuthenticated: true,
        isProfileComplete: false,
        email: userEmail,
        isSuperAdmin: isSuperAdminEmail(userEmail),
      };
    }

    // 403 raro (no debería pasar)
    return { isAuthenticated: false };
  }

  if (res.ok) {
    const profile = await res.json();
    const userEmail = data.session.user?.email || profile.email;
    return {
      isAuthenticated: true,
      isProfileComplete: true,
      role: profile.role === "WORKER" ? "EMPLOYEE" : profile.role,
      email: userEmail,
      isSuperAdmin: isSuperAdminEmail(userEmail),
    };
  }

  return { isAuthenticated: false };
}
