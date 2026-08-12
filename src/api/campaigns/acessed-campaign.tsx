import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface AcessedCampaignRequest {
    campaignId: number
}

export function useAcessedCampaign() {
    const { user } = useUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["acessed-campaign"],

        mutationFn: async (
            data: AcessedCampaignRequest
        ) => {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/campaigns/${data.campaignId}/access/accessed`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData?.message ||
                    "Erro ao registrar métricas na campanha."
                );
            }

            return responseData;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["fetch-campaigns"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["fetch-summary-campaigns"],
            });
        },
    });
}