import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface UnlinkModulePermissionRequest {
  moduleId: number;
  permId: number;
}

export function useUnlinkModulePermission() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ moduleId, permId }: UnlinkModulePermissionRequest) => {
      await api.delete<void>(`/modules/${moduleId}/permissions/${permId}`, {
        errorMessage: "Erro ao remover permissão do módulo",
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