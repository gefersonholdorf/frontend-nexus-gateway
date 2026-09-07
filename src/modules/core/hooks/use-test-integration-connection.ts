import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { integrationsMock, type CoreIntegration } from "../mocks/integrations.mock";

export interface TestIntegrationConnectionInput {
    cd_id: number;
}

/**
 * Resultado FIXO por integração (RN012) — não é aleatório. Chaveado por
 * `ds_type` (não por `cd_id`), reproduzindo exatamente a tabela da regra de
 * negócio: Jira/GLPI/OpenVPN → sucesso, Microsoft → falha.
 */
const FIXED_TEST_RESULT: Record<string, "ok" | "fail"> = {
    Jira: "ok",
    GLPI: "ok",
    Microsoft: "fail",
    OpenVPN: "ok",
};

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — simula "Testar Conexão"
 * (RF028) com latência maior que as demais mutations do Core (uma checagem de
 * conectividade real demoraria mais que um simples salvar), grava o resultado
 * fixo em `st_status` + o timestamp do teste (RN015), e mostra um toast de
 * sucesso ou erro correspondente. Ver docs/architecture/core-module-roadmap.md.
 */
export function useTestIntegrationConnection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cd_id,
        }: TestIntegrationConnectionInput): Promise<CoreIntegration> => {
            await simulateLatency(800 + Math.round(Math.random() * 400));

            const integration = integrationsMock.find((item) => item.cd_id === cd_id);

            if (!integration) {
                throw new Error("Integração não encontrada.");
            }

            integration.st_status = FIXED_TEST_RESULT[integration.ds_type] ?? "fail";
            integration.dt_last_tested_at = new Date().toISOString();

            return integration;
        },
        onSuccess: (integration) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.integrations.detail(integration.cd_id) });

            if (integration.st_status === "ok") {
                toast.success(`Conexão com ${integration.ds_name} estabelecida com sucesso.`, {
                    position: "top-center",
                    richColors: true,
                });
            } else {
                toast.error(`Falha ao conectar com ${integration.ds_name}.`, {
                    position: "top-center",
                    richColors: true,
                });
            }
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Erro ao testar conexão.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
