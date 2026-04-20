import { api } from '@/lib/api';

export const quizKeys = {
  all: ['quizzes'] as const,
  detail: (id: string) => ['quizzes', id] as const,
  byModule: (moduleId: string) => ['quizzes', 'module', moduleId] as const,
  search: (name: string) => ['quizzes', 'search', name] as const,
};

export const quizAttemptKeys = {
  all: ['quizAttempts'] as const,
  byProfile: (profileId: string) => ['quizAttempts', 'profile', profileId] as const,
  byQuiz: (quizId: string) => ['quizAttempts', 'quiz', quizId] as const,
  byQuizAndProfile: (quizId: string, profileId: string) => ['quizAttempts', 'quiz', quizId, 'profile', profileId] as const,
};

export const quizApi = {
  // Quiz
  createQuiz: (data: any) => api.post('/api/quizzes/create-quiz', data).then(r => r.data),
  searchQuizByName: (name: string) => api.get('/api/quizzes/search-quiz-by-name', { params: { name } }).then(r => r.data),
  getQuizzesInModule: (moduleId: string) => api.get(`/api/quizzes/get-quizzes-in-module/${moduleId}`).then(r => r.data),
  getAllQuizzes: () => api.get('/api/quizzes/').then(r => r.data),
  getQuizById: (id: string) => api.get(`/api/quizzes/${id}`).then(r => r.data),
  
  // Quiz Attempt
  createQuizAttempt: (data: any) => api.post('/api/quiz-attempts/create-quiz-attempt', data).then(r => r.data),
  getAttemptByQuizAndProfile: (quizId: string, profileId: string) => api.get('/api/quiz-attempts/get-by-quiz-and-profile', { params: { quizId, profileId } }).then(r => r.data),
  getAttemptsByProfile: (profileId: string) => api.get(`/api/quiz-attempts/by-profile/${profileId}`).then(r => r.data),
  getAttemptsByQuiz: (quizId: string) => api.get(`/api/quiz-attempts/by-quiz/${quizId}`).then(r => r.data),
};
