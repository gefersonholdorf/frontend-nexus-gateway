import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

/**
 * Hook V2 real (`GET /audit`), server-side paginado e filtrado. Usado por
 * `src/modules/audit/pages/audit-page.tsx` e por
 * `src/modules/core/pages/core-audit-page.tsx` (RF028) — única fonte de
 * dados de auditoria do app; não existe mais um mock separado para o Core.
 */

export interface FetchAuditRequest {
  cd_user?: number;
  ds_action?: "CREATE" | "UPDATE" | "DELETE";
  ds_entity?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

/**
 * `ds_user_name`, `ds_ip` e `ds_agent` são opcionais porque cobrem a trilha
 * mais detalhada consumida por `src/modules/core/pages/core-audit-page.tsx`
 * (RF028) — o backend pode não preenchê-los em todo evento, então os
 * consumidores devem tratar a ausência (ex.: "Sistema"/"---").
 */
export interface AuditItem {
  cd_id: number;
  cd_user?: number;
  ds_user_name?: string
  ds_avatar_url: string | null
  ds_role_description: string | null
  ds_entity?: string;
  ds_action?: string;
  ds_details?: string;
  ds_ip?: string;
  ds_agent?: string;
  dt_created_at?: string;
}

export interface FetchAuditResponse {
  page: number;
  pageSize: number;
  items: AuditItem[];
}

export function useFetchAudit({
  cd_user,
  ds_action,
  ds_entity,
  from,
  to,
  page = 1,
  pageSize = 20,
}: FetchAuditRequest = {}) {
  const api = useApiClient();

  const params: FetchAuditRequest = {
    cd_user,
    ds_action,
    ds_entity,
    from,
    to,
    page,
    pageSize,
  };

  return useQuery({
    queryKey: queryKeys.audit.list(params),
    queryFn: async () => {
      const result = await api.get<FetchAuditResponse>("/audit", {
        query: {
          cd_user,
          ds_action,
          ds_entity,
          from,
          to,
          page,
          pageSize,
        },
        errorMessage: "Erro ao consultar auditoria",
      });

      return result;
    },
  });
}