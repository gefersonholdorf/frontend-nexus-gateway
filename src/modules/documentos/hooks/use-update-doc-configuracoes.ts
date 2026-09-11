import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocConfiguracoes } from "./use-fetch-doc-configuracoes";

export interface UpdateDocConfiguracoesInput {
  ds_periodo_revisao_dias: number;
}

/** `PUT /documentos/configuracoes` — `configuracoes.gerenciar`. */
export function useUpdateDocConfiguracoes() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateDocConfiguracoesInput) =>
      api.put<DocConfiguracoes>("/documentos/configuracoes", {
        body: input,
        errorMessage: "Erro ao atualizar configurações",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docConfiguracoes.all() });
      toast.success("Configurações atualizadas com sucesso.", {
        position: "top-center",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar configurações.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
