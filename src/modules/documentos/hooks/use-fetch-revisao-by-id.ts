import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocRevisao } from "./use-fetch-revisoes";

/** `GET /documentos/:id/revisoes/:revisaoId` — visibilidade do documento. */
export function useFetchRevisaoById(documentoId?: number, revisaoId?: number) {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.docRevisoes.detail(documentoId ?? 0, revisaoId ?? 0),
    enabled: Boolean(documentoId) && Boolean(revisaoId),
    queryFn: () =>
      api.get<DocRevisao>(`/documentos/${documentoId}/revisoes/${revisaoId}`, {
        errorMessage: "Erro ao consultar revisão",
      }),
  });
}
