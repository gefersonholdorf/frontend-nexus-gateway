import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface Permission {
  cd_id: number;
  ds_key: string;
  ds_name: string;
  ds_description?: string;
}

export type FetchPermissionsResponse = Permission[];

export function useFetchPermissions() {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.permissions.all(),
    queryFn: async () => {
      const result = await api.get<FetchPermissionsResponse>("/permissions", {
        errorMessage: "Erro ao listar permissões",
      });

      return result;
    },
  });
}