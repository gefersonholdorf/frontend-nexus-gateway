import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface FetchAuditRequest {
  cd_user?: number;
  ds_action?: "CREATE" | "UPDATE" | "DELETE";
  ds_entity?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface AuditItem {
  cd_id: number;
  cd_user?: number;
  ds_entity?: string;
  ds_action?: string;
  ds_details?: string;
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