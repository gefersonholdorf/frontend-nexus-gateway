import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { modulesMock, type CoreModule } from "../mocks/modules.mock";

export interface ToggleModuleStatusInput {
    cd_id: number;
    fl_active: boolean;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — ativa/inativa um módulo em
 * `modulesMock` em memória. O módulo "Core" (`ds_key === "core"`) nunca pode
 * ser desativado (RN001): a `mutationFn` rejeita a tentativa mesmo que a UI
 * já evite chamar este hook para ele.
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useToggleModuleStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cd_id, fl_active }: ToggleModuleStatusInput): Promise<CoreModule> => {
            await simulateLatency();

            const module = modulesMock.find((item) => item.cd_id === cd_id);

            if (!module) {
                throw new Error("Módulo não encontrado.");
            }

            if (module.ds_key === "core" && !fl_active) {
                throw new Error("O módulo Core não pode ser desativado.");
            }

            module.fl_active = fl_active;

            return module;
        },
        onSuccess: (module) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.detail(module.cd_id) });
            toast.success(
                module.fl_active ? "Módulo ativado com sucesso." : "Módulo inativado com sucesso.",
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
