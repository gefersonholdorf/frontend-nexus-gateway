import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { modulesMock, type CoreModule } from "../mocks/modules.mock";

export interface UpdateModuleInput {
    cd_id: number;
    ds_name: string;
    ds_description: string;
}

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — atualiza nome/descrição em
 * `modulesMock` em memória (RF022). Status não é editável por aqui — ver
 * `use-toggle-module-status.ts`. Ver docs/architecture/core-module-roadmap.md.
 */
export function useUpdateModule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateModuleInput): Promise<CoreModule> => {
            await simulateLatency();

            const module = modulesMock.find((item) => item.cd_id === input.cd_id);

            if (!module) {
                throw new Error("Módulo não encontrado.");
            }

            module.ds_name = input.ds_name;
            module.ds_description = input.ds_description;

            return module;
        },
        onSuccess: (module) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.modules.detail(module.cd_id) });
            toast.success("Módulo atualizado com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao atualizar módulo.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
