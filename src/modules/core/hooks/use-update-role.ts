import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreRole } from "./use-fetch-roles";

export interface UpdateRoleInput {
    cd_id: number;
    ds_name: string;
    ds_description: string;
}

/**
 * `PUT /roles/{id}` (RF016).
 */
export function useUpdateRole() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_id, ...input }: UpdateRoleInput) =>
            api.put<CoreRole>(`/roles/${cd_id}`, {
                body: input,
                errorMessage: "Erro ao atualizar role",
            }),
        onSuccess: (_role, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(variables.cd_id) });
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
