import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocumentoListItem } from "./use-fetch-documentos";

/**
 * `POST /documentos/:id/arquivar` — `documento.arquivar`. Arquivamento é
 * terminal nesta entrega (sem reativação) e remove o documento das
 * listagens de ativos (RF022/RN025).
 */
export function useArchiveDocumento() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cd_id: number) =>
      api.post<DocumentoListItem>(`/documentos/${cd_id}/arquivar`, {
        errorMessage: "Erro ao arquivar documento",
      }),
    onSuccess: (_data, cd_id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.detail(cd_id) });
      toast.success("Documento arquivado com sucesso.", { position: "top-center", richColors: true });
    },
  });
}
