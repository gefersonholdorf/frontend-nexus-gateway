import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { modulesMock, type CoreModule } from "../mocks/modules.mock";

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — lê um único módulo de
 * `modulesMock` em memória, usado pela página de detalhe (`/core/modules/:id`).
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useFetchModule(id?: number) {
    return useQuery({
        queryKey: queryKeys.modules.detail(id ?? 0),
        queryFn: async (): Promise<CoreModule> => {
            await simulateLatency();

            const module = modulesMock.find((item) => item.cd_id === id);

            if (!module) {
                throw new Error("Módulo não encontrado.");
            }

            return { ...module };
        },
        enabled: typeof id === "number" && Number.isFinite(id),
    });
}
