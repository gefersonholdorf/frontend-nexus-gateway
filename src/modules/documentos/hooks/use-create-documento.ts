import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CodigoModo, DocumentoListItem } from "./use-fetch-documentos";

export interface DocumentoInput {
  ds_titulo: string;
  ds_descricao: string;
  cd_categoria: number;
  cd_area: number;
  st_modo_codigo: CodigoModo;
  ds_codigo?: string;
  cd_responsavel: number;
  roles: number[];
  cd_fluxo_aprovacao?: number;
}

/**
 * `POST /documentos` — `documento.criar`. Erros 400 (Cenário 1: código
 * inválido/duplicado; Cenário 8: responsável sem role compatível) chegam
 * como `ApiError.message` e são exibidos via toast pelo chamador do form
 * (a mutação em si só expõe `error`/`isError` — sem `try/catch` manual).
 */
export function useCreateDocumento() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DocumentoInput) =>
      api.post<DocumentoListItem>("/documentos", {
        body: input,
        errorMessage: "Erro ao criar documento",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documentos.all() });
      toast.success("Documento criado com sucesso.", { position: "top-center", richColors: true });
    },
  });
}
