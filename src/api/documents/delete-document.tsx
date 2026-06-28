import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteDocument() {
    const { user } = useUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['delete-document-user'],
        mutationFn: async (id: number) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${user?.token}`
                }
            })

            if (response.status !== 200) {
                throw new Error("Erro ao deletar documento.")
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['fetch-documents']
            })

            await queryClient.invalidateQueries({
                queryKey: ["fetch-summarys"]
            })
        }
    })
}