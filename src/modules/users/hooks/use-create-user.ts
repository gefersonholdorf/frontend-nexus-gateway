import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface CreateUserRequest {
  ds_name: string;
  ds_email: string;
  senha: string;
  ds_role_description?: string;
  ds_vpn_name?: string;
  ds_avatar_url?: string;
}

export interface CreateUserResponse {
  cd_id: number;
}

export function useCreateUser() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const result = await api.post<CreateUserResponse>("/users", {
        body: data,
        errorMessage: "Erro ao criar usuário",
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
    },
  });
}