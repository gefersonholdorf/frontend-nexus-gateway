import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocCategoria } from "./use-fetch-doc-categorias";

export interface CreateDocCategoriaInput {
  ds_nome: string;
  ds_sigla: string;
  fl_ativo: boolean;
}

/** `POST /documentos/categorias` — `configuracoes.gerenciar`. */
export function useCreateDocCategoria() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDocCategoriaInput) =>
      api.post<DocCategoria>("/documentos/categorias", {
        body: input,
        errorMessage: "Erro ao criar categoria",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docCategorias.all() });
      toast.success("Categoria criada com sucesso.", { position: "top-center", richColors: true });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao criar categoria.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
