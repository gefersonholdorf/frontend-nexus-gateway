import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { modulesMock, type CoreModule } from "../mocks/modules.mock";

export interface LinkModuleIntegrationInput {
    cd_module: number;
    cd_integration: number;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — vincula uma integração do
 * mock (`integrations.mock.ts`) a um módulo, gravando em
 * `modulesMock.cd_integrations` (RN009: módulo possui múltiplas integrações).
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useLinkModuleIntegration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cd_module,
            cd_integration,
        }: LinkModuleIntegrationInput): Promise<CoreModule> => {
            await simulateLatency(200);

            const module = modulesMock.find((item) => item.cd_id === cd_module);

            if (!module) {
                throw new Error("Módulo não encontrado.");
            }

            if (!module.cd_integrations.includes(cd_integration)) {
                module.cd_integrations = [...module.cd_integrations, cd_integration];
            }

            return module;
        },
        onSuccess: (module) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.detail(module.cd_id) });
            toast.success("Integração conectada ao módulo.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao conectar integração ao módulo.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
