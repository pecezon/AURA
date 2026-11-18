import React from "react";
import { Card } from "@/components/ui/card";
import { Users, ShieldAlert, Eye, Briefcase } from "lucide-react";
import type { SuperAdminUser } from "@/api/superadminApi";

interface SuperAdminStatsProps {
  users: SuperAdminUser[];
}

export const SuperAdminStats: React.FC<SuperAdminStatsProps> = ({ users }) => {
  const total = users.length;
  const admins = users.filter((u) => u.role === "ADMIN").length;
  const supervisors = users.filter((u) => u.role === "SUPERVISOR").length;
  const employees = users.filter((u) => u.role === "EMPLOYEE").length;

  const stats = [
    {
      label: "Total Usuarios",
      value: total,
      description: "Cuentas registradas en AURA",
      icon: <Users className="w-5 h-5 text-gray-700" />,
      bg: "bg-gray-100",
      border: "border-gray-200",
    },
    {
      label: "Administradores",
      value: admins,
      description: "Gestión de cursos e IA",
      icon: <ShieldAlert className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      label: "Supervisores",
      value: supervisors,
      description: "Monitoreo y analíticas de equipo",
      icon: <Eye className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      label: "Empleados",
      value: employees,
      description: "Capacitaciones y simulaciones",
      icon: <Briefcase className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={`p-5 bg-white border ${stat.border} shadow-sm transition-all hover:shadow-md flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {stat.label}
            </span>
            <div className={`p-2.5 rounded-lg ${stat.bg}`}>{stat.icon}</div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-gray-900">
              {stat.value}
            </span>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
