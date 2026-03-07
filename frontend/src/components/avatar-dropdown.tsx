import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserImage } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "@tanstack/react-router";

export function AvatarDropdown() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const user = {
    name: "Diego Lopez",
    email: "diego@email.com",
    userArea: "IT",
  };

  // Fetch User Image
  const [userImage, setUserImage] = useState<string | null>(null);
  useEffect(() => {
    const load = async () => {
      const image = await getUserImage();
      setUserImage(image);
    };

    //Prevents loading 2 times
    if (!userImage) load();
  }, []);

  //TODO: Fetch user data from API

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer flex space-x-2 px-2 py-1 rounded-md flex-between items-center hover:bg-gray-100 ">
        <div className="justify-end text-right">
          <p className="text-sm md:text-lg">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.userArea}</p>
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

        <DropdownMenuItem>Profile</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
