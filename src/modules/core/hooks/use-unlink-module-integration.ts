import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

export interface UnlinkModuleIntegrationInput {
    cd_module: number;
    cd_integration: number;
}

/**
 * `DELETE /modules/{id}/integrations/{intId}` (RF023) — desvincula uma
 * integração de um módulo.
 */
export function useUnlinkModuleIntegration() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_module, cd_integration }: UnlinkModuleIntegrationInput) =>
            api.delete<void>(`/modules/${cd_module}/integrations/${cd_integration}`, {
                errorMessage: "Erro ao desconectar integração do módulo",
            }),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.detail(variables.cd_module) });
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
