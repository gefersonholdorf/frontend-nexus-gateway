import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { rolesMock, type CoreRole } from "../mocks/roles.mock";

export interface AssignPermissionToRoleInput {
    cd_role: number;
    cd_permission: number;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — vincula uma permissão do
 * catálogo fixo (`permissions.mock.ts`) a uma role, gravando em
 * `rolesMock.cd_permissions` (RN007: role possui múltiplas permissões).
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useAssignPermissionToRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cd_role,
            cd_permission,
        }: AssignPermissionToRoleInput): Promise<CoreRole> => {
            await simulateLatency(200);

            const role = rolesMock.find((item) => item.cd_id === cd_role);

            if (!role) {
                throw new Error("Role não encontrada.");
            }

            if (!role.cd_permissions.includes(cd_permission)) {
                role.cd_permissions = [...role.cd_permissions, cd_permission];
            }

            return role;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
            toast.success("Permissão vinculada à role.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao vincular permissão à role.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
