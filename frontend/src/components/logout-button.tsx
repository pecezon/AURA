import { supabase } from "../lib/supabase";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function LogoutButton({ className }: { className?: string }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <Button
      onClick={handleLogout}
      className={
        className + " bg-destructive/80 cursor-pointer hover:bg-destructive"
      }
      size="sm"
      variant="destructive"
    >
      Cerrar sesión
    </Button>
  );
}
