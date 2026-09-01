import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface DeleteModuleRequest {
  id: number;
}

export function useDeleteModule() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteModuleRequest) => {
      await api.delete<void>(`/modules/${id}`, {
        errorMessage: "Erro ao remover módulo",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modules.all() });
    },
  });
}