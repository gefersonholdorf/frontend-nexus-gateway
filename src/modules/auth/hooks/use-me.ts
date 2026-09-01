import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";
import { useUser } from "@/contexts/user-context";

export interface MeUser {
  cd_id: number;
  ds_name: string;
  ds_email: string;
  ds_role_description: string | null;
  ds_vpn_name: string | null;
  ds_avatar_url: string | null;
  fl_active: boolean;
}

export interface MeRole {
  cd_id: number;
  ds_name: string;
}

export interface MeResponse {
  user: MeUser;
  roles: MeRole[];
  permissions: string[];
}

export function useMe() {
  const api = useApiClient();
  const { user } = useUser();

  return useQuery({
    queryKey: queryKeys.me(),
    enabled: Boolean(user?.token),
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const result = await api.get<MeResponse>("/me", {
        errorMessage: "Erro ao carregar dados do usuário",
      });

      return result;
    },
  });
}