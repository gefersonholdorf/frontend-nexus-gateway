import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProfileRequest {
    id: number
    title: string
    description: string | null
    status: boolean
    permissions: {
        id: number
    }[]
}

export function useUpdateProfile() {
    const { user } = useUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['update-profile'],
        mutationFn: async (data: UpdateProfileRequest) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/profiles/${data.id}`, {
                method: "PUT",
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

            if (response.status !== 200) {
                throw new Error("Erro ao atualizar perfil.")
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['fetch-profiles']
            })
        }
    })
}