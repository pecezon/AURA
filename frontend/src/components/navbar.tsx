import React from "react";
import { AvatarDropdown } from "./avatar-dropdown";
import { Button } from "./ui/button";
import { LayoutDashboard, BookOpen } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full border-b bg-background/50 backdrop-blur-sm px-4 py-2 flex items-center justify-between min-h-16">
      <div className="flex items-center gap-8">
        <img
          src="images/aura_logo.svg"
          alt="Aura Logo"
          className="h-8 md:h-10 lg:h-12 xl:h-14"
        />
        <div className="flex hidden md:flex items-center gap-2">
          <Button
            className="cursor-pointer hover:bg-gray-200"
            size="sm"
            variant="ghost"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            <LayoutDashboard />
            Dashboard
          </Button>
          <Button
            className="cursor-pointer hover:bg-gray-200"
            size="sm"
            variant="ghost"
            onClick={() => navigate({ to: "/courses" })}
          >
            <BookOpen />
            Mis Cursos
          </Button>
        </div>
      </div>
      <AvatarDropdown />
    </nav>
  );
};
