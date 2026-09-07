import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { usersMock, type CoreUser } from "../mocks/users.mock";

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — lê `usersMock` em memória.
 * Ver docs/architecture/core-module-roadmap.md.
 */
export function useFetchUsers() {
    return useQuery({
        queryKey: queryKeys.users.all(),
        queryFn: async (): Promise<CoreUser[]> => {
            await simulateLatency();

            return [...usersMock];
        },
    });
}
