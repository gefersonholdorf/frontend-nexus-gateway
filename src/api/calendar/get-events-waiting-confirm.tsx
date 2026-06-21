import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

interface CalendarResponse {
    events:
    {
        id: string,
        title: string,
        startAt: string,
        endAt: string,
        organizer: {
            name: string,
            email: string
            logo?: string | null
        },
        attendees:
        {
            name: string,
            email: string,
            logo?: string | null
            response: string
        }[],
        isOnline: boolean,
        location: string,
        webLink: string
    }[]
}

export function useGetEventsWaitingConfirm() {
    const { user } = useUser()

    return useQuery({
        queryKey: ['get-events-waiting-confirm'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/calendar/waiting-confirm`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                }
            })

            const result = await response.json() as CalendarResponse;

            return result;
        },
        refetchInterval: 30000,
    })
}