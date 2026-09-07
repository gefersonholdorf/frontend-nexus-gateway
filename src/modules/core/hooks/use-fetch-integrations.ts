import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/**
 * Integração externa administrada pelo Core (RF024).
 *
 * `ds_secret` é sempre a versão MASCARADA retornada pela API (RN005) — o
 * frontend nunca reconstrói, mascara ou desmascara este valor; apenas exibe o
 * que a API mandou. `st_status` reflete o resultado do último "Testar
 * Conexão" (RF027) e é uma informação independente de `fl_active` (RN006).
 */
export interface CoreIntegration {
    cd_id: number;
    ds_type: string;
    ds_name: string;
    ds_description: string;
    fl_active: boolean;
    st_status: "ok" | "fail";
    ds_config: Record<string, string>;
    ds_secret: string;
    dt_last_tested_at: string | null;
}

/**
 * `GET /integrations` (RF024). Listagem em cards, com filtros (tipo/status) e
 * KPIs (Total/Ativas/Com falha) calculados no frontend a partir da base
 * completa retornada pela API — mesma decisão já registrada para
 * usuários/roles/módulos, sem paginação server-side nesta etapa.
 *
 * Também consumido (somente leitura) por `core-module-detail-page.tsx`
 * (Etapa 3) para listar integrações vinculáveis a um módulo.
 */
export function useFetchIntegrations() {
    const api = useApiClient();

    return useQuery({
        queryKey: queryKeys.integrations.all(),
        queryFn: () =>
            api.get<CoreIntegration[]>("/integrations", {
                errorMessage: "Erro ao consultar integrações",
            }),
    });
}
