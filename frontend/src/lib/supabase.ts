import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

export async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

export const getUserImage = async (): Promise<string | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const imageUrl = user.user_metadata?.avatar_url ?? null;
      return imageUrl;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
