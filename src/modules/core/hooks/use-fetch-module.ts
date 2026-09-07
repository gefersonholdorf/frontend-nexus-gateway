import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreModule } from "./use-fetch-modules";

/**
 * Detalhe de módulo (RF021), com os ids das integrações e permissões
 * vinculadas.
 *
 * O contrato exato do formato de `cd_integrations`/`cd_permissions` (lista de
 * ids vs. lista de objetos) não está confirmado no Swagger no momento desta
 * migração (Etapa 3 — Módulos); assumido como `number[]`, espelhando o
 * padrão já usado por `CoreRole.cd_permissions` (Etapa 2 — ver
 * `use-fetch-roles.ts`). Se a API retornar objetos, ajustar este tipo e os
 * pontos que o consomem (`core-module-detail-page.tsx`).
 *
 * `cd_integrations` referencia integrações do catálogo AINDA MOCKADO
 * (`useFetchIntegrations`, migração prevista para a próxima etapa) — os ids
 * reais retornados por esta rota podem não corresponder aos ids do mock de
 * integrações. É uma mistura temporária esperada entre etapas, assim como o
 * módulo `audit` real já convive com o restante do Core mockado hoje.
 */
export interface CoreModuleDetail extends CoreModule {
    cd_integrations: number[];
    cd_permissions: number[];
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
