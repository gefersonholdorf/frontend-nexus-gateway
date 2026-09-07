import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { usersMock, type CoreUser } from "../mocks/users.mock";

export interface ToggleUserStatusInput {
    cd_id: number;
    fl_active: boolean;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — ativa/inativa um usuário em
 * `usersMock` em memória (RN004: status é binário, Ativo/Inativo).
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useToggleUserStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cd_id, fl_active }: ToggleUserStatusInput): Promise<CoreUser> => {
            await simulateLatency();

            const user = usersMock.find((item) => item.cd_id === cd_id);

            if (!user) {
                throw new Error("Usuário não encontrado.");
            }

            user.fl_active = fl_active;

            return user;
        },
        onSuccess: (user) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
            toast.success(
                user.fl_active ? "Usuário ativado com sucesso." : "Usuário inativado com sucesso.",
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
