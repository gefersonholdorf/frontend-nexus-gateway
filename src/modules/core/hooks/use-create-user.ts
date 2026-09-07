import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { usersMock, type CoreUser } from "../mocks/users.mock";

export interface CreateUserInput {
    ds_name: string;
    ds_email: string;
    ds_role_description: string;
    fl_active: boolean;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — grava em `usersMock` em memória.
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateUserInput): Promise<CoreUser> => {
            await simulateLatency();

            const nextId = usersMock.reduce((max, user) => Math.max(max, user.cd_id), 0) + 1;

            const newUser: CoreUser = {
                cd_id: nextId,
                ds_name: input.ds_name,
                ds_email: input.ds_email,
                ds_role_description: input.ds_role_description,
                fl_active: input.fl_active,
                cd_roles: [],
                dt_created_at: new Date().toISOString(),
            };

            usersMock.push(newUser);

            return newUser;
        },
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
