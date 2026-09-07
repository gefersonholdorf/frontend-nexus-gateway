import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

export interface UnassignRoleFromUserInput {
    cd_user: number;
    cd_role: number;
}

/**
 * `DELETE /users/{id}/roles/{roleId}` (RF014) — desvincula uma role de um
 * usuário.
 */
export function useUnassignRoleFromUser() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_user, cd_role }: UnassignRoleFromUserInput) =>
            api.delete<void>(`/users/${cd_user}/roles/${cd_role}`, {
                errorMessage: "Erro ao desvincular role do usuário",
            }),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.cd_user) });
            toast.success("Role desvinculada do usuário.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao desvincular role do usuário.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
