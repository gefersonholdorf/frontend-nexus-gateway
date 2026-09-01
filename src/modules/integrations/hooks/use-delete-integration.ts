import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface DeleteIntegrationRequest {
  id: number;
}

export function useDeleteIntegration() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteIntegrationRequest) => {
      await api.delete<void>(`/integrations/${id}`, {
        errorMessage: "Erro ao remover integração",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all() });
    },
  });
}