import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocumentoListItem } from "./use-fetch-documentos";
import type { DocumentoInput } from "./use-create-documento";

export interface UpdateDocumentoInput extends DocumentoInput {
  cd_id: number;
}

/**
 * `PUT /documentos/:id` — `documento.editar`. Mesmos erros 400 do
 * cadastro (Cenário 1/Cenário 8); alterar categoria/área recalcula o código
 * incondicionalmente no backend (RN005).
 */
export function useUpdateDocumento() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cd_id, ...input }: UpdateDocumentoInput) =>
      api.put<DocumentoListItem>(`/documentos/${cd_id}`, {
        body: input,
        errorMessage: "Erro ao atualizar documento",
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.detail(variables.cd_id) });
      toast.success("Documento atualizado com sucesso.", { position: "top-center", richColors: true });
    },
  });
}
