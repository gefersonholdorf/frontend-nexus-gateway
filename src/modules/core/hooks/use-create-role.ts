import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreRole } from "./use-fetch-roles";

export interface CreateRoleInput {
    ds_name: string;
    ds_description: string;
}

/**
 * `POST /roles` (RF016).
 */
export function useCreateRole() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateRoleInput) =>
            api.post<CoreRole>("/roles", {
                body: input,
                errorMessage: "Erro ao criar role",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() });
            toast.success("Role criada com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao criar role.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
