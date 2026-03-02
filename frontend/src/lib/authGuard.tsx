import { supabase } from "./supabase";

export async function getUserState() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    return { isAuthenticated: false };
  }

  const token = data.session.access_token;

  const res = await fetch(
    `${import.meta.env.VITE_AURA_BACKEND_URL}/api/profile/dashboard-data`,
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
    return {
      isAuthenticated: true,
      isProfileComplete: true,
    };
  }

  return { isAuthenticated: false };
}
