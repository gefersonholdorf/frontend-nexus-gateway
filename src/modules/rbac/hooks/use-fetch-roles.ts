import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface Role {
  cd_id: number;
  ds_name: string;
  ds_description?: string;
  st_status: string;
  dt_created_at?: string;
  dt_updated_at?: string;
}

export type FetchRolesResponse = Role[];

export function useFetchRoles() {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.roles.all(),
    queryFn: async () => {
      const result = await api.get<FetchRolesResponse>("/roles", {
        errorMessage: "Erro ao listar roles",
      });

      return result;
    },
  });
}