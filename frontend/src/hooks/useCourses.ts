import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApi, courseKeys } from '@/api/courseApi';

export const useCourses = () =>
    useQuery({ queryKey: courseKeys.all, queryFn: courseApi.getAll });

export const useCourse = (id: string) =>
    useQuery({ queryKey: courseKeys.detail(id), queryFn: () => courseApi.getById(id), enabled: !!id });

export const useSearchCourses = (query: string) =>
    useQuery({ queryKey: courseKeys.search(query), queryFn: () => courseApi.searchCourses(query), enabled: !!query });

export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: courseApi.createCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: courseKeys.all });
        },
    });
};