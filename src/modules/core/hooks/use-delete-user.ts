import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/**
 * `DELETE /users/{id}` (RF011).
 */
export function useDeleteUser() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (cd_id: number) =>
            api.delete<void>(`/users/${cd_id}`, {
                errorMessage: "Erro ao excluir usuário",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
            toast.success("Usuário excluído com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao excluir usuário.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
