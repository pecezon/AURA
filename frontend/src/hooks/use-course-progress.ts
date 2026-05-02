import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentApi, enrollmentKeys } from "@/api/enrollmentApi";

interface EnrollmentData {
  profileId: string;
  courseId: string;
  status: string;
  progress: number;
  completedModules: string[];
}

export function useCourseProgress(profileId: string, courseId: string) {
  const queryClient = useQueryClient();
  const queryKey = enrollmentKeys.detail(profileId, courseId);

  const { data: enrollment, isLoading } = useQuery<EnrollmentData>({
    queryKey,
    queryFn: () => enrollmentApi.getEnrollment(profileId, courseId),
    enabled: !!profileId && !!courseId,
    retry: false, // Don't retry if not enrolled (404)
  });

  const mutation = useMutation({
    mutationFn: (moduleId: string) => enrollmentApi.completeModule(profileId, courseId, moduleId),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(queryKey, updatedData);
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.byProfile(profileId) });
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
