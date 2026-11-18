import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "./role-badge";
import { ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import type { SuperAdminUser, UserRole } from "@/api/superadminApi";

interface RoleChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: SuperAdminUser | null;
  targetRole: UserRole | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export const RoleChangeDialog: React.FC<RoleChangeDialogProps> = ({
  isOpen,
  onClose,
  user,
  targetRole,
  onConfirm,
  isLoading,
}) => {
  if (!user || !targetRole) return null;

  const displayName = user.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user.email || "Usuario";

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "Acceso total a la creación de cursos, configuración de IA, módulos y biblioteca administrativa.";
      case "SUPERVISOR":
        return "Acceso a la analítica de equipos, progreso de cursos y métricas grupales de desempeño.";
      case "EMPLOYEE":
        return "Acceso como trabajador a cursos asignados, simulaciones de seguridad y evaluaciones.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="max-w-md bg-white border border-gray-200 shadow-xl rounded-xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            <DialogTitle className="text-lg font-bold text-gray-900">
              Confirmar Cambio de Rol
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-500">
            Esta acción modificará inmediatamente los permisos y accesos del usuario en la plataforma AURA.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 space-y-4">
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Usuario Afectado
            </p>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">{displayName}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
            <div className="flex flex-col gap-1 items-start">
              <span className="text-xs font-medium text-gray-500">Rol Actual</span>
              <RoleBadge role={user.role} />
            </div>

            <ArrowRight className="w-4 h-4 text-gray-400" />

            <div className="flex flex-col gap-1 items-start">
              <span className="text-xs font-medium text-gray-500">Nuevo Rol</span>
              <RoleBadge role={targetRole} />
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-blue-50 border border-blue-100 p-3 rounded-lg leading-relaxed">
            <span className="font-semibold text-blue-900 block mb-0.5">Impacto de permisos:</span>
            {getRoleDescription(targetRole)}
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirmar Cambio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
