import { Navbar } from "../components/navbar";
import { AlertCircle } from "lucide-react";
import { ProfileRecap } from "../components/dashboards/profile-recap";
import MyCourses from "../components/dashboards/my-courses";
import { Skeleton } from "../components/ui/skeleton";
import { useMyProfile } from "@/hooks/useProfile";
import { useProfileEnrollments } from "@/hooks/useEnrollments";
import { useSessionId } from "@/hooks/useSession";
import { useNavigate } from "@tanstack/react-router";

export default function WorkerDashboard() {
  const { data: profileId, isLoading: isSessionLoading } = useSessionId();
  const navigate = useNavigate();

  const { isLoading: isProfileLoading, isError: isProfileError } = useMyProfile();
  const { isLoading: isEnrollmentsLoading, isError: isEnrollmentsError } = useProfileEnrollments(profileId || "");

  if (!isSessionLoading && !profileId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Sesión no encontrada</h1>
        <p className="text-gray-500 mt-2">Por favor, inicia sesión nuevamente para ver tu panel.</p>
        <button 
          onClick={() => navigate({ to: "/" })} 
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Ir al Inicio
        </button>
      </div>
    );
  }

  const isError = isProfileError || isEnrollmentsError;
  const isLoading = isSessionLoading || isProfileLoading || isEnrollmentsLoading;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold text-gray-800">Error al cargar datos</h1>
        <p className="text-gray-500 text-center max-w-md px-4">
          No pudimos conectar con el servidor para obtener tu información. Verifica tu conexión o intenta nuevamente.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-100 gap-6 md:gap-8">
        <Navbar role="EMPLOYEE" />
        <div className="w-full px-4 py-2 md:px-16 md:py-4 flex flex-col gap-4">
          <Skeleton className="h-10 w-3/4 max-w-md bg-gray-300" />
          <Skeleton className="h-6 w-2/4 max-w-sm bg-gray-300" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 w-full">
            <Skeleton className="h-32 w-full bg-gray-300" />
            <Skeleton className="h-32 w-full bg-gray-300" />
            <Skeleton className="h-32 w-full bg-gray-300" />
            <Skeleton className="h-32 w-full bg-gray-300" />
          </div>
          <div className="w-full mt-4">
            <Skeleton className="h-64 w-full bg-gray-300" />
          </div>
        </div>
        <div className="w-full flex flex-col pb-8 px-4 md:px-16 gap-4">
          <Skeleton className="h-8 w-48 mb-2 bg-gray-300" />
          <Skeleton className="h-40 w-full bg-gray-300" />
          <Skeleton className="h-40 w-full bg-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 gap-6 md:gap-8">
      <Navbar role="EMPLOYEE" />
      <ProfileRecap />
      <MyCourses />
    </div>
  );
}
