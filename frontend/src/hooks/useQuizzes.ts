import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizApi, quizKeys, quizAttemptKeys } from '@/api/quizApi';

// --- QUIZ HOOKS ---

export const useQuizzes = () =>
  useQuery({ queryKey: quizKeys.all, queryFn: quizApi.getAllQuizzes });

export const useQuiz = (id: string) =>
  useQuery({ queryKey: quizKeys.detail(id), queryFn: () => quizApi.getQuizById(id), enabled: !!id });

export const useQuizzesByModule = (moduleId: string) =>
  useQuery({ queryKey: quizKeys.byModule(moduleId), queryFn: () => quizApi.getQuizzesInModule(moduleId), enabled: !!moduleId });

export const useSearchQuizByName = (name: string) =>
  useQuery({ queryKey: quizKeys.search(name), queryFn: () => quizApi.searchQuizByName(name), enabled: !!name });

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: quizApi.createQuiz,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.all });
      if (variables.moduleId) {
        queryClient.invalidateQueries({ queryKey: quizKeys.byModule(variables.moduleId) });
      }
    },
  });
};

// --- QUIZ ATTEMPT HOOKS ---

export const useAttemptsByProfile = (profileId: string) =>
  useQuery({ queryKey: quizAttemptKeys.byProfile(profileId), queryFn: () => quizApi.getAttemptsByProfile(profileId), enabled: !!profileId });

export const useAttemptsByQuiz = (quizId: string) =>
  useQuery({ queryKey: quizAttemptKeys.byQuiz(quizId), queryFn: () => quizApi.getAttemptsByQuiz(quizId), enabled: !!quizId });

export const useAttemptByQuizAndProfile = (quizId: string, profileId: string) =>
  useQuery({ 
    queryKey: quizAttemptKeys.byQuizAndProfile(quizId, profileId), 
    queryFn: () => quizApi.getAttemptByQuizAndProfile(quizId, profileId),
    enabled: !!quizId && !!profileId 
  });

export const useCreateQuizAttempt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: quizApi.createQuizAttempt,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: quizAttemptKeys.all });
      if (variables.profileId) {
        queryClient.invalidateQueries({ queryKey: quizAttemptKeys.byProfile(variables.profileId) });
      }
      if (variables.quizId) {
        queryClient.invalidateQueries({ queryKey: quizAttemptKeys.byQuiz(variables.quizId) });
      }
    },
  });
};
