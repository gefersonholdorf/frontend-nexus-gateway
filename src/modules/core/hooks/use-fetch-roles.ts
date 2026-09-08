import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/**
 * Role (perfil de acesso) administrada pelo módulo Core (RF015).
 *
 * A listagem (`GET /roles`) só traz `qt_permissions` (contagem) — não inclui
 * os ids/objetos das permissões vinculadas. Para isso, use o detalhe
 * (`GET /roles/{id}`, `useFetchRoleById`/`CoreRoleDetail`), que retorna
 * `permissions` como objetos completos do catálogo (confirmado contra a API
 * real).
 */
export interface CoreRole {
    cd_id: number;
    ds_name: string;
    ds_description: string;
    st_status: string;
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
