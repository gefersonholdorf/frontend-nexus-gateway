import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type {
  DocumentoListItem,
  DocumentoRefArea,
  DocumentoRefCategoria,
  DocumentoRefRole,
  DocumentoRefUsuario,
} from "./use-fetch-documentos";
import type { DocRevisao } from "./use-fetch-revisoes";

/**
 * `GET /documentos/:id` — 404 se não existe ou sem visibilidade. Ao
 * contrário da listagem (só ids crus), o detalhe aninha os objetos completos
 * de `categoria`/`area`/`responsavel`/`roles`, além de `revisaoAberta` (null
 * se não houver revisão em aberto).
 */
export interface DocumentoDetail extends DocumentoListItem {
  cd_criado_por: number;
  dt_ultima_aprovacao_revisao: string | null;
  categoria: DocumentoRefCategoria;
  area: DocumentoRefArea;
  responsavel: DocumentoRefUsuario;
  roles: DocumentoRefRole[];
  revisaoAberta: DocRevisao | null;
}

export function useFetchDocumentoById(cd_id?: number) {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.documentos.detail(cd_id ?? 0),
    enabled: Boolean(cd_id),
    queryFn: () =>
      api.get<DocumentoDetail>(`/documentos/${cd_id}`, {
        errorMessage: "Erro ao consultar documento",
      }),
  });
}
