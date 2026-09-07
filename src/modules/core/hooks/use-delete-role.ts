import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { rolesMock } from "../mocks/roles.mock";

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — remove de `rolesMock` em memória.
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useDeleteRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cd_id: number): Promise<void> => {
            await simulateLatency();

            const index = rolesMock.findIndex((item) => item.cd_id === cd_id);

            if (index === -1) {
                throw new Error("Role não encontrada.");
            }

            rolesMock.splice(index, 1);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
            toast.success("Role excluída com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao excluir role.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
