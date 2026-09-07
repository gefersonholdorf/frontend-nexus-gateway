import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { rolesMock, type CoreRole } from "../mocks/roles.mock";

export interface UnassignPermissionFromRoleInput {
    cd_role: number;
    cd_permission: number;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — desvincula uma permissão de
 * uma role, removendo de `rolesMock.cd_permissions`.
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useUnassignPermissionFromRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cd_role,
            cd_permission,
        }: UnassignPermissionFromRoleInput): Promise<CoreRole> => {
            await simulateLatency(200);

            const role = rolesMock.find((item) => item.cd_id === cd_role);

            if (!role) {
                throw new Error("Role não encontrada.");
            }

            role.cd_permissions = role.cd_permissions.filter(
                (permissionId) => permissionId !== cd_permission,
            );

            return role;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
            toast.success("Permissão desvinculada da role.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao desvincular permissão da role.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
