import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreModule } from "./use-fetch-modules";

export interface ToggleModuleStatusInput {
    cd_id: number;
    ds_key: string;
    fl_active: boolean;
}

/**
 * `PATCH /modules/{id}/active` (RF022).
 *
 * O módulo Core (`ds_key === "core"`) nunca pode ser desativado. O Swagger de
 * módulos não documenta um campo/flag explícito de "módulo protegido contra
 * desativação" — a identificação por `ds_key === "core"` é a mesma suposição
 * já usada na spec mockada anterior, mantida aqui até confirmação em
 * contrário. A trava é aplicada no cliente antes de chamar a API (a mutation
 * rejeita a chamada), além da UI já evitar disparar o toggle para este
 * módulo (RN001).
 */
export function useToggleModuleStatus() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_id, ds_key, fl_active }: ToggleModuleStatusInput) => {
            if (ds_key === "core" && !fl_active) {
                return Promise.reject(new Error("O módulo Core não pode ser desativado."));
            }

            return api.patch<CoreModule>(`/modules/${cd_id}/active`, {
                body: { fl_active },
                errorMessage: "Erro ao atualizar status do módulo",
            });
        },
        onSuccess: (module, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.detail(variables.cd_id) });
            toast.success(
                (module?.fl_active ?? variables.fl_active)
                    ? "Módulo ativado com sucesso."
                    : "Módulo inativado com sucesso.",
                { position: "top-center", richColors: true },
            );
        },
        onError: (error) => {
            toast.error(
                error instanceof Error ? error.message : "Erro ao atualizar status do módulo.",
                { position: "top-center", richColors: true },
            );
        },
    });
}
