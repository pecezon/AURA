import { useQuery } from '@tanstack/react-query';
import { getUserId } from '@/lib/supabase';

export const useSessionId = () => {
  const { data: profileId } = useQuery({
    queryKey: ['sessionId'],
    queryFn: async () => {
      try {
        const id = await getUserId();
        return id || "";
      } catch (error) {
        return "";
      }
    },
    staleTime: Infinity,
  });

  return profileId ?? null;
};
