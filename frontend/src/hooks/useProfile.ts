import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi, profileKeys } from '@/api/profileApi';

export const useMyProfile = () =>
  useQuery({ queryKey: profileKeys.myProfile, queryFn: profileApi.getMyProfile });

export const useProfile = (id: string) =>
  useQuery({ queryKey: profileKeys.detail(id), queryFn: () => profileApi.getProfileById(id), enabled: !!id });

export const useSearchProfiles = (query: string) =>
  useQuery({ queryKey: profileKeys.search(query), queryFn: () => profileApi.searchProfiles(query), enabled: !!query });

export const useAllProfiles = () =>
  useQuery({ queryKey: profileKeys.all, queryFn: profileApi.getAllProfiles });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      // Invalidate both the current user's profile and the general profiles list
      queryClient.invalidateQueries({ queryKey: profileKeys.myProfile });
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
};
