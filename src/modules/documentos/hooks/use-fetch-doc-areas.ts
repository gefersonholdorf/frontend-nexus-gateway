import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

export interface DocArea {
  cd_id: number;
  ds_nome: string;
  ds_sigla: string;
  fl_ativo: boolean;
  dt_created_at: string;
  dt_updated_at: string;
}

/** `GET /documentos/areas` (RF024) — leitura livre, sem permission. */
export function useFetchDocAreas() {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.docAreas.all(),
    queryFn: () =>
      api.get<DocArea[]>("/documentos/areas", {
        errorMessage: "Erro ao consultar áreas",
      }),
  });
}
