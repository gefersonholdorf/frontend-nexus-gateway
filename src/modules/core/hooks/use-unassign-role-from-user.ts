import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { usersMock, type CoreUser } from "../mocks/users.mock";

export interface UnassignRoleFromUserInput {
    cd_user: number;
    cd_role: number;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — desvincula uma role de um
 * usuário, removendo de `usersMock.cd_roles`.
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useUnassignRoleFromUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cd_user, cd_role }: UnassignRoleFromUserInput): Promise<CoreUser> => {
            await simulateLatency(200);

            const user = usersMock.find((item) => item.cd_id === cd_user);

            if (!user) {
                throw new Error("Usuário não encontrado.");
            }

            user.cd_roles = user.cd_roles.filter((roleId) => roleId !== cd_role);

            return user;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
            toast.success("Role desvinculada do usuário.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao desvincular role do usuário.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
