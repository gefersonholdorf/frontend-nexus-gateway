import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface CreateRoleRequest {
  ds_name: string;
  ds_description?: string;
}

export interface CreateRoleResponse {
  cd_id: number;
}

export function useCreateRole() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoleRequest) => {
      const result = await api.post<CreateRoleResponse>("/roles", {
        body: data,
        errorMessage: "Erro ao criar role",
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
    },
  });
}