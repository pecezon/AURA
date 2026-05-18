import { api } from '@/lib/api';

export const regulationKeys = {
  all: ['regulations'] as const,
};

export const regulationApi = {
  getAll: () => api.get('/api/regulations').then(r => r.data),
};
