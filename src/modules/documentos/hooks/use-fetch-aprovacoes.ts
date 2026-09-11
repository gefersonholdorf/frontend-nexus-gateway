import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

export type AprovacaoDecisao = "PENDENTE" | "APROVADO" | "REPROVADO" | "AJUSTE_SOLICITADO" | "CANCELADO";

/**
 * Decisão de um aprovador numa etapa/rodada do fluxo (`doc_aprovacoes`).
 * `cd_aprovador` é usado no frontend para decidir se o usuário logado pode
 * decidir aquela linha (`cd_aprovador === me.cd_id`). `ds_etapa_nome` e
 * `ds_aprovador_nome` vêm flat (não aninhados em objetos `etapa`/`aprovador`).
 */
export interface DocAprovacao {
  cd_id: number;
  cd_revisao: number;
  cd_etapa: number;
  ds_etapa_nome: string;
  ds_rodada: number;
  cd_aprovador: number;
  ds_aprovador_nome: string;
  st_decisao: AprovacaoDecisao;
  fl_automatica: boolean;
  ds_justificativa: string | null;
  dt_decidido_em: string | null;
  dt_created_at: string;
}

/**
 * `GET /documentos/:id/revisoes/:revisaoId/aprovacoes?rodada` — visibilidade
 * do documento.
 */
export function useFetchAprovacoes(documentoId?: number, revisaoId?: number, rodada?: number) {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.docAprovacoes.list(documentoId ?? 0, revisaoId ?? 0, rodada),
    enabled: Boolean(documentoId) && Boolean(revisaoId),
    queryFn: () =>
      api.get<DocAprovacao[]>(
        `/documentos/${documentoId}/revisoes/${revisaoId}/aprovacoes`,
        { query: { rodada }, errorMessage: "Erro ao consultar aprovações da revisão" },
      ),
  });
}
