import React from "react";
import { AvatarDropdown } from "./avatar-dropdown";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  return (
    <nav className="w-full border-b bg-background/50 backdrop-blur-sm px-4 py-2 flex items-center justify-between min-h-16">
      <img
        src="images/aura_logo.svg"
        alt="Aura Logo"
        className="h-8 md:h-10 lg:h-12 xl:h-14"
      />
      <AvatarDropdown />
    </nav>
  );
};
