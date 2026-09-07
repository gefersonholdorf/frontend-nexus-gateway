import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreUser } from "./use-fetch-users";

export interface UpdateUserInput {
    cd_id: number;
    ds_name: string;
    ds_email: string;
    ds_role_description: string;
    fl_active: boolean;
}

/**
 * `PUT /users/{id}` (RF011).
 */
export function useUpdateUser() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_id, ...input }: UpdateUserInput) =>
            api.put<CoreUser>(`/users/${cd_id}`, {
                body: input,
                errorMessage: "Erro ao atualizar usuário",
            }),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.cd_id) });
            toast.success("Usuário atualizado com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao atualizar usuário.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
