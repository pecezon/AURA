import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "@tanstack/react-router";
import { User, LogOut } from "lucide-react";
import { useMyProfile } from "@/hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";

export function AvatarDropdown() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return;
    }
    queryClient.clear();
    navigate({ to: "/" });
  };

  const handleProfileClick = () => {
    navigate({ to: "/profile" });
  };

  const { data: profile, isLoading } = useMyProfile();
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);

  const user = {
    name: profile ? `${profile.firstName} ${profile.lastName}` : (authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || ""),
    email: profile ? profile.email : (authUser?.email || ""),
    role: profile ? profile.role : "IT",
  };

  // Fetch User Image
  const [userImage, setUserImage] = useState<string | null>(null);
  useEffect(() => {
    const load = async () => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (sessionUser) {
        setAuthUser(sessionUser);
        setUserImage(sessionUser.user_metadata?.avatar_url ?? null);
      }
    };

    //Prevents loading 2 times
    if (!userImage) load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex space-x-2 px-2 py-1 items-center gap-2">
        <div className="flex flex-col space-y-2 items-end">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer flex space-x-2 px-2 py-1 rounded-md justify-between gap-2 items-center hover:bg-gray-100 ">
        <div className="justify-end text-right">
          <p className="text-sm md:text-lg">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.role}</p>
        </div>
        <Avatar className="md:w-10 md:h-10 ">
          <AvatarImage
            src={userImage || undefined}
            alt="User Image"
            referrerPolicy="no-referrer"
          />
          <AvatarFallback className="bg-electric-royal-500 text-white">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleProfileClick} className="gap-2">
          <User className="w-4 h-4" />
          Mi Perfil
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-500 gap-2" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
