import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { rolesMock, type CoreRole } from "../mocks/roles.mock";

export interface UpdateRoleInput {
    cd_id: number;
    ds_name: string;
    ds_description: string;
    fl_active: boolean;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — atualiza `rolesMock` em memória.
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useUpdateRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateRoleInput): Promise<CoreRole> => {
            await simulateLatency();

            const role = rolesMock.find((item) => item.cd_id === input.cd_id);

            if (!role) {
                throw new Error("Role não encontrada.");
            }

            role.ds_name = input.ds_name;
            role.ds_description = input.ds_description;
            role.fl_active = input.fl_active;

            return role;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
            toast.success("Role atualizada com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao atualizar role.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
