import { useQuery } from "@tanstack/react-query";

import { queryKeys, type DocumentoQueryParams } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

export type DocumentoStatus =
  | "RASCUNHO"
  | "EM_REVISAO"
  | "EM_APROVACAO"
  | "APROVADO"
  | "PUBLICADO"
  | "REPROVADO"
  | "ARQUIVADO";

export type CodigoModo = "AUTOMATICO" | "MANUAL";

export interface DocumentoRefCategoria {
  cd_id: number;
  ds_nome: string;
  ds_sigla: string;
}

export interface DocumentoRefArea {
  cd_id: number;
  ds_nome: string;
  ds_sigla: string;
}

/** Shape usado no detalhe (`responsavel`) — sem `ds_email` (só `GET /documentos/roles`/`/usuarios` trazem e-mail). */
export interface DocumentoRefUsuario {
  cd_id: number;
  ds_name: string;
}

export interface DocumentoRefRole {
  cd_id: number;
  ds_name: string;
}

/**
 * Item de listagem (`GET /documentos`) — contrato original (Seção 2): só ids
 * crus (`cd_categoria`, `cd_area`, `cd_responsavel`), sem objetos aninhados
 * de categoria/área/responsável/roles (isso só existe no detalhe,
 * `GET /documentos/:id`). A listagem resolve os rótulos no client a partir
 * dos dados de referência já buscados para os filtros/formulários
 * (`useFetchDocCategorias`/`useFetchDocAreas`/`useGetUsuariosSelect`).
 */
export interface DocumentoListItem {
  cd_id: number;
  ds_codigo: string;
  st_modo_codigo: CodigoModo;
  ds_titulo: string;
  ds_descricao: string;
  st_status: DocumentoStatus;
  ds_versao_major: number;
  ds_versao_minor: number;
  ds_url_versao_vigente: string | null;
  cd_categoria: number;
  cd_area: number;
  cd_responsavel: number;
  cd_fluxo_aprovacao: number | null;
  dt_created_at: string;
  dt_updated_at: string;
}

/**
 * Envelope de paginação do backend (contrato original, Seção 2): só
 * `{items, page, pageSize, total}` — **sem** `totalPages`. Mesma limitação
 * já documentada em `src/modules/audit/hooks/use-fetch-audit.ts` e
 * `src/modules/core/pages/core-users-page.tsx` para outras listagens;
 * `totalPages` deve ser calculado no client (`Math.ceil(total / pageSize)`),
 * nunca lido da resposta.
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

/**
 * `GET /documentos?categoria&area&status&role&q&page&pageSize` — visibilidade
 * (RF004/RN006) já filtrada pelo backend.
 */
export function useFetchDocumentos(params: DocumentoQueryParams) {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.documentos.list(params),
    queryFn: () =>
      api.get<PaginatedResponse<DocumentoListItem>>("/documentos", {
        query: {
          categoria: params.categoria,
          area: params.area,
          status: params.status,
          role: params.role,
          q: params.q,
          page: params.page,
          pageSize: params.pageSize,
        },
        errorMessage: "Erro ao consultar documentos",
      }),
  });
}
