import { useMutation } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";

export interface SyncIntegrationRequest {
  id: number;
}

export interface SyncIntegrationResponse {
  ok: boolean;
  message?: string;
}

export function useSyncIntegration() {
  const api = useApiClient();

  return useMutation({
    mutationFn: async ({ id }: SyncIntegrationRequest) => {
      const result = await api.post<SyncIntegrationResponse>(
        `/integrations/${id}/sync`,
        {
          errorMessage: "Erro ao sincronizar integração",
        },
      );

      return result;
    },
  });
}