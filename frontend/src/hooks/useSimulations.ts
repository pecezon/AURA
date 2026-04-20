import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { simulationApi, simulationKeys, simulationAttemptKeys } from '@/api/simulationApi';

// --- SIMULATION HOOKS ---

export const useSimulationByModule = (moduleId: string) =>
  useQuery({ queryKey: simulationKeys.byModule(moduleId), queryFn: () => simulationApi.getSimulationByModuleId(moduleId), enabled: !!moduleId });

export const useSimulationByTitle = (title: string) =>
  useQuery({ queryKey: simulationKeys.byTitle(title), queryFn: () => simulationApi.getSimulationByTitle(title), enabled: !!title });

export const useCreateSimulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: simulationApi.createSimulation,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: simulationKeys.all });
      if (variables.moduleId) {
        queryClient.invalidateQueries({ queryKey: simulationKeys.byModule(variables.moduleId) });
      }
    },
  });
};

export const useUpdateSimulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => simulationApi.updateSimulation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: simulationKeys.all });
    },
  });
};

// --- SIMULATION ATTEMPT HOOKS ---

export const useSimulationAttemptsByProfile = (profileId: string) =>
  useQuery({ queryKey: simulationAttemptKeys.byProfile(profileId), queryFn: () => simulationApi.getAttemptsByProfile(profileId), enabled: !!profileId });

export const useCreateSimulationAttempt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: simulationApi.createAttempt,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: simulationAttemptKeys.all });
      if (variables.profileId) {
        queryClient.invalidateQueries({ queryKey: simulationAttemptKeys.byProfile(variables.profileId) });
      }
    },
  });
};

export const useSaveSimulationProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attemptId, data }: { attemptId: string; data: any }) => simulationApi.saveProgress(attemptId, data),
    // optionally invalidate or update cache optimistically
  });
};

export const useSubmitSimulationAttempt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attemptId, data }: { attemptId: string; data: any }) => simulationApi.submitAttempt(attemptId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: simulationAttemptKeys.all });
    },
  });
};
