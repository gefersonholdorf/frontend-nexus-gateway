import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocRevisao } from "./use-fetch-revisoes";

export interface ApproveRevisaoInput {
  revisaoId: number;
  ds_url_publicacao?: string;
}

/**
 * `POST /documentos/:id/revisoes/:revisaoId/aprovar` — `revisao.aprovar` +
 * `documento.publicar`. `ds_url_publicacao` só é obrigatório quando o
 * documento não tem fluxo de aprovação (Cenário 6, validado no backend).
 */
export function useApproveRevisao(documentoId: number) {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ revisaoId, ds_url_publicacao }: ApproveRevisaoInput) =>
      api.post<DocRevisao>(`/documentos/${documentoId}/revisoes/${revisaoId}/aprovar`, {
        body: { ds_url_publicacao },
        errorMessage: "Erro ao aprovar revisão",
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docRevisoes.list(documentoId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.docRevisoes.detail(documentoId, variables.revisaoId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.detail(documentoId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.all() });
      toast.success("Revisão aprovada com sucesso.", { position: "top-center", richColors: true });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao aprovar revisão.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
