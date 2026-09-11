import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocArea } from "./use-fetch-doc-areas";

export interface UpdateDocAreaInput {
  cd_id: number;
  ds_nome: string;
  ds_sigla: string;
  fl_ativo: boolean;
}

/** `PUT /documentos/areas/:id` — `configuracoes.gerenciar`. */
export function useUpdateDocArea() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cd_id, ...input }: UpdateDocAreaInput) =>
      api.put<DocArea>(`/documentos/areas/${cd_id}`, {
        body: input,
        errorMessage: "Erro ao atualizar área",
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docAreas.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.docAreas.detail(variables.cd_id) });
      toast.success("Área atualizada com sucesso.", { position: "top-center", richColors: true });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar área.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
