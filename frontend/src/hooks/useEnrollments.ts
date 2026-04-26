import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentApi, enrollmentKeys } from '@/api/enrollmentApi';

export const useEnrollments = () =>
  useQuery({ queryKey: enrollmentKeys.all, queryFn: enrollmentApi.getAll });

export const useProfileEnrollments = (profileId: string) =>
  useQuery({ queryKey: enrollmentKeys.byProfile(profileId), queryFn: () => enrollmentApi.getByProfileId(profileId), enabled: !!profileId });

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enrollmentApi.enrollInCourse,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.byProfile(variables.profileId) });
    },
  });
};
