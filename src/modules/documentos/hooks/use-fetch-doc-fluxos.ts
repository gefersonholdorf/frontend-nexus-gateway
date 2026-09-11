import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/**
 * Aprovador de uma etapa do fluxo. `aprovadores` só é `cd_user[]` (ids) no
 * body de entrada de POST/PUT; na leitura (listagem e detalhe) o backend
 * devolve o objeto `{cd_id, ds_name}`, permitindo exibir o nome sem uma
 * segunda chamada.
 */
export interface DocFluxoEtapaAprovador {
  cd_id: number;
  ds_name: string;
}

export interface DocFluxoEtapa {
  cd_id: number;
  ds_nome: string;
  ds_ordem: number;
  aprovadores: DocFluxoEtapaAprovador[];
}

export interface DocFluxo {
  cd_id: number;
  ds_nome: string;
  ds_descricao: string | null;
  fl_ativo: boolean;
  etapas: DocFluxoEtapa[];
  dt_created_at: string;
  dt_updated_at: string;
}

/** `GET /documentos/fluxos` (RF024) — leitura livre, sem permission. */
export function useFetchDocFluxos() {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.docFluxos.all(),
    queryFn: () =>
      api.get<DocFluxo[]>("/documentos/fluxos", {
        errorMessage: "Erro ao consultar fluxos de aprovação",
      }),
  });
}
