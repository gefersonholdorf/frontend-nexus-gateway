import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { HubService, HubServiceEnvironment, HubServiceType } from "./use-fetch-hub-services";

export interface CreateHubServiceInput {
    st_type: HubServiceType;
    st_environment: HubServiceEnvironment;
    ds_title: string;
    ds_description: string;
    ds_access_url: string | null;
    ds_ip: string | null;
    ds_port: number | null;
    ds_status_url: string | null;
}

/**
 * `POST /hub-services` (RF002).
 */
export function useCreateHubService() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateHubServiceInput) =>
            api.post<HubService>("/hub-services", {
                body: input,
                errorMessage: "Erro ao cadastrar sistema/serviço",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.hubServices.all() });
            toast.success("Sistema/serviço cadastrado com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao cadastrar sistema/serviço.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
