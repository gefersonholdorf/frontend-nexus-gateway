import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/**
 * Role (perfil) disponível para associar a um documento. Endpoint próprio do
 * módulo (`GET /documentos/roles`, gated só por `app.authenticate`) porque
 * `GET /roles` exige uma permission administrativa que um usuário comum com
 * `documento.criar` não necessariamente tem.
 */
export interface DocRoleOption {
  cd_id: number;
  ds_name: string;
}

/**
 * Lista pequena e completa (sem busca assíncrona) — segue o padrão de select
 * de referência já usado no repositório (`select-profiles.tsx`): hook que
 * busca tudo de uma vez + `Select` simples.
 */
export function useGetRolesSelect() {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.docRoles.all(),
    queryFn: () =>
      api.get<DocRoleOption[]>("/documentos/roles", {
        errorMessage: "Erro ao consultar roles disponíveis",
      }),
  });
}
