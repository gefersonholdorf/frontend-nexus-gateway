import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { modulesMock, type CoreModule } from "../mocks/modules.mock";

export interface UnlinkModuleIntegrationInput {
    cd_module: number;
    cd_integration: number;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — desvincula uma integração de
 * um módulo, removendo o id de `modulesMock.cd_integrations` (RF023).
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useUnlinkModuleIntegration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cd_module,
            cd_integration,
        }: UnlinkModuleIntegrationInput): Promise<CoreModule> => {
            await simulateLatency(200);

            const module = modulesMock.find((item) => item.cd_id === cd_module);

            if (!module) {
                throw new Error("Módulo não encontrado.");
            }

            module.cd_integrations = module.cd_integrations.filter(
                (id) => id !== cd_integration,
            );

            return module;
        },
        onSuccess: (module) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.detail(module.cd_id) });
            toast.success("Integração desconectada do módulo.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao desconectar integração do módulo.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
