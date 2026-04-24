import { api } from '@/lib/api';

export const simulationKeys = {
  all: ['simulations'] as const,
  byModule: (moduleId: string) => ['simulations', 'module', moduleId] as const,
  byTitle: (title: string) => ['simulations', 'title', title] as const,
};

export const simulationAttemptKeys = {
  all: ['simulationAttempts'] as const,
  byProfile: (profileId: string) => ['simulationAttempts', 'profile', profileId] as const,
};

export const simulationApi = {
  // Simulation
  getSimulationByModuleId: (moduleId: string) => api.get(`/api/simulations/simulation-by-module/${moduleId}`).then(r => r.data),
  getSimulationByTitle: (title: string) => api.get('/api/simulations/simulation-by-title', { params: { title } }).then(r => r.data),
  createSimulation: (data: any) => api.post('/api/simulations/simulation-create', data).then(r => r.data),
  updateSimulation: (id: string, data: any) => api.put(`/api/simulations/update-simulation/${id}`, data).then(r => r.data),
  
  // Simulation Attempt
  getAttemptsByProfile: (profileId: string) => api.get(`/api/simulations/attempt/${profileId}`).then(r => r.data),
  createAttempt: (data: any) => api.post('/api/simulations/attempt/create-attempt', data).then(r => r.data),
  saveProgress: (attemptId: string, data: any) => api.patch(`/api/simulations/attempt/save-progress/${attemptId}`, data).then(r => r.data),
  submitAttempt: (attemptId: string, data: any) => api.patch(`/api/simulations/attempt/submit/${attemptId}`, data).then(r => r.data),
};
