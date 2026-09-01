import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface Module {
  cd_id: number;
  ds_key: string;
  ds_name: string;
  ds_description?: string;
  fl_active: boolean;
  dt_created_at?: string;
  dt_updated_at?: string;
}

export type FetchModulesResponse = Module[];

export function useFetchModules() {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.modules.all(),
    queryFn: async () => {
      const result = await api.get<FetchModulesResponse>("/modules", {
        errorMessage: "Erro ao listar módulos",
      });

      return result;
    },
  });
}