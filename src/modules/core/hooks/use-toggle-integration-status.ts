import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { integrationsMock, type CoreIntegration } from "../mocks/integrations.mock";

export interface ToggleIntegrationStatusInput {
    cd_id: number;
    fl_active: boolean;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — liga/desliga uma integração em
 * `integrationsMock` em memória. `fl_active` é o interruptor manual do
 * administrador; é independente de `st_status`, que só reflete o resultado do
 * último "Testar Conexão" (RN015). Ver docs/architecture/core-module-roadmap.md.
 */
export function useToggleIntegrationStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cd_id,
            fl_active,
        }: ToggleIntegrationStatusInput): Promise<CoreIntegration> => {
            await simulateLatency();

            const integration = integrationsMock.find((item) => item.cd_id === cd_id);

            if (!integration) {
                throw new Error("Integração não encontrada.");
            }

            integration.fl_active = fl_active;

            return integration;
        },
        onSuccess: (integration) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.integrations.detail(integration.cd_id) });
            toast.success(
                integration.fl_active
                    ? "Integração ativada com sucesso."
                    : "Integração inativada com sucesso.",
                { position: "top-center", richColors: true },
            );
        },
        onError: (error) => {
            toast.error(
                error instanceof Error ? error.message : "Erro ao atualizar status da integração.",
                { position: "top-center", richColors: true },
            );
        },
    });
}
