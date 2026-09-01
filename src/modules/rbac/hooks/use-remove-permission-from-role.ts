import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface RemovePermissionFromRoleRequest {
  roleId: number;
  permId: number;
}

export function useRemovePermissionFromRole() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId, permId }: RemovePermissionFromRoleRequest) => {
      await api.delete<void>(`/roles/${roleId}/permissions/${permId}`, {
        errorMessage: "Erro ao remover permissão da role",
      });
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.detail(variables.roleId),
      });
    },
  });
}