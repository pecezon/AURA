import React from "react";
import { AvatarDropdown } from "./avatar-dropdown";
import { Button } from "./ui/button";
import { LayoutDashboard, BookOpen, Users, Settings, UserCheck, Sparkles } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface NavbarProps {
  role: "ADMIN" | "WORKER" | "SUPERVISOR";
}

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
};

const SHARED_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard /> },
];

const ROLE_NAV_ITEMS: Record<NavbarProps['role'], NavItem[]> = {
  WORKER: [
    { label: "Mis Cursos", to: "/courses", icon: <BookOpen /> },
  ],
  SUPERVISOR: [
    { label: "Cursos Supervisados", to: "/", icon: <UserCheck /> },
    { label: "Gestión de Equipo", to: "/", icon: <Users /> },
  ],
  ADMIN: [
    { label: "Crear Contenido", to: "/", icon: <Sparkles /> },
  ],
};

// something similar to this could be done for dashboard access

export const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const navigate = useNavigate();
  const navItems = [...SHARED_ITEMS, ...(ROLE_NAV_ITEMS[role] ?? [])];

  return (
    <nav className="w-full border-b bg-white backdrop-blur-sm px-4 py-2 flex items-center justify-between min-h-16 md:px-16 md:py-4">
      <div className="flex items-center gap-8">
        <img src="/images/aura_logo.svg" alt="Aura Logo" className="h-8 md:h-10 lg:h-12 xl:h-14" />
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.to}
              className="cursor-pointer hover:bg-gray-200"
              size="sm"
              variant="ghost"
              onClick={() => navigate({ to: item.to })}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      <AvatarDropdown />
    </nav>
  );
};