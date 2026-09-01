import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface Integration {
  cd_id: number;
  ds_type: string;
  ds_name: string;
  ds_config?: Record<string, unknown>;
  fl_active: boolean;
}

export type FetchIntegrationsResponse = Integration[];

export function useFetchIntegrations() {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.integrations.all(),
    queryFn: async () => {
      const result = await api.get<FetchIntegrationsResponse>("/integrations", {
        errorMessage: "Erro ao listar integrações",
      });

      return result;
    },
  });
}