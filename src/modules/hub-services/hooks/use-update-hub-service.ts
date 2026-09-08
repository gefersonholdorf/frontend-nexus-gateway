import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { HubService } from "./use-fetch-hub-services";
import type { CreateHubServiceInput } from "./use-create-hub-service";

export interface UpdateHubServiceInput extends CreateHubServiceInput {
    cd_id: number;
}

/**
 * `PUT /hub-services/{id}` (RF003).
 */
export function useUpdateHubService() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_id, ...input }: UpdateHubServiceInput) =>
            api.put<HubService>(`/hub-services/${cd_id}`, {
                body: input,
                errorMessage: "Erro ao atualizar sistema/serviço",
            }),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.hubServices.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.hubServices.detail(variables.cd_id) });
            toast.success("Sistema/serviço atualizado com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao atualizar sistema/serviço.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
