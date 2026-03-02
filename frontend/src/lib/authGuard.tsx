import { supabase } from "./supabase";

export async function getUserState() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    return { isAuthenticated: false };
  }

  const token = data.session.access_token;

  const res = await fetch("http://localhost:4000/api/profile/dashboard-data", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    return { isAuthenticated: false };
  }

  if (res.status === 403) {
    return {
      isAuthenticated: true,
      isProfileComplete: false,
    };
  }

  return {
    isAuthenticated: true,
    isProfileComplete: true,
  };
}
