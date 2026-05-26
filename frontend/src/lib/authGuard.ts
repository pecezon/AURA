import {  supabase } from "./supabase";

export async function getUserState() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    return { isAuthenticated: false };
  }

  const token = data.session.access_token;

  const baseUrl =
    import.meta.env.VITE_AURA_BACKEND_URL ?? "http://localhost:8000";

  const currUserId = data.session.user?.id;
   if (!currUserId) {
     return { isAuthenticated: false };
   }  const res = await fetch(
    `${baseUrl}/api/profile/dashboard-data/${currUserId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (res.status === 401) {
    return { isAuthenticated: false };
  }

  if (res.status === 403) {
    const body = await res.json();

    if (body?.needsCompletion) {
      return {
        isAuthenticated: true,
        isProfileComplete: false,
      };
    }

    // 403 raro (no debería pasar)
    return { isAuthenticated: false };
  }

  if (res.ok) {
    const profile = await res.json();
    const emulatedRole = localStorage.getItem("aura-demo-emulated-role");
    const activeRole = emulatedRole || profile.role;

    return {
      isAuthenticated: true,
      isProfileComplete: true,
      role: activeRole === "WORKER" || activeRole === "EMPLOYEE" ? "EMPLOYEE" : activeRole,
    };
  }

  return { isAuthenticated: false };
}
