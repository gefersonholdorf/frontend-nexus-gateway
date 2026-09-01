import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface AssignPermissionToRoleRequest {
  roleId: number;
  cd_permission: number;
}

export interface AssignPermissionToRoleResponse {
  cd_role: number;
  cd_permission: number;
}

export function useAssignPermissionToRole() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roleId,
      cd_permission,
    }: AssignPermissionToRoleRequest) => {
      const result = await api.post<AssignPermissionToRoleResponse>(
        `/roles/${roleId}/permissions`,
        {
          body: { cd_permission },
          errorMessage: "Erro ao atribuir permissão à role",
        },
      );

      return result;
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.detail(variables.roleId),
      });
    },
  });
}