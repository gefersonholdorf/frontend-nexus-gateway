import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface AssignRoleToUserRequest {
  userId: number;
  cd_role: number;
}

export interface AssignRoleToUserResponse {
  cd_user: number;
  cd_role: number;
}

export function useAssignRoleToUser() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, cd_role }: AssignRoleToUserRequest) => {
      const result = await api.post<AssignRoleToUserResponse>(
        `/users/${userId}/roles`,
        {
          body: { cd_role },
          errorMessage: "Erro ao atribuir role ao usuário",
        },
      );

      return result;
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.userId),
      });
    },
  });
}