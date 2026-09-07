import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/**
 * Usuário administrado pelo módulo Core (RF009/RF010).
 *
 * `cd_roles` mantém o formato de lista de ids (`number[]`) usado no mock
 * anterior. O contrato exato do vínculo de roles no payload de `GET /users`
 * não está confirmado no Swagger no momento desta migração (Etapa 1 — apenas
 * Usuários); se a API realmente retornar um array de objetos (ex.:
 * `{ cd_id, ds_name }[]`) em vez de ids, este tipo e os pontos que o consomem
 * (`user-roles-drawer.tsx`, coluna "Perfis Vinculados" de
 * `core-users-page.tsx`) precisam ser ajustados — confirmar contra o
 * Swagger/backend real antes de mudar o formato.
 */
export interface CoreUser {
    cd_id: number;
    ds_name: string;
    ds_email: string;
    ds_role_description: string;
    fl_active: boolean;
    cd_roles: number[];
    dt_created_at: string;
}

/**
 * `GET /users` (RF009). Listagem, filtros (nome/e-mail/status) e KPIs
 * (Total/Ativos/Inativos) continuam calculados/filtrados no frontend a partir
 * da base completa retornada pela API — decisão já registrada, sem paginação
 * server-side nesta etapa.
 */
export function useFetchUsers() {
    const api = useApiClient();

    return useQuery({
        queryKey: queryKeys.users.all(),
        queryFn: () =>
            api.get<CoreUser[]>("/users", {
                errorMessage: "Erro ao consultar usuários",
            }),
    });
}
