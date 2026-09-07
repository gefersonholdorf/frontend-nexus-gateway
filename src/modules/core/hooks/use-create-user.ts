import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreUser } from "./use-fetch-users";

export interface CreateUserInput {
    ds_name: string;
    ds_email: string;
    ds_role_description: string;
    fl_active: boolean;
}

/**
 * `POST /users` (RF011).
 */
export function useCreateUser() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateUserInput) =>
            api.post<CoreUser>("/users", {
                body: input,
                errorMessage: "Erro ao criar usuário",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
            toast.success("Usuário criado com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao criar usuário.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
