import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocRevisao } from "./use-fetch-revisoes";

export interface RejectRevisaoInput {
  revisaoId: number;
  ds_justificativa: string;
}

/**
 * `POST /documentos/:id/revisoes/:revisaoId/negar` — `revisao.aprovar`.
 * `ds_justificativa` é sempre obrigatório (RN024/Cenário 5).
 */
export function useRejectRevisao(documentoId: number) {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ revisaoId, ds_justificativa }: RejectRevisaoInput) =>
      api.post<DocRevisao>(`/documentos/${documentoId}/revisoes/${revisaoId}/negar`, {
        body: { ds_justificativa },
        errorMessage: "Erro ao negar revisão",
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docRevisoes.list(documentoId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.docRevisoes.detail(documentoId, variables.revisaoId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.detail(documentoId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.all() });
      toast.success("Revisão reprovada. A versão vigente permanece a última aprovada.", {
        position: "top-center",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao negar revisão.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
