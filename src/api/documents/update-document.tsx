import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateDocumentRequest {
    id: number
    code: string,
    title: string,
    category: string,
    status: string,
    viewUrl: string
    editUrl: string
}

export function useUpdateDocument() {
    const { user } = useUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['create-document-user'],
        mutationFn: async (data: UpdateDocumentRequest) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    code: data.code,
                    title: data.title,
                    category: data.category,
                    status: data.status,
                    viewUrl: data.viewUrl,
                    editUrl: data.editUrl
                })
            })

            if (response.status !== 201) {
                throw new Error("Erro ao atualizar novo documento.")
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