import { useQuery } from "@tanstack/react-query";

import {
  queryKeys,
  type AprovacoesPendentesQueryParams,
} from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { PaginatedResponse } from "./use-fetch-documentos";
import type { AprovacaoDecisao } from "./use-fetch-aprovacoes";

/**
 * Pendência de aprovação do usuário autenticado (Seção 2 do plano). Campos
 * denormalizados do documento/etapa/aprovador vêm todos flat (não aninhados
 * em objetos `documento`/`etapa`).
 */
export interface AprovacaoPendenteItem {
  cd_id: number;
  cd_revisao: number;
  cd_documento: number;
  ds_documento_codigo: string;
  ds_documento_titulo: string;
  cd_etapa: number;
  ds_etapa_nome: string;
  ds_rodada: number;
  cd_aprovador: number;
  ds_aprovador_nome: string;
  st_decisao: AprovacaoDecisao;
  dt_created_at: string;
}

/** `GET /aprovacoes/pendentes?page&pageSize` — `aprovacao.avaliar`. */
export function useFetchAprovacoesPendentes(params: AprovacoesPendentesQueryParams) {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.docAprovacoes.pendentes(params),
    queryFn: () =>
      api.get<PaginatedResponse<AprovacaoPendenteItem>>("/aprovacoes/pendentes", {
        query: { page: params.page, pageSize: params.pageSize },
        errorMessage: "Erro ao consultar aprovações pendentes",
      }),
  });
}
