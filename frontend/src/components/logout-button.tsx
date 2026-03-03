import { supabase } from "../lib/supabase";
import { useNavigate } from "@tanstack/react-router";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return <button onClick={handleLogout}>Cerrar sesión</button>;
}
