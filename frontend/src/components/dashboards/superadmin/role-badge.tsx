import React from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Eye, User } from "lucide-react";
import type { UserRole } from "@/api/superadminApi";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = "" }) => {
  switch (role) {
    case "ADMIN":
      return (
        <Badge
          variant="outline"
          className={`bg-purple-50 text-purple-700 border-purple-200 font-medium gap-1 px-2.5 py-0.5 text-xs ${className}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          Administrador
        </Badge>
      );
    case "SUPERVISOR":
      return (
        <Badge
          variant="outline"
          className={`bg-blue-50 text-blue-700 border-blue-200 font-medium gap-1 px-2.5 py-0.5 text-xs ${className}`}
        >
          <Eye className="w-3.5 h-3.5 text-blue-600" />
          Supervisor
        </Badge>
      );
    case "EMPLOYEE":
    default:
      return (
        <Badge
          variant="outline"
          className={`bg-emerald-50 text-emerald-700 border-emerald-200 font-medium gap-1 px-2.5 py-0.5 text-xs ${className}`}
        >
          <User className="w-3.5 h-3.5 text-emerald-600" />
          Empleado
        </Badge>
      );
  }
};
