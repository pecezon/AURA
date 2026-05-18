import { api } from '@/lib/api';

export interface GenerateCoursePayload {
  topic: string;
  courseType: string;
  duration: string;
  applicableNorms: string[];
}

export const openaiApi = {
  generateCourse: (payload: GenerateCoursePayload) =>
    api.post('/api/openai/generate-course', payload).then(r => r.data),
};
