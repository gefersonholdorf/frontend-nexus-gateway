import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface UpdateUserRequest {
  id: number;
  ds_name?: string;
  ds_email?: string;
  ds_role_description?: string;
  ds_vpn_name?: string;
  ds_avatar_url?: string;
}

export interface UpdateUserResponse {
  cd_id: number;
}

export function useUpdateUser() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateUserRequest) => {
      const result = await api.put<UpdateUserResponse>(`/users/${id}`, {
        body: data,
        errorMessage: "Erro ao atualizar usuário",
      });

      return result;
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.id),
      });
    },
  });
}