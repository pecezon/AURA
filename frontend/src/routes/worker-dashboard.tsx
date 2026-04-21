import { Navbar } from "../components/navbar";
import { ProfileRecap } from "../components/dashboards/profile-recap";
import MyCourses from "../components/dashboards/my-courses";
import { Skeleton } from "../components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getUserId } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function WorkerDashboard() {
  const [profileId, setProfileId] = useState<string>("");

  useEffect(() => {
    const loadProfileId = async () => {
      const id = await getUserId();
      setProfileId(id || "");
    };
    loadProfileId();
  }, []);

  const { isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", profileId],
    queryFn: async () => {
      const response = await api.get(`api/profile`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!profileId,
  });

  const { isLoading: isEnrollmentsLoading } = useQuery({
    queryKey: ["enrollments", profileId],
    queryFn: async () => {
      const response = await api.get(`api/enrollments/${profileId}`);
      return response.data;
    },
    staleTime: 0.5 * 60 * 1000,
    enabled: !!profileId,
  });

  const isLoading = !profileId || isProfileLoading || isEnrollmentsLoading;

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
