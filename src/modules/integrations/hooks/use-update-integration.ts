import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface UpdateIntegrationRequest {
  id: number;
  ds_name?: string;
  ds_config?: Record<string, unknown>;
  /** Write-only: enviado apenas quando preenchido; nunca retornado pela API. */
  secret?: string;
  fl_active?: boolean;
}

export interface UpdateIntegrationResponse {
  cd_id: number;
  ds_type: string;
  ds_name: string;
  ds_config?: Record<string, unknown>;
  fl_active: boolean;
}

export function useUpdateIntegration() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateIntegrationRequest) => {
      const body: Record<string, unknown> = {};

      if (data.ds_name !== undefined) {
        body.ds_name = data.ds_name;
      }

      if (data.ds_config !== undefined) {
        body.ds_config = data.ds_config;
      }

      if (data.fl_active !== undefined) {
        body.fl_active = data.fl_active;
      }

      if (data.secret && data.secret.trim() !== "") {
        body.secret = data.secret;
      }

      const result = await api.put<UpdateIntegrationResponse>(
        `/integrations/${id}`,
        {
          body,
          errorMessage: "Erro ao atualizar integração",
        },
      );

      return result;
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.integrations.detail(variables.id),
      });
    },
  });
}