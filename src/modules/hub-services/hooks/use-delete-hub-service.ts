import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/**
 * `DELETE /hub-services/{id}` (RF004).
 */
export function useDeleteHubService() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (cd_id: number) =>
            api.delete<void>(`/hub-services/${cd_id}`, {
                errorMessage: "Erro ao excluir sistema/serviço",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.hubServices.all() });
            toast.success("Sistema/serviço excluído com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao excluir sistema/serviço.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
