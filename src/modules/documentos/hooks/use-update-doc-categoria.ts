import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocCategoria } from "./use-fetch-doc-categorias";

export interface UpdateDocCategoriaInput {
  cd_id: number;
  ds_nome: string;
  ds_sigla: string;
  fl_ativo: boolean;
}

/** `PUT /documentos/categorias/:id` — `configuracoes.gerenciar`. */
export function useUpdateDocCategoria() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cd_id, ...input }: UpdateDocCategoriaInput) =>
      api.put<DocCategoria>(`/documentos/categorias/${cd_id}`, {
        body: input,
        errorMessage: "Erro ao atualizar categoria",
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docCategorias.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.docCategorias.detail(variables.cd_id) });
      toast.success("Categoria atualizada com sucesso.", { position: "top-center", richColors: true });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar categoria.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
