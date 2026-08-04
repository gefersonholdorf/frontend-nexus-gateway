import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface Notification {
    id: number
    eventType: string
    source: string
    message: string
    title: string
    createdAt: string
}

interface FetchNotificationsResponse {
    notifications: Notification[]
}

export function useFetchNotifications() {
    const { user } = useUser()

    return useQuery({
        queryKey: ["fetch-notifications"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications/glpi/events/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar notificações")
            }

            const result: FetchNotificationsResponse = await response.json()

            return result
        },
    })
}