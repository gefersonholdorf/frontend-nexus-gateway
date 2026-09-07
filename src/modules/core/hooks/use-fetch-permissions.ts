import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/**
 * Permissão do catálogo fixo do sistema (RF019).
 *
 * Somente leitura — nunca sofre CRUD (nem aqui, nem na tela
 * `/core/permissions`), inclusive após a migração para API real.
 */
export interface CorePermission {
    cd_id: number;
    ds_key: string;
    ds_name: string;
    ds_description: string;
}

/**
 * `GET /permissions` (RF019). Catálogo fixo, somente leitura — consumido pela
 * tela de Roles (atribuição, RF018) e pela tela `/core/permissions`
 * (listagem).
 */
export function useFetchPermissions() {
    const api = useApiClient();

    return useQuery({
        queryKey: queryKeys.permissions.all(),
        queryFn: () =>
            api.get<CorePermission[]>("/permissions", {
                errorMessage: "Erro ao consultar permissões",
            }),
    });
}
