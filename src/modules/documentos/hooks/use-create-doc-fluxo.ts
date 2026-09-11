import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocFluxo } from "./use-fetch-doc-fluxos";

export interface CreateDocFluxoEtapaInput {
  ds_nome: string;
  ds_ordem: number;
  aprovadores: number[];
}

export interface CreateDocFluxoInput {
  ds_nome: string;
  ds_descricao?: string;
  etapas: CreateDocFluxoEtapaInput[];
}

/** `POST /documentos/fluxos` — `configuracoes.gerenciar`. */
export function useCreateDocFluxo() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDocFluxoInput) =>
      api.post<DocFluxo>("/documentos/fluxos", {
        body: input,
        errorMessage: "Erro ao criar fluxo de aprovação",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docFluxos.all() });
      toast.success("Fluxo de aprovação criado com sucesso.", {
        position: "top-center",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao criar fluxo de aprovação.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
