import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { modulesMock, type CoreModule } from "../mocks/modules.mock";

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — lê `modulesMock` em memória.
 * O módulo "Core" (`ds_key === "core"`) sempre volta com `fl_active: true` (RN001).
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useFetchModules() {
    return useQuery({
        queryKey: queryKeys.modules.all(),
        queryFn: async (): Promise<CoreModule[]> => {
            await simulateLatency();

            return [...modulesMock];
        },
    });
}
