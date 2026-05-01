import { api } from '@/lib/api';

export const profileKeys = {
  all: ['profiles'] as const,
  detail: (id: string) => ['profiles', id] as const,
  myProfile: ['myProfile'] as const,
  search: (query: string) => ['profiles', 'search', query] as const,
};

export const profileApi = {
  getMyProfile: () => api.get('/api/profile').then(r => r.data),
  getProfileById: (id: string) => api.get(`/api/profile/${id}`).then(r => r.data),
  searchProfiles: (query: string) => api.get('/api/profile/search', { params: { query } }).then(r => r.data),
  updateProfile: (data: any) => api.put('/api/profile/update', data).then(r => r.data),
  getAllProfiles: () => api.get('/api/profile/all').then(r => r.data),
};
