import { useMutation } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";

export interface TestIntegrationRequest {
  id: number;
}

export interface TestIntegrationResponse {
  ok: boolean;
  message?: string;
}

export function useTestIntegration() {
  const api = useApiClient();

  return useMutation({
    mutationFn: async ({ id }: TestIntegrationRequest) => {
      const result = await api.post<TestIntegrationResponse>(
        `/integrations/${id}/test`,
        {
          errorMessage: "Erro ao testar integração",
        },
      );

      return result;
    },
  });
}