import { api } from '@/lib/api';

export type UserRole = "EMPLOYEE" | "SUPERVISOR" | "ADMIN";

export interface SuperAdminUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  employeeId: string | null;
  area: string | null;
  role: UserRole;
  isProfileComplete: boolean;
  createdAt: string;
  _count?: {
    enrollments: number;
    quizAttempts: number;
    simulationAttempts: number;
  };
}

export const superAdminKeys = {
  allUsers: ['superadmin', 'users'] as const,
};

export const superadminApi = {
  getUsers: (): Promise<SuperAdminUser[]> =>
    api.get('/api/superadmin/users').then((r) => r.data),

  updateUserRole: (id: string, role: UserRole): Promise<SuperAdminUser> =>
    api.patch(`/api/superadmin/users/${id}/role`, { role }).then((r) => r.data),
};
