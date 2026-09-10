import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type {
    HubService,
    HubServiceEnvironment,
    HubServiceStatusCheckHeader,
    HubServiceStatusCheckMethod,
    HubServiceType,
} from "./use-fetch-hub-services";

/**
 * Formato de **entrada** da autenticação do teste de status (união
 * discriminada por `type`) — só existe em create/update, nunca vem no GET
 * (o backend cifra o segredo e nunca o retorna em texto puro).
 */
export type StatusCheckAuthInput =
    | { type: "NONE" }
    | { type: "BEARER"; token: string }
    | { type: "API_KEY_HEADER"; headerName: string; value: string }
    | { type: "BASIC"; username: string; password: string };

export interface CreateHubServiceInput {
    st_type: HubServiceType;
    st_environment: HubServiceEnvironment;
    ds_title: string;
    ds_description: string;
    ds_access_url: string | null;
    ds_ip: string | null;
    ds_port: number | null;
    ds_status_url: string | null;
    st_status_check_method: HubServiceStatusCheckMethod;
    ds_status_check_headers: HubServiceStatusCheckHeader[] | null;
    status_check_auth: StatusCheckAuthInput;
    ds_status_check_body: string | null;
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
