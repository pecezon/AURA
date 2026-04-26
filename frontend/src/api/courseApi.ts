import { api } from '@/lib/api';

export const courseKeys = {
  all: ['courses'] as const,
  detail: (id: string) => ['courses', id] as const,
  search: (query: string) => ['courses', 'search', query] as const,
};

export const courseApi = {
  getAll: () => api.get('/api/courses/get-all-courses').then(r => r.data),
  getById: (id: string) => api.get(`/api/courses/${id}`).then(r => r.data),
  searchCourses: (query: string) => api.get('/api/courses/search', { params: { query } }).then(r => r.data),
  createCourse: (data: any) => api.post('/api/courses/create-course', data).then(r => r.data),
};
