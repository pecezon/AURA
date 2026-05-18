import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moduleApi, moduleKeys } from '@/api/moduleApi';

export const useModulesByCourse = (courseId: string) =>
  useQuery({ queryKey: moduleKeys.byCourse(courseId), queryFn: () => moduleApi.getAllByCourseId(courseId), enabled: !!courseId });

export const useModuleContentByType = (type: string, courseId?: string) =>
  useQuery({ queryKey: moduleKeys.byType(type, courseId), queryFn: () => moduleApi.getContentByType(type, courseId), enabled: !!type });

export const useModuleByTitle = (title: string) =>
  useQuery({ queryKey: moduleKeys.byTitle(title), queryFn: () => moduleApi.getModuleByTitle(title), enabled: !!title });

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: moduleApi.createModule,
    onSuccess: () => {
      // Invalidate course modules cache if possible
      queryClient.invalidateQueries({ queryKey: moduleKeys.all });
    },
  });
};
