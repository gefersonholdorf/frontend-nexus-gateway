import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/** `DELETE /documentos/areas/:id` — `configuracoes.gerenciar`. */
export function useDeleteDocArea() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cd_id: number) =>
      api.delete<void>(`/documentos/areas/${cd_id}`, {
        errorMessage: "Erro ao excluir área",
      }),
    onSuccess: (_data, cd_id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docAreas.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.docAreas.detail(cd_id) });
      toast.success("Área excluída com sucesso.", { position: "top-center", richColors: true });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir área.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
