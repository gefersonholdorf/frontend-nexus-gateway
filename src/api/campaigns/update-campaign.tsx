import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateCampaignRequest {
    id: number
    code: string;
    title: string;
    description: string;
    monthYear: string;
    publishDate: string;
    status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "INACTIVE";
    url: string;
}

export function useUpdateCampaign() {
    const { user } = useUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['update-campaign'],
        mutationFn: async (data: UpdateCampaignRequest) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/campaigns/${data.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    code: data.code,
                    title: data.title,
                    status: data.status,
                    url: data.url,
                    description: data.description,
                    monthYear: data.monthYear,
                    publishDate: data.publishDate
                })
            })

            if (response.status !== 200) {
                throw new Error("Erro ao atualizar campanha.")
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['fetch-campaigns']
            })

            await queryClient.invalidateQueries({
                queryKey: ["fetch-summarys-campaigns"]
            })
        }
    })
}