import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

export interface DocCategoria {
  cd_id: number;
  ds_nome: string;
  ds_sigla: string;
  fl_ativo: boolean;
  dt_created_at: string;
  dt_updated_at: string;
}

/** `GET /documentos/categorias` (RF024) — leitura livre, sem permission. */
export function useFetchDocCategorias() {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.docCategorias.all(),
    queryFn: () =>
      api.get<DocCategoria[]>("/documentos/categorias", {
        errorMessage: "Erro ao consultar categorias",
      }),
  });
}
