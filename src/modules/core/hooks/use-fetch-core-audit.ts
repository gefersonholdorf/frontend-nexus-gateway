import { useQuery } from "@tanstack/react-query";

import { queryKeys, type CoreAuditQueryParams } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { auditMock, type CoreAuditItem } from "../mocks/audit.mock";

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — lê `auditMock` em memória.
 *
 * Não confundir com `src/modules/audit/hooks/use-fetch-audit.ts` (hook V2 real,
 * `GET /audit`) — são fontes de dados independentes. Ver
 * docs/architecture/core-module-roadmap.md.
 *
 * Filtros são aplicados client-side sobre os dados estáticos (RN013: nenhuma
 * ação gera novo registro automaticamente).
 */
export function useFetchCoreAudit(params: CoreAuditQueryParams = {}) {
    const { ds_user, ds_action, ds_module, from, to } = params;

    return useQuery({
        queryKey: queryKeys.coreAudit.list(params),
        queryFn: async (): Promise<CoreAuditItem[]> => {
            await simulateLatency();

            return auditMock.filter((item) => {
                if (ds_user && !item.ds_user.toLowerCase().includes(ds_user.toLowerCase())) {
                    return false;
                }

                if (ds_action && item.ds_action !== ds_action) {
                    return false;
                }

                if (ds_module && !item.ds_module.toLowerCase().includes(ds_module.toLowerCase())) {
                    return false;
                }

                // Comparação por data (YYYY-MM-DD) — os inputs "de"/"até" são
                // datas puras, enquanto dt_created_at é um timestamp ISO completo;
                // comparar o timestamp inteiro excluiria incorretamente os
                // eventos do próprio dia "até".
                const eventDate = item.dt_created_at.slice(0, 10);

                if (from && eventDate < from) {
                    return false;
                }

                if (to && eventDate > to) {
                    return false;
                }

                return true;
            });
        },
    });
}
