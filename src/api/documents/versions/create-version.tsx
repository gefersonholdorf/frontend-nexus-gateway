import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateVersionRequest {
    documentId: number,
    editUrl: string,
    changeLog: string,
    onwerId: number,
}

export function useCreateVersion() {
    const { user } = useUser()
    const queryClient = useQueryClient()
    const { handleSetLoginExpired } = useLoginExpired()

    return useMutation({
        mutationKey: ['create-version'],
        mutationFn: async (data: CreateVersionRequest) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/${data.documentId}/versions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    editUrl: data.editUrl,
                    changeLog: data.changeLog,
                    onwerId: data.onwerId,
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
                queryKey: ['fetch-versions']
            })

            await queryClient.invalidateQueries({
                queryKey: ["fetch-summarys-versions"]
            })
        }
    })
}