import { useMutation } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";

export interface ChangePasswordRequest {
  id: number;
  senha: string;
}

export interface ChangePasswordResponse {
  cd_id: number;
}

export function useChangePassword() {
  const api = useApiClient();

  return useMutation({
    mutationFn: async ({ id, senha }: ChangePasswordRequest) => {
      const result = await api.patch<ChangePasswordResponse>(
        `/users/${id}/password`,
        {
          body: { senha },
          errorMessage: "Erro ao alterar senha do usuário",
        },
      );

      return result;
    },
  });
}