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

interface useGetNextEventsProps {
    startDate: string
    endDate: string
}

export function useGetNextEvents({ startDate, endDate }: useGetNextEventsProps) {
    const { user } = useUser()

    return useQuery({
        queryKey: ['get-nexts-events'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/calendar/nexts?startDate=${startDate}&endDate=${endDate}`, {
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