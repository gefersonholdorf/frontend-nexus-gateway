import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreModuleDetail } from "./use-fetch-module";

export interface LinkModuleIntegrationInput {
    cd_module: number;
    cd_integration: number;
}

/**
 * `POST /modules/{id}/integrations` (RF023) — vincula uma integração do
 * catálogo (ainda mockado, `useFetchIntegrations`) a um módulo.
 */
export function useLinkModuleIntegration() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_module, cd_integration }: LinkModuleIntegrationInput) =>
            api.post<CoreModuleDetail>(`/modules/${cd_module}/integrations`, {
                body: { cd_integration },
                errorMessage: "Erro ao conectar integração ao módulo",
            }),
        onSuccess: (_module, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.detail(variables.cd_module) });
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
