import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface CreatePermissionRequest {
  ds_key: string;
  ds_name: string;
  ds_description?: string;
}

export interface CreatePermissionResponse {
  cd_id: number;
}

export function useCreatePermission() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePermissionRequest) => {
      const result = await api.post<CreatePermissionResponse>("/permissions", {
        body: data,
        errorMessage: "Erro ao criar permissão",
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions.all() });
    },
  });
}