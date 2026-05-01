import { api } from '@/lib/api';

export const moduleKeys = {
  all: ['modules'] as const,
  byCourse: (courseId: string) => ['modules', 'course', courseId] as const,
  byType: (type: string, courseId?: string) => ['modules', 'content-type', type, courseId].filter(Boolean) as string[],
  byTitle: (title: string) => ['modules', 'title', title] as const,
};

export const moduleApi = {
  createModule: (data: any) => api.post('/api/modules/create-module', data).then(r => r.data),
  getAllByCourseId: (courseId: string) => api.get(`/api/modules/get-all-modules-by-course/${courseId}`).then(r => r.data),
  getContentByType: (type: string, courseId?: string) => api.get('/api/modules/get-all-modules-content-by-type', { params: { type, courseId } }).then(r => r.data),
  getModuleByTitle: (title: string) => api.get('/api/modules/get-module-by-title', { params: { title } }).then(r => r.data),
};
