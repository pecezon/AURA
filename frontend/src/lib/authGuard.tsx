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
    return {
      isAuthenticated: true,
      isProfileComplete: false,
    };
  }

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // If we cannot parse the body, fall through to treating this as unauthenticated.
  }
  if (body && body.needsCompletion === true) {
    return {
      isAuthenticated: true,
      isProfileComplete: false,
    };
  }
  return { isAuthenticated: false };
}
