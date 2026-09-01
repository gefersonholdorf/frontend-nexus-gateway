import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface User {
  cd_id: number;
  ds_name: string;
  ds_email: string;
  ds_role_description?: string;
  ds_vpn_name?: string;
  ds_avatar_url?: string;
  fl_active: boolean;
  dt_created_at?: string;
  dt_updated_at?: string;
  dt_last_login?: string;
}

export type FetchUsersResponse = User[];

export function useFetchUsers() {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: async () => {
      const result = await api.get<FetchUsersResponse>("/users", {
        errorMessage: "Erro ao listar usuários",
      });

      return result;
    },
  });
}