import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/**
 * Role vinculada a um usuário, como retornada dentro de `CoreUser.roles`
 * (formato confirmado contra a API real — `GET /users`).
 */
export interface CoreUserRole {
    cd_id: number;
    ds_name: string;
    ds_description: string;
}

/**
 * Usuário administrado pelo módulo Core (RF009/RF010). Formato confirmado
 * contra a API real (`GET /users`).
 */
export interface CoreUser {
    cd_id: number;
    ds_name: string;
    ds_email: string;
    fl_active: boolean;
    roles: CoreUserRole[];
    ds_role_description: string;
    ds_vpn_name: string;
    ds_avatar_url: string;
    dt_created_at: string;
    dt_updated_at: string;
    dt_last_login: string;
    qt_roles: number;
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
