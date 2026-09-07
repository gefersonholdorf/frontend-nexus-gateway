import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreUser } from "./use-fetch-users";

export interface ToggleUserStatusInput {
    cd_id: number;
    fl_active: boolean;
}

/**
 * `PATCH /users/{id}/active` (RF012). Status é binário (Ativo/Inativo).
 */
export function useToggleUserStatus() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_id, fl_active }: ToggleUserStatusInput) =>
            api.patch<CoreUser>(`/users/${cd_id}/active`, {
                body: { fl_active },
                errorMessage: "Erro ao atualizar status do usuário",
            }),
        onSuccess: (user, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.cd_id) });
            toast.success(
                (user?.fl_active ?? variables.fl_active)
                    ? "Usuário ativado com sucesso."
                    : "Usuário inativado com sucesso.",
                { position: "top-center", richColors: true },
            );
        },
        onError: () => {
            toast.error("Erro ao atualizar status do usuário.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
