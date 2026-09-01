import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface LinkModulePermissionRequest {
  moduleId: number;
  cd_permission: number;
}

export interface LinkModulePermissionResponse {
  cd_module: number;
  cd_permission: number;
}

export function useLinkModulePermission() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      moduleId,
      cd_permission,
    }: LinkModulePermissionRequest) => {
      const result = await api.post<LinkModulePermissionResponse>(
        `/modules/${moduleId}/permissions`,
        {
          body: { cd_permission },
          errorMessage: "Erro ao associar permissão ao módulo",
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