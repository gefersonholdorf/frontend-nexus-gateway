import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocAprovacao } from "./use-fetch-aprovacoes";

export interface DecideAprovacaoInput {
  revisaoId: number;
  aprovacaoId: number;
  ds_decisao: "APROVAR" | "REPROVAR" | "AJUSTE_SOLICITADO";
  ds_justificativa?: string;
  ds_url_publicacao?: string;
}

/**
 * `POST /documentos/:id/revisoes/:revisaoId/aprovacoes/:aprovacaoId/decidir`
 * — `aprovacao.avaliar` + `documento.publicar`. `ds_justificativa`
 * obrigatório em REPROVAR/AJUSTE_SOLICITADO (Cenário 5); `ds_url_publicacao`
 * obrigatório quando a decisão completa a última etapa (Cenário 6).
 */
export function useDecideAprovacao(documentoId: number) {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ revisaoId, aprovacaoId, ...body }: DecideAprovacaoInput) =>
      api.post<DocAprovacao>(
        `/documentos/${documentoId}/revisoes/${revisaoId}/aprovacoes/${aprovacaoId}/decidir`,
        { body, errorMessage: "Erro ao registrar decisão" },
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.docAprovacoes.list(documentoId, variables.revisaoId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.docRevisoes.detail(documentoId, variables.revisaoId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.docRevisoes.list(documentoId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.detail(documentoId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.all() });
      queryClient.invalidateQueries({ queryKey: ["doc-aprovacoes-pendentes"] });
      toast.success("Decisão registrada com sucesso.", { position: "top-center", richColors: true });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao registrar decisão.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
