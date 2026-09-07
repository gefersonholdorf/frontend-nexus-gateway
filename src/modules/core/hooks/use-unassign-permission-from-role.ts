import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

export interface UnassignPermissionFromRoleInput {
    cd_role: number;
    cd_permission: number;
}

/**
 * `DELETE /roles/{id}/permissions/{permId}` (RF018) — desvincula uma
 * permissão de uma role.
 */
export function useUnassignPermissionFromRole() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_role, cd_permission }: UnassignPermissionFromRoleInput) =>
            api.delete<void>(`/roles/${cd_role}/permissions/${cd_permission}`, {
                errorMessage: "Erro ao desvincular permissão da role",
            }),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(variables.cd_role) });
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
