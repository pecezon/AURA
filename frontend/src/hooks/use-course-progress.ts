import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface EnrollmentData {
  profileId: string;
  courseId: string;
  status: string;
  progress: number;
  completedModules: string[];
}

export function useCourseProgress(profileId: string, courseId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["enrollment", profileId, courseId];

  const { data: enrollment, isLoading } = useQuery<EnrollmentData>({
    queryKey,
    queryFn: async () => {
      const response = await api.get(`/api/enrollments/${profileId}/${courseId}`);
      return response.data;
    },
    enabled: !!profileId && !!courseId,
    retry: false, // Don't retry if not enrolled (404)
  });

  const mutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const response = await api.patch(`/api/enrollments/${profileId}/${courseId}/complete-module`, {
        moduleId,
      });
      return response.data;
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(queryKey, updatedData);
      queryClient.invalidateQueries({ queryKey: ["enrollment", profileId, courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-enrollments", profileId] });
    },
  });

  const completedModules = enrollment?.completedModules || [];

  const markModuleAsCompleted = (moduleId: string) => {
    if (!profileId || !courseId) return;
    if (completedModules.includes(moduleId)) return;
    mutation.mutate(moduleId);
  };

  const isModuleCompleted = (moduleId: string) => {
    return completedModules.includes(moduleId);
  };

  const getProgressPercentage = (totalModules: number) => {
    return enrollment?.progress || 0;
  };

  return {
    completedModules,
    markModuleAsCompleted,
    isModuleCompleted,
    getProgressPercentage,
    isLoading: isLoading || mutation.isPending,
  };
}
