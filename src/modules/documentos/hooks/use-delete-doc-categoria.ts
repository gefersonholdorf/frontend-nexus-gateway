import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";

/** `DELETE /documentos/categorias/:id` — `configuracoes.gerenciar`. */
export function useDeleteDocCategoria() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cd_id: number) =>
      api.delete<void>(`/documentos/categorias/${cd_id}`, {
        errorMessage: "Erro ao excluir categoria",
      }),
    onSuccess: (_data, cd_id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docCategorias.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.docCategorias.detail(cd_id) });
      toast.success("Categoria excluída com sucesso.", { position: "top-center", richColors: true });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir categoria.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
