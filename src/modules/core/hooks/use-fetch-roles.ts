import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/**
 * Role (perfil de acesso) administrada pelo módulo Core (RF015).
 *
 * `cd_permissions` mantém o formato de lista de ids (`number[]`) usado no mock
 * anterior. O contrato exato do vínculo de permissões no payload de
 * `GET /roles` não está confirmado no Swagger no momento desta migração
 * (Etapa 2 — Roles e Permissões); se a API realmente retornar um array de
 * objetos (ex.: `{ cd_id, ds_key }[]`) em vez de ids, este tipo e os pontos
 * que o consomem (`role-permissions-drawer.tsx`, coluna "Permissões" de
 * `core-roles-page.tsx`, coluna "Perfis Vinculados" de `core-users-page.tsx`
 * via `user-roles-drawer.tsx`) precisam ser ajustados — confirmar contra o
 * Swagger/backend real antes de mudar o formato.
 */
export interface CoreRole {
    cd_id: number;
    ds_name: string;
    ds_description: string;
    st_status: string;
    cd_permissions: number[];
    dt_created_at: string;
    qt_permissions: number
}

/**
 * `GET /roles` (RF015). Listagem, filtros (nome/status) e KPIs
 * (Total/Ativas/Inativas) continuam calculados/filtrados no frontend a partir
 * da base completa retornada pela API — mesma decisão já registrada para
 * usuários (Etapa 1), sem paginação server-side nesta etapa.
 */
export function useFetchRoles() {
    const api = useApiClient();

    return useQuery({
        queryKey: queryKeys.roles.all(),
        queryFn: () =>
            api.get<CoreRole[]>("/roles", {
                errorMessage: "Erro ao consultar roles",
            }),
    });
}
