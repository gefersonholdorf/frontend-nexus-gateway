import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface CreateModuleRequest {
  ds_key: string;
  ds_name: string;
  ds_description?: string;
}

export interface CreateModuleResponse {
  cd_id: number;
}

export function useCreateModule() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateModuleRequest) => {
      const result = await api.post<CreateModuleResponse>("/modules", {
        body: data,
        errorMessage: "Erro ao criar módulo",
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modules.all() });
    },
  });
}