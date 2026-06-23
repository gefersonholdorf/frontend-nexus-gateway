import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

interface AvailabilityResponse {
    availabilitys: {
        name: string
        logo: string | null
        scheduleId: string
        availabilityView: string
        scheduleItems: {
            isPrivate: false;
            status: string;
            subject: string;
            location: string;
            isMeeting: boolean;
            isRecurring: boolean;
            isException: boolean;
            isReminderSet: boolean;
            start: {
                dateTime: string;
                timeZone: string;
            };
            end: {
                dateTime: string;
                timeZone: string;
            };
        }[];
    }[]
}

export function useGetAvailabilityUsers() {
    const { user } = useUser()

    return useQuery({
        queryKey: ["availability"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/calendar/availability`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                }
            })

            const result = await response.json() as AvailabilityResponse;

            return result;
        },
        refetchInterval: 30000,
    });
}