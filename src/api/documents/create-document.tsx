import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateDocumentRequest {
    code: string,
    title: string,
    category: string,
    status: string,
    viewUrl: string | null,
    editUrl: string | null
    profiles: number[]
}

export function useCreateDocument() {
    const { user } = useUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['create-document-user'],
        mutationFn: async (data: CreateDocumentRequest) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents`, {
                method: "POST",
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
                    editUrl: data.editUrl,
                    profiles: data.profiles
                })
            })

            if (response.status !== 201) {
                throw new Error("Erro ao criar novo documento.")
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