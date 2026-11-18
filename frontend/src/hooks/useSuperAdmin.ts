import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  superadminApi,
  superAdminKeys,
  type UserRole,
} from '@/api/superadminApi';
import toast from 'react-hot-toast';

export const useSuperAdminUsers = () => {
  return useQuery({
    queryKey: superAdminKeys.allUsers,
    queryFn: superadminApi.getUsers,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      superadminApi.updateUserRole(id, role),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: superAdminKeys.allUsers });
      const displayName = updatedUser.firstName
        ? `${updatedUser.firstName} ${updatedUser.lastName || ''}`.trim()
        : updatedUser.email;
      toast.success(`Rol de ${displayName} actualizado a ${updatedUser.role}`);
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al actualizar el rol";
      toast.error(msg);
    },
  });
};
