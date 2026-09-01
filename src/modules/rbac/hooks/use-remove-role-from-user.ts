import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface RemoveRoleFromUserRequest {
  userId: number;
  roleId: number;
}

export function useRemoveRoleFromUser() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleId }: RemoveRoleFromUserRequest) => {
      await api.delete<void>(`/users/${userId}/roles/${roleId}`, {
        errorMessage: "Erro ao remover role do usuário",
      });
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.userId),
      });
    },
  });
}