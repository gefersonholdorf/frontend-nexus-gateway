import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

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
 * `POST /integrations/{id}/test` (RF027). O backend é responsável por
 * persistir o novo `st_status`/`dt_last_tested_at` da integração testada; o
 * frontend não deriva esse valor localmente — após a resposta, invalida
 * `integrations.all()`/`.detail(id)` para que a UI reflita o `st_status`
 * atualizado (RN006) vindo do `GET /integrations` seguinte.
 *
 * Cenário de Exceção 5 — se `ok` vier `false`, a mutation ainda é tratada como
 * sucesso (não lança erro): exibe a `message` retornada num toast de erro e
 * deixa a atualização de `st_status` a cargo do refetch disparado pela
 * invalidação.
 */
export function useTestIntegrationConnection() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_id }: TestIntegrationConnectionInput) =>
            api.post<TestIntegrationConnectionResult>(`/integrations/${cd_id}/test`, {
                errorMessage: "Erro ao testar conexão",
            }),
        onSuccess: (result, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.integrations.detail(variables.cd_id) });

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
