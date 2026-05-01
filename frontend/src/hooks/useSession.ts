import { useQuery } from '@tanstack/react-query';
import { getUserId } from '@/lib/supabase';

export const useSessionId = () => {
  return useQuery({
    queryKey: ['sessionId'],
    queryFn: async () => {
      const id = await getUserId();
      return id;
    },
    staleTime: 5 * 60 * 1000,
  });
};
