import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface UnlinkModuleIntegrationRequest {
  moduleId: number;
  intId: number;
}

export function useUnlinkModuleIntegration() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ moduleId, intId }: UnlinkModuleIntegrationRequest) => {
      await api.delete<void>(`/modules/${moduleId}/integrations/${intId}`, {
        errorMessage: "Erro ao remover integração do módulo",
      });
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modules.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.modules.detail(variables.moduleId),
      });
    },
  });
}