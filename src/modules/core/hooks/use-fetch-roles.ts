import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { rolesMock, type CoreRole } from "../mocks/roles.mock";

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — lê `rolesMock` em memória.
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useFetchRoles() {
    return useQuery({
        queryKey: queryKeys.roles.all(),
        queryFn: async (): Promise<CoreRole[]> => {
            await simulateLatency();

            return [...rolesMock];
        },
    });
}
