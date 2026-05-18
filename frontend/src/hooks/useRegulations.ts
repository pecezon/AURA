import { useQuery } from '@tanstack/react-query';
import { regulationApi, regulationKeys } from '@/api/regulationApi';

export const useRegulations = () =>
  useQuery({ queryKey: regulationKeys.all, queryFn: regulationApi.getAll });
