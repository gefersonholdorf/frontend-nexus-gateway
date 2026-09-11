import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { isApiError } from "@/lib/api/api-error";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocRevisao } from "./use-fetch-revisoes";

/**
 * `POST /documentos/:id/revisoes` — `revisao.solicitar`.
 *
 * Cenário de Exceção 2: 409 quando já existe revisão aberta para o
 * documento — mensagem específica do backend é repassada via `error.message`
 * (`ApiClient` já usa o `message` do corpo de erro quando presente).
 */
export function useRequestRevisao(documentoId: number) {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post<DocRevisao>(`/documentos/${documentoId}/revisoes`, {
        errorMessage: "Erro ao solicitar abertura de revisão",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docRevisoes.list(documentoId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.detail(documentoId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.all() });
      toast.success("Revisão aberta com sucesso.", { position: "top-center", richColors: true });
    },
    onError: (error) => {
      if (isApiError(error) && error.status === 409) {
        toast.error(error.message, { position: "top-center", richColors: true });
        return;
      }

      toast.error(error instanceof Error ? error.message : "Erro ao solicitar revisão.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
