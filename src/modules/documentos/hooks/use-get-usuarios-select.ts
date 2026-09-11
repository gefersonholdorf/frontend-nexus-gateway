import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/**
 * Usuário disponível para ser responsável de um documento. Endpoint próprio
 * do módulo (`GET /documentos/usuarios`, gated só por `app.authenticate`).
 */
export interface DocUsuarioOption {
  cd_id: number;
  ds_name: string;
  ds_email: string;
}

export function useGetUsuariosSelect() {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.docUsuarios.all(),
    queryFn: () =>
      api.get<DocUsuarioOption[]>("/documentos/usuarios", {
        errorMessage: "Erro ao consultar usuários disponíveis",
      }),
  });
}
