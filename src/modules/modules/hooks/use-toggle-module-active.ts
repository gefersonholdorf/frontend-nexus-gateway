import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface ToggleModuleActiveRequest {
  id: number;
  fl_active: boolean;
}

export interface ToggleModuleActiveResponse {
  cd_id: number;
  fl_active: boolean;
}

export function useToggleModuleActive() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, fl_active }: ToggleModuleActiveRequest) => {
      const result = await api.patch<ToggleModuleActiveResponse>(
        `/modules/${id}/active`,
        {
          body: { fl_active },
          errorMessage: "Erro ao ativar ou desativar módulo",
        },
      );

      return result;
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modules.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.modules.detail(variables.id),
      });
    },
  });
}