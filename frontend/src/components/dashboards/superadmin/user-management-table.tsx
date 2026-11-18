import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleBadge } from "./role-badge";
import { RoleChangeDialog } from "./role-change-dialog";
import { isSuperAdminEmail } from "@/lib/authGuard";
import {
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  UserCog,
  X,
} from "lucide-react";
import type { SuperAdminUser, UserRole } from "@/api/superadminApi";

interface UserManagementTableProps {
  users: SuperAdminUser[];
  isLoading: boolean;
  onUpdateRole: (id: string, role: UserRole) => Promise<any> | void;
  isUpdatingRole: boolean;
}

type RoleFilter = "ALL" | UserRole;

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  isLoading,
  onUpdateRole,
  isUpdatingRole,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  // Selected user and target role for modal confirmation
  const [selectedUser, setSelectedUser] = useState<SuperAdminUser | null>(null);
  const [targetRole, setTargetRole] = useState<UserRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Role filter
      if (roleFilter !== "ALL" && user.role !== roleFilter) {
        return false;
      }

      // Search term filter
      if (!searchTerm.trim()) return true;

      const term = searchTerm.toLowerCase();
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const email = (user.email || "").toLowerCase();
      const empId = (user.employeeId || "").toLowerCase();
      const area = (user.area || "").toLowerCase();

      return (
        fullName.includes(term) ||
        email.includes(term) ||
        empId.includes(term) ||
        area.includes(term)
      );
    });
  }, [users, roleFilter, searchTerm]);

  const handleOpenRoleDialog = (user: SuperAdminUser, newRole: UserRole) => {
    if (user.role === newRole) return;
    setSelectedUser(user);
    setTargetRole(newRole);
    setIsDialogOpen(true);
  };

  const handleConfirmRoleChange = async () => {
    if (!selectedUser || !targetRole) return;
    try {
      await onUpdateRole(selectedUser.id, targetRole);
      setIsDialogOpen(false);
      setSelectedUser(null);
      setTargetRole(null);
    } catch {
      // Handled by mutation onError toast
    }
  };

  const roleFilterButtons: { label: string; value: RoleFilter }[] = [
    { label: "Todos", value: "ALL" },
    { label: "Administradores", value: "ADMIN" },
    { label: "Supervisores", value: "SUPERVISOR" },
    { label: "Empleados", value: "EMPLOYEE" },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, correo, ID o área..."
            className="pl-9 pr-9 bg-white border-gray-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Role Filter Tabs */}
        <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
          {roleFilterButtons.map((btn) => (
            <Button
              key={btn.value}
              variant={roleFilter === btn.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setRoleFilter(btn.value)}
              className={`text-xs px-3 py-1 cursor-pointer ${
                roleFilter === btn.value
                  ? "bg-white text-gray-900 shadow-xs hover:bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
              }`}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Users Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 border-b border-gray-200">
            <TableRow>
              <TableHead className="py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                Usuario
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                Identificación & Área
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                Estado de Perfil
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                Rol Actual
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // Skeleton loading state conforming to REFERENCES.md
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="border-b border-gray-100">
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-44" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-20" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="py-3 px-4 text-right">
                    <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <UserCog className="w-10 h-10 stroke-1 mb-2 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-700">
                      No se encontraron usuarios
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Prueba modificando los filtros de búsqueda o el rol seleccionado.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const isSuperAdminAccount = isSuperAdminEmail(user.email);
                const fullName = user.firstName
                  ? `${user.firstName} ${user.lastName || ""}`.trim()
                  : "Sin nombre registrado";
                const initials = (user.firstName?.[0] || user.email?.[0] || "U").toUpperCase();

                return (
                  <TableRow
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                  >
                    {/* User Info */}
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 border border-gray-200">
                          <AvatarFallback className="bg-indigo-50 text-indigo-700 font-semibold text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-gray-900">
                              {fullName}
                            </span>
                            {isSuperAdminAccount && (
                              <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0 font-medium"
                              >
                                SuperAdmin
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* ID & Area */}
                    <TableCell className="py-3 px-4">
                      <div className="flex flex-col text-xs">
                        <span className="font-medium text-gray-800">
                          {user.employeeId || "Sin ID"}
                        </span>
                        <span className="text-gray-500">
                          {user.area || "Área no asignada"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Profile Completeness */}
                    <TableCell className="py-3 px-4">
                      {user.isProfileComplete ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs gap-1 font-normal"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Completo
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200 text-xs gap-1 font-normal"
                        >
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>

                    {/* Role Badge */}
                    <TableCell className="py-3 px-4">
                      <RoleBadge role={user.role} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3 px-4 text-right">
                      {isSuperAdminAccount ? (
                        <span className="text-xs text-gray-400 italic pr-2">
                          Cuenta principal
                        </span>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-100"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-600" />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200">
                            <DropdownMenuLabel className="text-xs text-gray-500">
                              Asignar Nuevo Rol
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled={user.role === "ADMIN"}
                              onClick={() => handleOpenRoleDialog(user, "ADMIN")}
                              className="cursor-pointer text-xs flex items-center justify-between"
                            >
                              <span>Administrador</span>
                              {user.role === "ADMIN" && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={user.role === "SUPERVISOR"}
                              onClick={() => handleOpenRoleDialog(user, "SUPERVISOR")}
                              className="cursor-pointer text-xs flex items-center justify-between"
                            >
                              <span>Supervisor</span>
                              {user.role === "SUPERVISOR" && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={user.role === "EMPLOYEE"}
                              onClick={() => handleOpenRoleDialog(user, "EMPLOYEE")}
                              className="cursor-pointer text-xs flex items-center justify-between"
                            >
                              <span>Empleado</span>
                              {user.role === "EMPLOYEE" && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <RoleChangeDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedUser(null);
          setTargetRole(null);
        }}
        user={selectedUser}
        targetRole={targetRole}
        onConfirm={handleConfirmRoleChange}
        isLoading={isUpdatingRole}
      />
    </div>
  );
};
