import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CorePermission } from "./use-fetch-permissions";

/**
 * Detalhe de role (`GET /roles/{id}`, RF015) — formato confirmado contra a
 * API real: diferente da listagem (`CoreRole`, que só traz `qt_permissions`),
 * o detalhe traz `permissions` como objetos completos do catálogo, não uma
 * lista de ids.
 */
export interface CoreRoleDetail {
    cd_id: number;
    ds_name: string;
    ds_description: string;
    st_status: string;
    permissions: CorePermission[];
    dt_created_at: string;
    dt_updated_at?: string;
}

/**
 * `GET /roles/{id}` (RF015) — detalhe da role com permissões vinculadas.
 *
 * Usado por `role-permissions-drawer.tsx`. Diferente do padrão adotado para
 * usuários na Etapa 1 (onde o drawer de roles do usuário se contenta com o
 * objeto recebido via prop), aqui o refetch pontual é necessário: o drawer de
 * permissões recebe a `role` como snapshot da lista (`useFetchRoles`) através
 * de props, e assign/unassign de permissão (RF018) precisa refletir de volta
 * nos checkboxes com o drawer ainda aberto. Sem este hook, a prop `role`
 * ficaria presa ao snapshot anterior até o drawer fechar e reabrir, mesmo com
 * `roles.all()` invalidado. `enabled` evita a chamada quando não há id (drawer
 * fechado).
 */
export function useFetchRoleById(cd_id: number | undefined) {
    const api = useApiClient();

    return useQuery({
        queryKey: queryKeys.roles.detail(cd_id ?? 0),
        queryFn: () =>
            api.get<CoreRoleDetail>(`/roles/${cd_id}`, {
                errorMessage: "Erro ao consultar role",
            }),
        enabled: !!cd_id,
    });
}
