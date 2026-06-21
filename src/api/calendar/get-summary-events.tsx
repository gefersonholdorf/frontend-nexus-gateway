import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

interface SummaryEventsResponse {
    summary: {
        meetingsToday: number;
        scheduledHoursToday: number;
        freeHoursToday: number;
        productivityPercentage: number;
        onlineMeetings: number;
        presencialMeetings: number;
        acceptedMeetings: number;
        tentativeMeetings: number;
        declinedMeetings: number;
        canceledMeetings: number;
        nextMeetingAt: string | null;
        averageMeetingMinutes: number;
        uniqueAttendees: number;
        status: string;
    };
}

interface UseGetSummaryEventsProps {
    type: "user" | "full";
    startDate?: string;
    endDate?: string;
}

export function useGetSummaryEvents({
    type,
    startDate,
    endDate,
}: UseGetSummaryEventsProps) {
    const { user } = useUser();

    const now = new Date();

    const currentDayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
    ).toISOString();

    const currentDayEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
    ).toISOString();

    const finalStartDate =
        type === "user" ? currentDayStart : startDate;

    const finalEndDate =
        type === "user" ? currentDayEnd : endDate;

    return useQuery({
        queryKey: [
            "get-summary-events",
            type,
            finalStartDate,
            finalEndDate,
        ],

        enabled:
            type === "user" ||
            (!!finalStartDate && !!finalEndDate),

        queryFn: async () => {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/calendar/summary?type=${type}&startDate=${finalStartDate}&endDate=${finalEndDate}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch summary");
            }

            return (await response.json()) as SummaryEventsResponse;
        },

        refetchInterval: 30000,
    });
}