import { supabase } from "../lib/supabase";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function LogoutButton({ style }: { style?: string }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <Button
      onClick={handleLogout}
      className={style}
      size="sm"
      variant="destructive"
    >
      Cerrar sesión
    </Button>
  );
}
