import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { usersMock } from "../mocks/users.mock";

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — remove de `usersMock` em memória.
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cd_id: number): Promise<void> => {
            await simulateLatency();

            const index = usersMock.findIndex((item) => item.cd_id === cd_id);

            if (index === -1) {
                throw new Error("Usuário não encontrado.");
            }

            usersMock.splice(index, 1);
        },
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
