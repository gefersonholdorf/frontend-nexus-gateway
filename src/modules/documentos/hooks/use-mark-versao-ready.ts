import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocVersao } from "./use-fetch-versoes";

/**
 * `POST /documentos/:id/versoes/:versaoId/marcar-pronta` — `versao.criar`.
 * Só o autor da versão pode marcá-la como pronta (RN013, 403 senão).
 */
export function useMarkVersaoReady(documentoId: number) {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (versaoId: number) =>
      api.post<DocVersao>(`/documentos/${documentoId}/versoes/${versaoId}/marcar-pronta`, {
        errorMessage: "Erro ao marcar versão como pronta",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.docVersoes.list(documentoId, data.cd_revisao),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.docVersoes.list(documentoId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.docVersoes.detail(documentoId, data.cd_id),
      });
      toast.success("Versão marcada como pronta.", { position: "top-center", richColors: true });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao marcar versão como pronta.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
