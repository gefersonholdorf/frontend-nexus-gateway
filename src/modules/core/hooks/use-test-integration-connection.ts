import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreIntegration } from "./use-fetch-integrations";

export interface TestIntegrationConnectionInput {
    cd_id: number;
}

/**
 * Resposta de `POST /integrations/{id}/test` (RF027). `ok: false` é uma
 * resposta de negócio válida (Cenário de Exceção 5), não um erro HTTP — a
 * `mutationFn` resolve normalmente em ambos os casos.
 */
export interface TestIntegrationConnectionResult {
    ok: boolean;
    message?: string;
}

/**
 * `POST /integrations/{id}/test` (RF027): "atualizando st_status na UI após
 * a resposta" — a UI é quem decide o `st_status` exibido a partir de `ok`,
 * não um refetch de `GET /integrations`. Escrevemos o resultado diretamente
 * no cache (`setQueryData`) em vez de `invalidateQueries`: se o endpoint de
 * teste não persistir o status no backend (comum em endpoints de "ping"),
 * invalidar/refazer o fetch traria de volta o `st_status` antigo e a tela
 * voltaria a mostrar "Falha na conexão" mesmo após um teste `ok: true`.
 *
 * Cenário de Exceção 5 — se `ok` vier `false`, a mutation ainda é tratada
 * como sucesso (não lança erro): atualiza `st_status` para "fail" e exibe a
 * `message` retornada num toast de erro.
 */
export function useTestIntegrationConnection() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_id }: TestIntegrationConnectionInput) =>
            api.post<TestIntegrationConnectionResult>(
                `/integrations/${cd_id}/test`
            ),
        onSuccess: (result, variables) => {
            queryClient.setQueryData<CoreIntegration[]>(queryKeys.integrations.all(), (integrations) =>
                integrations?.map((integration) =>
                    integration.cd_id === variables.cd_id
                        ? {
                            ...integration,
                            st_status: result.ok ? "ok" : "fail",
                            dt_last_tested_at: new Date().toISOString(),
                        }
                        : integration,
                ),
            );

            if (result.ok) {
                toast.success(result.message ?? "Conexão estabelecida com sucesso.", {
                    position: "top-center",
                    richColors: true,
                });
            } else {
                toast.error(result.message ?? "Falha ao testar conexão.", {
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
