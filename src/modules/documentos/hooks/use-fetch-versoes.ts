import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

export type VersaoStatus = "EM_ELABORACAO" | "APROVADA_AUTOR" | "REPROVADA";

/**
 * Versão de uma revisão (RF011). Numeração sempre inteira (`ds_versao_major`
 * + `ds_versao_minor`) — nunca fazer aritmética de ponto flutuante no
 * frontend, só formatar `"major.minor"` para exibição.
 */
export interface DocVersao {
  cd_id: number;
  cd_revisao: number;
  cd_documento: number;
  ds_versao_major: number;
  ds_versao_minor: number;
  ds_descritivo: string;
  ds_url_edicao: string;
  ds_url_publicacao: string | null;
  st_status: VersaoStatus;
  cd_responsavel: number;
  dt_created_at: string;
  dt_updated_at: string;
}

/** `GET /documentos/:id/versoes[?revisaoId]` — visibilidade do documento. */
export function useFetchVersoes(documentoId?: number, revisaoId?: number) {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.docVersoes.list(documentoId ?? 0, revisaoId),
    enabled: Boolean(documentoId),
    queryFn: () =>
      api.get<DocVersao[]>(`/documentos/${documentoId}/versoes`, {
        query: { revisaoId },
        errorMessage: "Erro ao consultar versões do documento",
      }),
  });
}
