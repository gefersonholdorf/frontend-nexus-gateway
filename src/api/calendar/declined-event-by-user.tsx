import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeclinedEventByUserRequest {
    eventId: string
    comment: string
    sendResponse: boolean
}

export function useDeclinedEventByUser() {
    const { user } = useUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['declined-event-by-user'],
        mutationFn: async (data: DeclinedEventByUserRequest) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/calendar/declined`, {
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
                throw new Error("Erro ao recusar participação da reunião.")
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get-events-waiting-confirm']
            })
        }
    })
}