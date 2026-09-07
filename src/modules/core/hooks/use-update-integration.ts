import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreIntegration } from "./use-fetch-integrations";

export interface UpdateIntegrationInput {
    cd_id: number;
    ds_name: string;
    ds_description: string;
    ds_config: Record<string, string>;
}

/**
 * `PUT /integrations/{id}` (RF026). Envia apenas os campos já coletados pelo
 * formulário existente (`integration-form-fields.tsx`): nome, descrição e
 * `ds_config`. `ds_secret` nunca é editável por aqui (só mascarado/revelado na
 * UI, RN005); `fl_active`/`st_status` têm hooks próprios — ver
 * `use-toggle-integration-status.ts` e `use-test-integration-connection.ts`.
 */
export function useUpdateIntegration() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_id, ds_name, ds_description, ds_config }: UpdateIntegrationInput) =>
            api.put<CoreIntegration>(`/integrations/${cd_id}`, {
                body: { ds_name, ds_description, ds_config },
                errorMessage: "Erro ao atualizar integração",
            }),
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
