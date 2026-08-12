import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCampaign() {
    const { user } = useUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['delete-campaign'],
        mutationFn: async (id: number) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/campaigns/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${user?.token}`
                }
            })

            if (response.status !== 200) {
                throw new Error("Erro ao deletar campanha.")
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