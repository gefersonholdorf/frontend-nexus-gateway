import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateReviewRequest {
    documentId: number
    reason: string
    description: string
}

export function useCreateReview() {
    const { user } = useUser()
    const queryClient = useQueryClient()
    const { handleSetLoginExpired } = useLoginExpired()

    return useMutation({
        mutationKey: ['create-review-user'],
        mutationFn: async (data: CreateReviewRequest) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/${data.documentId}/revisions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    reason: data.reason,
                    description: data.description
                })
            })

            if (response.status === 401) {
                handleSetLoginExpired(true)
            }

            if (response.status !== 201) {
                throw new Error("Erro ao criar nova revisão.")
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['fetch-Reviews']
            })

            await queryClient.invalidateQueries({
                queryKey: ["fetch-summarys-reviews"]
            })
        }
    })
}