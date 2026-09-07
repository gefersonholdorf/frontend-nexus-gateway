import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { integrationsMock, type CoreIntegration } from "../mocks/integrations.mock";

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — lê `integrationsMock` em memória.
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useFetchIntegrations() {
    return useQuery({
        queryKey: queryKeys.integrations.all(),
        queryFn: async (): Promise<CoreIntegration[]> => {
            await simulateLatency();

            return [...integrationsMock];
        },
    });
}
