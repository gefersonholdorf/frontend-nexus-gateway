import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { usersMock, type CoreUser } from "../mocks/users.mock";

export interface AssignRoleToUserInput {
    cd_user: number;
    cd_role: number;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — vincula uma role (`roles.mock.ts`)
 * a um usuário, gravando em `usersMock.cd_roles` (RN006: usuário possui múltiplas
 * roles). Ver docs/architecture/core-module-roadmap.md.
 */
export function useAssignRoleToUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cd_user, cd_role }: AssignRoleToUserInput): Promise<CoreUser> => {
            await simulateLatency(200);

            const user = usersMock.find((item) => item.cd_id === cd_user);

            if (!user) {
                throw new Error("Usuário não encontrado.");
            }

            if (!user.cd_roles.includes(cd_role)) {
                user.cd_roles = [...user.cd_roles, cd_role];
            }

            return user;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
            toast.success("Role vinculada ao usuário.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao vincular role ao usuário.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
