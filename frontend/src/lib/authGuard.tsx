import { getUserId, supabase } from "./supabase";

export async function getUserState() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    return { isAuthenticated: false };
  }

  const token = data.session.access_token;

  const baseUrl =
    import.meta.env.VITE_AURA_BACKEND_URL ?? "http://localhost:8000";

  const currUserId = await getUserId();
  const res = await fetch(
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
    return {
      isAuthenticated: true,
      isProfileComplete: true,
      role: profile.role
    };
  }

  return { isAuthenticated: false };
}
