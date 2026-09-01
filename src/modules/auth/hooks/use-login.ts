import { useMutation } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";

export interface LoginRequest {
  ds_email: string;
  senha: string;
}

export interface LoginUser {
  cd_id: number;
  ds_name: string;
  ds_email: string;
  ds_role_description: string | null;
  ds_avatar_url: string | null;
}

export interface LoginResponse {
  token: string;
  user: LoginUser;
}

export function useLogin() {
  const api = useApiClient();

  return useMutation({
    mutationFn: async ({ ds_email, senha }: LoginRequest) => {
      const result = await api.post<LoginResponse>("/auth/login", {
        body: { ds_email, senha },
        errorMessage: "Erro ao autenticar usuário",
      });

      return result;
    },
  });
}