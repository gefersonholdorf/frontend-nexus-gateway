import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreRole } from "./use-fetch-roles";

export interface AssignPermissionToRoleInput {
    cd_role: number;
    cd_permission: number;
}

/**
 * `POST /roles/{id}/permissions` (RF018) — vincula uma permissão do catálogo
 * fixo (`GET /permissions`) a uma role.
 */
export function useAssignPermissionToRole() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_role, cd_permission }: AssignPermissionToRoleInput) =>
            api.post<CoreRole>(`/roles/${cd_role}/permissions`, {
                body: { cd_permission },
                errorMessage: "Erro ao vincular permissão à role",
            }),
        onSuccess: (_role, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(variables.cd_role) });
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
