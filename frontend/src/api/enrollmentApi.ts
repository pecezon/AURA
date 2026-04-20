import { api } from '@/lib/api';

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  byProfile: (profileId: string) => ['enrollments', 'profile', profileId] as const,
};

export const enrollmentApi = {
  getAll: () => api.get('/api/enrollments/all').then(r => r.data),
  getByProfileId: (profileId: string) => api.get(`/api/enrollments/${profileId}`).then(r => r.data),
  enrollInCourse: (data: { profileId: string; courseId: string }) => api.post('/api/enrollments/course-enrollment', data).then(r => r.data),
};
