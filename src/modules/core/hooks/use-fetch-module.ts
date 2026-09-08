import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreModule } from "./use-fetch-modules";

/**
 * Integração vinculada a um módulo, no formato resumido embutido pelo
 * `GET /modules/{id}` (subconjunto de `CoreIntegration` — sem `st_status`,
 * `ds_config` etc.). Para exibir status de conexão, cruzar por `cd_id` com o
 * catálogo completo de `useFetchIntegrations`.
 */
export interface CoreModuleIntegrationSummary {
    cd_id: number;
    ds_type: string;
    ds_name: string;
    fl_active: boolean;
}

/**
 * Detalhe de módulo (RF021), com as integrações e permissões vinculadas.
 *
 * Confirmado no contrato real: a API retorna os objetos embutidos em
 * `integrations`/`permissions`, não listas de ids (`cd_integrations`/
 * `cd_permissions`, como assumido anteriormente por analogia a
 * `CoreRole.cd_permissions`).
 */
export interface CoreModuleDetail extends CoreModule {
    integrations?: CoreModuleIntegrationSummary[];
    permissions: unknown[];
}

/**
 * `GET /modules/{id}` (RF021), usado pela página de detalhe
 * (`/core/modules/:id`).
 */
export function useFetchModule(id?: number) {
    const api = useApiClient();

    return useQuery({
        queryKey: queryKeys.modules.detail(id ?? 0),
        queryFn: () =>
            api.get<CoreModuleDetail>(`/modules/${id}`, {
                errorMessage: "Erro ao consultar módulo",
            }),
        enabled: typeof id === "number" && Number.isFinite(id),
    });
}
