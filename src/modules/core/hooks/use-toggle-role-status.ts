import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreRole } from "./use-fetch-roles";

export interface ToggleRoleStatusInput {
    cd_id: number;
    fl_active: boolean;
}

/**
 * `PATCH /roles/{id}/status` (RF017). Status é binário (Ativo/Inativo).
 */
export function useToggleRoleStatus() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_id, fl_active }: ToggleRoleStatusInput) =>
            api.patch<CoreRole>(`/roles/${cd_id}/status`, {
                body: { fl_active },
                errorMessage: "Erro ao atualizar status da role",
            }),
        onSuccess: (role, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(variables.cd_id) });
            toast.success(
                (role?.fl_active ?? variables.fl_active)
                    ? "Role ativada com sucesso."
                    : "Role inativada com sucesso.",
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
