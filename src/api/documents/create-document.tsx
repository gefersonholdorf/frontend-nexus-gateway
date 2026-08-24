import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateDocumentRequest {
    classification: string,
    process: string,
    ownerId: string,
    code: string,
    title: string,
    category: string,
    editUrl: string
    profiles: number[]
}

export function useCreateDocument() {
    const { user } = useUser()
    const queryClient = useQueryClient()
    const { handleSetLoginExpired } = useLoginExpired()

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
                    editUrl: data.editUrl,
                    profiles: data.profiles,
                    classification: data.classification,
                    process: data.process,
                    ownerId: data.ownerId
                })
            })

            if (response.status === 401) {
                handleSetLoginExpired(true)
            }

            if (response.status !== 201) {
                throw new Error("Erro ao criar novo documento.")
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['fetch-documents']
            })

            await queryClient.invalidateQueries({
                queryKey: ["fetch-summarys-documents"]
            })
        }
    })
}