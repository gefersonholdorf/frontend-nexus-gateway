import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { rolesMock, type CoreRole } from "../mocks/roles.mock";

export interface ToggleRoleStatusInput {
    cd_id: number;
    fl_active: boolean;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — ativa/inativa uma role em
 * `rolesMock` em memória.
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useToggleRoleStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cd_id, fl_active }: ToggleRoleStatusInput): Promise<CoreRole> => {
            await simulateLatency();

            const role = rolesMock.find((item) => item.cd_id === cd_id);

            if (!role) {
                throw new Error("Role não encontrada.");
            }

            role.fl_active = fl_active;

            return role;
        },
        onSuccess: (role) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
            toast.success(
                role.fl_active ? "Role ativada com sucesso." : "Role inativada com sucesso.",
                { position: "top-center", richColors: true },
            );
        },
        onError: () => {
            toast.error("Erro ao atualizar status da role.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
