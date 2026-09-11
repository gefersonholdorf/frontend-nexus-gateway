import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocArea } from "./use-fetch-doc-areas";

export interface CreateDocAreaInput {
  ds_nome: string;
  ds_sigla: string;
  fl_ativo: boolean;
}

/** `POST /documentos/areas` — `configuracoes.gerenciar`. */
export function useCreateDocArea() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDocAreaInput) =>
      api.post<DocArea>("/documentos/areas", {
        body: input,
        errorMessage: "Erro ao criar área",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docAreas.all() });
      toast.success("Área criada com sucesso.", { position: "top-center", richColors: true });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao criar área.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
