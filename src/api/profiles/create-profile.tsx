import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateProfileRequest {
    title: string
    description: string | null
    status: boolean
    permissions: {
        id: number
    }[]
}

export function useCreateProfile() {
    const { user } = useUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['create-profile'],
        mutationFn: async (data: CreateProfileRequest) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/profiles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    permissions: data.permissions,
                })
            })

            if (response.status !== 201) {
                throw new Error("Erro ao criar novo perfil.")
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['fetch-profiles']
            })
        }
    })
}