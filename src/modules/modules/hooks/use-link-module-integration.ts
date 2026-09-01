import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface LinkModuleIntegrationRequest {
  moduleId: number;
  cd_integration: number;
}

export interface LinkModuleIntegrationResponse {
  cd_module: number;
  cd_integration: number;
}

export function useLinkModuleIntegration() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      moduleId,
      cd_integration,
    }: LinkModuleIntegrationRequest) => {
      const result = await api.post<LinkModuleIntegrationResponse>(
        `/modules/${moduleId}/integrations`,
        {
          body: { cd_integration },
          errorMessage: "Erro ao associar integração ao módulo",
        },
      );

      return result;
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modules.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.modules.detail(variables.moduleId),
      });
    },
  });
}