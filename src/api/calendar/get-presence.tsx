import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

interface PresenceResponse {
    users: {
        id: number,
        name: string,
        email: string,
        roleDescription: string,
        logo: string | null,
        availability: string,
        activity: string
    }[]
}

export function useGetPresence() {
    const { user } = useUser()
    return useQuery({
        queryKey: ["presence"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/calendar/presence`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                }
            })

            const result = await response.json() as PresenceResponse;

            return result;
        },
        refetchInterval: 30000,
    });
}