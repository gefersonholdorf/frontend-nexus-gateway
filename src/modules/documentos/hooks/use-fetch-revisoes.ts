import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

export type RevisaoOrigem = "MANUAL" | "AUTOMATICA";
export type RevisaoStatus = "ABERTA" | "EM_APROVACAO" | "APROVADA" | "REPROVADA";

/**
 * Revisão de um documento (RF009). `cd_revisor` é o responsável do documento
 * no momento em que a revisão foi aberta (RN014) — usado no frontend para
 * decidir se o usuário logado pode aprovar/negar (`cd_revisor === me.cd_id`).
 */
export interface DocRevisao {
  cd_id: number;
  cd_documento: number;
  st_origem: RevisaoOrigem;
  cd_aberto_por: number | null;
  cd_revisor: number;
  st_status: RevisaoStatus;
  cd_etapa_atual: number | null;
  ds_rodada_atual: number;
  ds_justificativa_reprovacao: string | null;
  dt_aberta_em: string;
  dt_concluida_em: string | null;
  dt_created_at: string;
  dt_updated_at: string;
}

/** `GET /documentos/:id/revisoes` — visibilidade do documento. */
export function useFetchRevisoes(documentoId?: number) {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.docRevisoes.list(documentoId ?? 0),
    enabled: Boolean(documentoId),
    queryFn: () =>
      api.get<DocRevisao[]>(`/documentos/${documentoId}/revisoes`, {
        errorMessage: "Erro ao consultar revisões do documento",
      }),
  });
}
