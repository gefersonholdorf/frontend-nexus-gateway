import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface CreateIntegrationRequest {
  ds_type: string;
  ds_name: string;
  ds_config?: Record<string, unknown>;
  /** Write-only: enviado apenas quando preenchido; nunca retornado pela API. */
  secret?: string;
}

export interface CreateIntegrationResponse {
  cd_id: number;
  ds_type: string;
  ds_name: string;
  ds_config?: Record<string, unknown>;
  fl_active: boolean;
}

export function useCreateIntegration() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIntegrationRequest) => {
      const body: Record<string, unknown> = {
        ds_type: data.ds_type,
        ds_name: data.ds_name,
      };

      if (data.ds_config !== undefined) {
        body.ds_config = data.ds_config;
      }

      if (data.secret && data.secret.trim() !== "") {
        body.secret = data.secret;
      }

      const result = await api.post<CreateIntegrationResponse>(
        "/integrations",
        {
          body,
          errorMessage: "Erro ao criar integração",
        },
      );

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all() });
    },
  });
}