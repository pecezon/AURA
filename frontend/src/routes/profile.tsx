import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserImage } from "../lib/supabase";
import { Navbar } from "../components/navbar";
import { EditProfileModal } from "../components/edit-profile-modal";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Mail,
  User,
  Briefcase,
  Building2,
  Calendar,
  AlertCircle,
  Loader2,
  Edit3,
} from "lucide-react";

interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  employeeId: string;
  area: string;
  role: "WORKER" | "ADMIN" | "SUPERVISOR";
  isProfileComplete: boolean;
  createdAt: string;
}

const MOCK_PROFILE: ProfileData = {
  id: "usr_01j9k2m4n8p",
  email: "carlos.mendoza@empresa.com",
  firstName: "Carlos",
  lastName: "Mendoza",
  birthDate: "1990-03-15",
  employeeId: "EMP-2024-042",
  area: "Ingeniería de Software",
  role: "ADMIN",
  isProfileComplete: true,
  createdAt: "2024-01-10T09:00:00Z",
};

async function fetchProfile(): Promise<ProfileData> {
  // Swap this out for when its implemented: const { data } = await api.get("/api/profile"); return data;
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_PROFILE), 500));
}

export default function ProfilePage() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const image = await getUserImage();
      setUserImage(image);
    };
    if (!userImage) load();
  }, []);

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const handleEditSuccess = () => {
    refetch();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "OWNER":
        return "default";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar role="WORKER" />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar role="WORKER" />
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No se pudo cargar la información del perfil. Por favor, intenta
              más tarde.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={profile.role} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-gray-500 mt-1">
                Administra la información de tu cuenta
              </p>
            </div>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="relative pt-20 px-6 pb-6">
              <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-6">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={userImage || undefined}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback className="bg-linear-to-br from-blue-400 to-indigo-600 text-white text-2xl">
                    {profile.firstName.charAt(0)}
                    {profile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col justify-end pb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-gray-500">{profile.email}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <Badge variant={getRoleBadgeVariant(profile.role)}>
                      {profile.role === "WORKER"
                        ? "Empleado"
                        : profile.role === "ADMIN"
                          ? "Administrador"
                          : "Propietario"}
                    </Badge>
                    {profile.isProfileComplete && (
                      <Badge variant="default" className="bg-green-600">
                        Perfil Completo
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-end pb-2">
                  <Button
                    onClick={() => setIsEditModalOpen(true)}
                    className="gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar Perfil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nombre Completo</p>
                  <p className="font-semibold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha de Nacimiento</p>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">
                      {formatDate(profile.birthDate)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Correo Electrónico</p>
                  <p className="font-semibold text-gray-900 break-all">
                    {profile.email}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  Información Laboral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID de Empleado</p>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span className="font-semibold font-mono">
                      {profile.employeeId}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Área</p>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">{profile.area}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estado de la Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Rol</p>
                  <Badge variant={getRoleBadgeVariant(profile.role)} className="text-base">
                    {profile.role === "WORKER"
                      ? "Empleado"
                      : profile.role === "ADMIN"
                        ? "Administrador"
                        : "Propietario"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Estado del Perfil</p>
                  <Badge
                    variant="default"
                    className={
                      profile.isProfileComplete ? "bg-green-600" : "bg-yellow-600"
                    }
                  >
                    {profile.isProfileComplete ? "Completo" : "Incompleto"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha de Registro</p>
                  <p className="text-sm text-gray-700">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={{
          firstName: profile.firstName,
          lastName: profile.lastName,
          birthDate: profile.birthDate,
          employeeId: profile.employeeId,
          area: profile.area,
        }}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}