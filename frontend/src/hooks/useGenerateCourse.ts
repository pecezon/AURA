import { useMutation } from '@tanstack/react-query';
import { openaiApi } from '@/api/openaiApi';
import type { GenerateCoursePayload } from '@/api/openaiApi';

export const useGenerateCourse = () => {
  return useMutation({
    mutationFn: (payload: GenerateCoursePayload) => openaiApi.generateCourse(payload),
  });
};
