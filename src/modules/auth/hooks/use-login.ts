import { useMutation } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";

export interface LoginRequest {
  ds_email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
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