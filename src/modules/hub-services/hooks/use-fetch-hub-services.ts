import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

export type HubServiceType = "SYSTEM" | "SERVICE";
export type HubServiceEnvironment = "PROD" | "HOM";

/**
 * Sistema/serviço administrado pelo Painel de Sistemas. Formato do contrato
 * de backend (`GET /hub-services`).
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
