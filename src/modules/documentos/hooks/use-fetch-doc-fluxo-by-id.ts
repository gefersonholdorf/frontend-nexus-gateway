import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocFluxo } from "./use-fetch-doc-fluxos";

/** `GET /documentos/fluxos/:id`. */
export function useFetchDocFluxoById(cd_id?: number) {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.docFluxos.detail(cd_id ?? 0),
    enabled: Boolean(cd_id),
    queryFn: () =>
      api.get<DocFluxo>(`/documentos/fluxos/${cd_id}`, {
        errorMessage: "Erro ao consultar fluxo de aprovação",
      }),
  });
}
