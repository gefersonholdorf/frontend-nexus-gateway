import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateCampaignRequest {
    code: string;
    title: string;
    description: string;
    monthYear: string;
    publishDate: string;
    status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "EXPIRED";
    url: string;
}

interface CreateCampaignResponse {
    campaignId: number;
}

export function useCreateCampaign() {
    const { user } = useUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["create-campaign"],

        mutationFn: async (
            data: CreateCampaignRequest
        ): Promise<CreateCampaignResponse> => {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/campaigns`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                    body: JSON.stringify({
                        code: data.code,
                        title: data.title,
                        description: data.description,
                        monthYear: data.monthYear,
                        publishDate: data.publishDate,
                        status: data.status,
                        url: data.url,
                    }),
                }
            );

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData?.message ||
                    "Erro ao criar campanha."
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