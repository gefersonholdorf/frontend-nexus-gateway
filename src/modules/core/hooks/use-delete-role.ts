import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { isApiError } from "@/lib/api/api-error";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/**
 * `DELETE /roles/{id}` (RF016).
 *
 * Cenário de Exceção 6: a API retorna 409 quando a role está vinculada a
 * usuários e não pode ser excluída. Esse caso é tratado separadamente do
 * erro genérico, com uma mensagem específica de conflito.
 */
export function useDeleteRole() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (cd_id: number) =>
            api.delete<void>(`/roles/${cd_id}`, {
                errorMessage: "Erro ao excluir role",
            }),
        onSuccess: (_data, cd_id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(cd_id) });
            toast.success("Role excluída com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: (error) => {
            if (isApiError(error) && error.status === 409) {
                toast.error(
                    "Não é possível excluir: existem usuários vinculados a este perfil.",
                    { position: "top-center", richColors: true },
                );
                return;
            }

            toast.error("Erro ao excluir role.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
