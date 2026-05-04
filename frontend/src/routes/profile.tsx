import { useState, useEffect } from "react";
import { useMyProfile } from "@/hooks/useProfile";
import { getUserImage } from "../lib/supabase";
import { Navbar } from "../components/navbar";
import { EditProfileModal } from "../components/edit-profile-modal";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
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
  Edit3,
  ShieldCheck,
} from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

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



export default function ProfilePage() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const image = await getUserImage();
      setUserImage(image);
    };
    load();
  }, []);

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useMyProfile();

  const handleEditSuccess = () => {
    refetch();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    // Explicitly format as UTC to prevent timezone offset shifts for birth dates
    return date.toLocaleDateString("es-ES", {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeVariant = (role: ProfileData["role"]) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "SUPERVISOR":
        return "default";
      case "WORKER":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoading />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            
            <Card className="overflow-hidden">
              <CardContent className="relative pt-20 px-6 pb-6">
                <div className="flex flex-col md:flex-row items-center gap-6 -mt-16 mb-2">
                  <Skeleton className="w-32 h-32 rounded-full mx-auto md:mx-0 shadow-lg" />
                  <div className="flex-1 flex flex-col items-center md:items-start justify-center w-full space-y-3">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-28 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full sm:w-32 mt-4 md:mt-0 rounded-md" />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-0">
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent className="space-y-4 -mt-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-gray-500 mt-1">
                Administra la información de tu cuenta
              </p>
            </div>
          </div>
          
          <Card className="overflow-hidden">
            <CardContent className="relative pt-20 px-6 pb-6">
              <div className="flex flex-col md:flex-row items-center gap-6 -mt-16 mb-2">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg mx-auto md:mx-0">
                  <AvatarImage
                    src={userImage || undefined}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback className="bg-linear-to-br from-blue-400 to-indigo-600 text-white text-2xl">
                    {profile.firstName?.charAt(0) || "U"}
                    {profile.lastName?.charAt(0) || ""}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.firstName || ""} {profile.lastName || ""}
                    {!profile.firstName && !profile.lastName && "Usuario"}
                  </h2>
                  <p className="text-gray-500">{profile.email}</p>
                  <div className="flex gap-2 mt-3 flex-wrap justify-center md:justify-start">
                    <Badge variant={getRoleBadgeVariant(profile.role)} className="text-sm">
                      {profile.role === "WORKER"
                        ? "Trabajador"
                        : profile.role === "ADMIN"
                          ? "Administrador"
                          : "Supervisor"}
                    </Badge>
                    {profile.isProfileComplete && (
                      <Badge variant="default" className="bg-green-600 text-sm">
                        Perfil Completo
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center w-full md:w-auto mt-4 md:mt-0">
                  <Button
                    onClick={() => setIsEditModalOpen(true)}
                    className="gap-2 w-full sm:w-auto"
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
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 -mt-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nombre Completo</p>
                  <p className="font-semibold text-gray-900">
                    {profile.firstName || ""} {profile.lastName || ""}
                    {!profile.firstName && !profile.lastName && "Usuario"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Fecha de Nacimiento
                  </p>
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
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 -mt-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Correo Electrónico
                  </p>
                  <p className="font-semibold text-gray-900 break-all">
                    {profile.email}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  Información Laboral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 -mt-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID de Empleado</p>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span className="font-semibold font-mono">
                      {profile.employeeId || "No especificado"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Área</p>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">{profile.area || "No especificada"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  Estado de la Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 -mt-3">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Rol</p>
                  <Badge
                    variant={getRoleBadgeVariant(profile.role)}
                    className="text-sm"
                  >
                    {profile.role === "EMPLOYEE"
                      ? "Empleado"
                      : profile.role === "SUPERVISOR"
                        ? "Supervisor"
                        : "Propietario"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Estado del Perfil
                  </p>
                  <Badge
                    variant="default"
                    className={`text-sm ${
                      profile.isProfileComplete
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {profile.isProfileComplete ? "Completo" : "Incompleto"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Fecha de Registro
                  </p>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-medium">
                      {formatDate(profile.createdAt)}
                    </p>
                  </div>
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
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : "",
          employeeId: profile.employeeId || "",
          area: profile.area || "",
        }}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
