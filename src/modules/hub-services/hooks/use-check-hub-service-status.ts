import { useMutation } from "@tanstack/react-query";

import { useApiClient } from "@/lib/api/use-api-client";

export interface HubServiceStatusCheckResult {
    status: "UP" | "DOWN";
    httpStatus?: number;
    message?: string;
}

/**
 * `POST /hub-services/{id}/status-check` (RF006/RF007). Sem invalidação de
 * cache nem toast genérico: o resultado (UP/DOWN) é exibido inline por item
 * pela própria página, não como efeito colateral global da mutation.
 */
export function useCheckHubServiceStatus() {
    const api = useApiClient();

    return useMutation({
        mutationFn: (cd_id: number) =>
            api.post<HubServiceStatusCheckResult>(`/hub-services/${cd_id}/status-check`, {
                errorMessage: "Erro ao verificar status",
            }),
    });
}
