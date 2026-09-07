import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/**
 * Módulo do catálogo administrado pelo Core (RF020).
 *
 * `qt_integrations` é a contagem de integrações vinculadas, calculada pela
 * API (não mais derivada no cliente a partir de uma lista de ids, como no
 * mock anterior — `CoreModule` em `mocks/modules.mock.ts` tinha
 * `cd_integrations: number[]`). O detalhe (`GET /modules/{id}`, RF021)
 * retorna os ids das integrações e permissões vinculadas — ver
 * `CoreModuleDetail` em `use-fetch-module.ts`.
 */
export interface CoreModule {
    cd_id: number;
    ds_key: string;
    ds_name: string;
    ds_description: string;
    fl_active: boolean;
    qt_integrations: number;
    dt_created_at: string;
}

/**
 * `GET /modules` (RF020). Listagem em cards, com filtros (nome/status) e
 * KPIs (Total/Ativos/Inativos) calculados no frontend a partir da base
 * completa retornada pela API — mesma decisão já registrada para
 * usuários/roles, sem paginação server-side nesta etapa.
 */
export function useFetchModules() {
    const api = useApiClient();

    return useQuery({
        queryKey: queryKeys.modules.all(),
        queryFn: () =>
            api.get<CoreModule[]>("/modules", {
                errorMessage: "Erro ao consultar módulos",
            }),
    });
}
