import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { DocVersao } from "./use-fetch-versoes";

export interface CreateVersaoInput {
  ds_descritivo: string;
  ds_url_edicao?: string;
}

/**
 * `POST /documentos/:id/versoes` — `versao.criar`. Cria dentro da revisão
 * `ABERTA` (400 se não houver); `ds_url_edicao` omitido é preenchido pelo
 * backend com o default da versão anterior (RF012).
 */
export function useCreateVersao(documentoId: number) {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateVersaoInput) =>
      api.post<DocVersao>(`/documentos/${documentoId}/versoes`, {
        body: input,
        errorMessage: "Erro ao criar versão",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.docVersoes.list(documentoId, data.cd_revisao),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.docVersoes.list(documentoId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.detail(documentoId) });
      toast.success("Versão criada com sucesso.", { position: "top-center", richColors: true });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao criar versão.", {
        position: "top-center",
        richColors: true,
      });
    },
  });
}
