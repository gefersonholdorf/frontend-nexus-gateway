import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { usersMock, type CoreUser } from "../mocks/users.mock";

export interface UpdateUserInput {
    cd_id: number;
    ds_name: string;
    ds_email: string;
    ds_role_description: string;
    fl_active: boolean;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — atualiza `usersMock` em memória.
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateUserInput): Promise<CoreUser> => {
            await simulateLatency();

            const user = usersMock.find((item) => item.cd_id === input.cd_id);

            if (!user) {
                throw new Error("Usuário não encontrado.");
            }

            user.ds_name = input.ds_name;
            user.ds_email = input.ds_email;
            user.ds_role_description = input.ds_role_description;
            user.fl_active = input.fl_active;

            return user;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
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
