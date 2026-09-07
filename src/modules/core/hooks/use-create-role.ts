import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { rolesMock, type CoreRole } from "../mocks/roles.mock";

export interface CreateRoleInput {
    ds_name: string;
    ds_description: string;
    fl_active: boolean;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — grava em `rolesMock` em memória.
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useCreateRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateRoleInput): Promise<CoreRole> => {
            await simulateLatency();

            const nextId = rolesMock.reduce((max, role) => Math.max(max, role.cd_id), 0) + 1;

            const newRole: CoreRole = {
                cd_id: nextId,
                ds_name: input.ds_name,
                ds_description: input.ds_description,
                fl_active: input.fl_active,
                cd_permissions: [],
                dt_created_at: new Date().toISOString(),
            };

            rolesMock.push(newRole);

            return newRole;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
            toast.success("Role criada com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao criar role.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
