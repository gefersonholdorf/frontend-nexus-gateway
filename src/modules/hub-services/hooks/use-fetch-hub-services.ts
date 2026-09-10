import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

export type HubServiceType = "SYSTEM" | "SERVICE";
export type HubServiceEnvironment = "PROD" | "HOM";

/** Método HTTP usado na verificação de status (RF005/RF007). `null` = `GET`. */
export type HubServiceStatusCheckMethod = "GET" | "POST" | "PUT" | "PATCH" | "HEAD" | "DELETE";

/** Tipo de autenticação usado na verificação de status. `null` = `NONE`. */
export type HubServiceStatusCheckAuthType = "NONE" | "BEARER" | "API_KEY_HEADER" | "BASIC";

/** Par chave/valor de header customizado enviado na verificação de status. */
export interface HubServiceStatusCheckHeader {
    key: string;
    value: string;
}

/**
 * Sistema/serviço administrado pelo Painel de Sistemas. Formato do contrato
 * de backend (`GET /hub-services`).
 *
 * `st_status_check_auth_type` é o único dado exposto sobre a autenticação do
 * teste de status: o backend cifra e nunca retorna o segredo
 * (`ds_status_check_secret`) em texto puro — ver `status_check_auth` em
 * `CreateHubServiceInput` para o formato de entrada usado ao criar/editar.
 */
export interface HubService {
    cd_id: number;
    st_type: HubServiceType;
    st_environment: HubServiceEnvironment;
    ds_title: string;
    ds_description: string;
    ds_access_url: string | null;
    ds_ip: string | null;
    ds_port: number | null;
    ds_status_url: string | null;
    st_status_check_method: HubServiceStatusCheckMethod | null;
    ds_status_check_headers: HubServiceStatusCheckHeader[] | null;
    st_status_check_auth_type: HubServiceStatusCheckAuthType | null;
    ds_status_check_body: string | null;
    dt_created_at: string;
    dt_updated_at: string;
}

/**
 * `GET /hub-services` (RF001). Retorna a coleção completa, sem parâmetros —
 * busca, filtros, ordenação e paginação são feitos no frontend (RF008/RN011).
 */
export function useFetchHubServices() {
    const api = useApiClient();

    return useQuery({
        queryKey: queryKeys.hubServices.all(),
        queryFn: () =>
            api.get<HubService[]>("/hub-services", {
                errorMessage: "Erro ao consultar sistemas e serviços",
            }),
    });
}
