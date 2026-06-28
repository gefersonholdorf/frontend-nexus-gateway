import { useUser } from "@/contexts/user-context";
import { useMutation } from "@tanstack/react-query";

interface ChangePasswordMeRequest {
    currentPassword: string
    newPassword: string
}

export function useChangePaswordRequest() {
    const { user } = useUser()

    return useMutation({
        mutationKey: ['change-password-user'],
        mutationFn: async (data: ChangePasswordMeRequest) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/change-password/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword
                })
            })

            if (response.status !== 200) {
                throw new Error("Erro ao criar novo documento.")
            }
        }
    })
}