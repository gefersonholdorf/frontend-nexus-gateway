import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { integrationsMock, type CoreIntegration } from "../mocks/integrations.mock";

export interface UpdateIntegrationInput {
    cd_id: number;
    ds_name: string;
    ds_description: string;
    ds_config: Record<string, string>;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — atualiza nome/descrição/config
 * em `integrationsMock` em memória (RF026/RF027). `ds_secret` nunca é editável
 * por aqui (só mascarado/revelado na UI) e `fl_active`/`st_status` têm hooks
 * próprios — ver `use-toggle-integration-status.ts` e
 * `use-test-integration-connection.ts`. Ver docs/architecture/core-module-roadmap.md.
 */
export function useUpdateIntegration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateIntegrationInput): Promise<CoreIntegration> => {
            await simulateLatency();

            const integration = integrationsMock.find((item) => item.cd_id === input.cd_id);

            if (!integration) {
                throw new Error("Integração não encontrada.");
            }

            integration.ds_name = input.ds_name;
            integration.ds_description = input.ds_description;
            integration.ds_config = { ...input.ds_config };

            return integration;
        },
        onSuccess: (integration) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.integrations.detail(integration.cd_id) });
            toast.success("Integração atualizada com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao atualizar integração.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
