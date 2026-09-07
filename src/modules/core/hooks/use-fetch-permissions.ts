import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { simulateLatency } from "../mocks/simulate-latency";
import { permissionsMock, type CorePermission } from "../mocks/permissions.mock";

/**
 * Hook 100% mockado (sem `fetch`/`ApiClient`) — lê `permissionsMock` em memória.
 * Catálogo fixo, somente leitura (RN008). Ver docs/architecture/core-module-roadmap.md.
 */
export function useFetchPermissions() {
    return useQuery({
        queryKey: queryKeys.permissions.all(),
        queryFn: async (): Promise<CorePermission[]> => {
            await simulateLatency();

            return [...permissionsMock];
        },
    });
}
