import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/** Linha singleton (RN023) — período de revisão automática, em dias. */
export interface DocConfiguracoes {
  cd_id: number;
  ds_periodo_revisao_dias: number;
  dt_created_at: string;
  dt_updated_at: string;
}

/** `GET /documentos/configuracoes` — `configuracoes.gerenciar`. */
export function useFetchDocConfiguracoes() {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.docConfiguracoes.all(),
    queryFn: () =>
      api.get<DocConfiguracoes>("/documentos/configuracoes", {
        errorMessage: "Erro ao consultar configurações do módulo",
      }),
  });
}
