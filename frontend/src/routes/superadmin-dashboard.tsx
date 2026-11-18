import { Navbar } from "@/components/navbar";
import { SuperAdminStats } from "@/components/dashboards/superadmin/superadmin-stats";
import { UserManagementTable } from "@/components/dashboards/superadmin/user-management-table";
import { useSuperAdminUsers, useUpdateUserRole } from "@/hooks/useSuperAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";

export default function SuperAdminDashboard() {
  const { data: users = [], isLoading, isError, refetch } = useSuperAdminUsers();
  const { mutateAsync: updateRole, isPending: isUpdatingRole } = useUpdateUserRole();

  const handleUpdateRole = async (id: string, role: "EMPLOYEE" | "SUPERVISOR" | "ADMIN") => {
    await updateRole({ id, role });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar role="ADMIN" />

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-semibold px-2.5 py-0.5 gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Acceso Restringido • SuperAdmin
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Gestión de Usuarios y Roles
            </h1>
            <p className="text-sm text-gray-500">
              Control centralizado de identidades, permisos operativos y asignación de roles en AURA.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="gap-1.5 text-xs bg-white cursor-pointer hover:bg-gray-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-red-800">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Error al cargar la lista de usuarios</p>
                <p className="text-xs text-red-600">
                  Verifica tu conexión y privilegios de Super Administrador.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-red-300 text-red-700 hover:bg-red-100 cursor-pointer text-xs"
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* Overview Stats */}
        <SuperAdminStats users={users} />

        {/* Management Table Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Directorio de Usuarios
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {users.length} {users.length === 1 ? "cuenta" : "cuentas"} en total
            </span>
          </div>

          <UserManagementTable
            users={users}
            isLoading={isLoading}
            onUpdateRole={handleUpdateRole}
            isUpdatingRole={isUpdatingRole}
          />
        </div>
      </main>
    </div>
  );
}
