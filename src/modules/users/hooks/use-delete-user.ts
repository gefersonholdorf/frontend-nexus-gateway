import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface DeleteUserRequest {
  id: number;
}

export function useDeleteUser() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteUserRequest) => {
      await api.delete<void>(`/users/${id}`, {
        errorMessage: "Erro ao remover usuário",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
    },
  });
}