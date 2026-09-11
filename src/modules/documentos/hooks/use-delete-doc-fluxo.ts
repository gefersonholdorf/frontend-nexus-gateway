import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/** `DELETE /documentos/fluxos/:id` — `configuracoes.gerenciar`. */
export function useDeleteDocFluxo() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cd_id: number) =>
      api.delete<void>(`/documentos/fluxos/${cd_id}`, {
        errorMessage: "Erro ao excluir fluxo de aprovação",
      }),
    onSuccess: (_data, cd_id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docFluxos.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.docFluxos.detail(cd_id) });
      toast.success("Fluxo de aprovação excluído com sucesso.", {
        position: "top-center",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir fluxo de aprovação.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
