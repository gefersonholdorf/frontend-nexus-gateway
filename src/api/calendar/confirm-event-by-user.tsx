import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ConfirmEventByUserRequest {
    eventId: string
    comment: string
    sendResponse: boolean
}

export function useConfirmEventByUser() {
    const { user } = useUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['confirm-event-by-user'],
        mutationFn: async (data: ConfirmEventByUserRequest) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/calendar/confirm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    comment: data.comment,
                    sendResponse: data.sendResponse,
                    eventId: data.eventId
                })
            })

            if (response.status !== 200) {
                throw new Error("Erro ao confirmar participação da reunião.")
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get-events-waiting-confirm']
            })
        }
    })
}