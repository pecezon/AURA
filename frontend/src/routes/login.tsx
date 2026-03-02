import { supabase } from "../lib/supabase";

export default function Login() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${import.meta.env.VITE_AURA_FRONTEND_URL}/dashboard`,
      },
    });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Login Page</h1>
      <button
        onClick={loginWithGoogle}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
}
