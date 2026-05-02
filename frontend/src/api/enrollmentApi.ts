import { api } from '@/lib/api';

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  byProfile: (profileId: string) => ['enrollments', 'profile', profileId] as const,
  detail: (profileId: string, courseId: string) => ['enrollments', 'detail', profileId, courseId] as const,
};

export const enrollmentApi = {
  getAll: () => api.get('/api/enrollments/all').then(r => r.data),
  getByProfileId: (profileId: string) => api.get(`/api/enrollments/${profileId}`).then(r => r.data),
  enrollInCourse: (data: { profileId: string; courseId: string }) => api.post('/api/enrollments/course-enrollment', data).then(r => r.data),
  getEnrollment: (profileId: string, courseId: string) => api.get(`/api/enrollments/${profileId}/${courseId}`).then(r => r.data),
  completeModule: (profileId: string, courseId: string, moduleId: string) => api.patch(`/api/enrollments/${profileId}/${courseId}/complete-module`, { moduleId }).then(r => r.data),
};
