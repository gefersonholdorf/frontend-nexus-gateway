import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocFluxo } from "./use-fetch-doc-fluxos";
import type { CreateDocFluxoInput } from "./use-create-doc-fluxo";

export interface UpdateDocFluxoInput extends CreateDocFluxoInput {
  cd_id: number;
}

/**
 * `PUT /documentos/fluxos/:id` — `configuracoes.gerenciar`. Substitui
 * etapas/aprovadores por completo (transacional no backend).
 */
export function useUpdateDocFluxo() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cd_id, ...input }: UpdateDocFluxoInput) =>
      api.put<DocFluxo>(`/documentos/fluxos/${cd_id}`, {
        body: input,
        errorMessage: "Erro ao atualizar fluxo de aprovação",
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docFluxos.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.docFluxos.detail(variables.cd_id) });
      toast.success("Fluxo de aprovação atualizado com sucesso.", {
        position: "top-center",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar fluxo de aprovação.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
