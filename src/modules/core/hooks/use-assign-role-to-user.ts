import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreUser } from "./use-fetch-users";

export interface AssignRoleToUserInput {
    cd_user: number;
    cd_role: number;
}

/**
 * `POST /users/{id}/roles` (RF014) — vincula uma role a um usuário.
 */
export function useAssignRoleToUser() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_user, cd_role }: AssignRoleToUserInput) =>
            api.post<CoreUser>(`/users/${cd_user}/roles`, {
                body: { cd_role },
                errorMessage: "Erro ao vincular role ao usuário",
            }),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.cd_user) });
            toast.success("Role vinculada ao usuário.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao vincular role ao usuário.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
