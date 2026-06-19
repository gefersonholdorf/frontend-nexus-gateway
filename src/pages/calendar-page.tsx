import { BackComponent } from "@/components/back-component"
import { AvailabilityComponente } from "@/components/calendar/availability-componente"
import { DrawerScrollableContent } from "@/components/calendar/drawer-events"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/contexts/user-context"
import { useQuery } from "@tanstack/react-query"
import { Calendar1Icon } from "lucide-react"
import { useState } from "react"

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
        },
        attendees:
        {
            name: string,
            email: string,
            response: string
        }[],
        isOnline: boolean,
        location: string,
        webLink: string
    }[]
}

export function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [startDate, setStartDate] = useState<string>(
        "2026-06-01T00:00:00.000Z"
    )

    const [endDate, setEndDate] = useState<string>(
        "2026-06-30T23:59:59.999Z"
    )

    const { user } = useUser()
    const query = useQuery({
        queryKey: ["calendar"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/calendar?startDate=${startDate}&endDate=${endDate}`, {
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
    });

    if (query.isLoading) {
        return (
            <Card className="h-52 p-0">
                <Skeleton className="h-full bg-gray-100" />
            </Card>
        );
    }

    if (!query.data) {
        return null;
    }

    function handleSetOpenDrawer() {
        setOpenDrawer(!openDrawer)
    }

    function handleDaySelect(date: Date | undefined) {
        if (!date) return;

        setSelectedDate(date);
        setOpenDrawer(true);

        const startTime = new Date(date);
        startTime.setHours(0, 0, 0, 0);

        const endTime = new Date(date);
        endTime.setHours(23, 59, 59, 999);

        console.log("startTime", startTime.toISOString());
        console.log("endTime", endTime.toISOString());
    }

    return (
        <>

            <div className="px-10 flex justify-between items-center border-b border-border bg-background p-4 rounded-lg">
                <div className="flex gap-3 items-center">
                    <BackComponent />
                    <div className="w-10 h-10 border border-primary rounded-md overflow-hidden flex items-center justify-center bg-background">
                        <Calendar1Icon className="text-primary size-4" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Calendário</h1>
                        <p className="text-muted-foreground text-[.8rem]">Calendário compartilhado da Lusati.</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 border grid grid-cols-1 lg:grid-cols-6 gap-6 pt-6 mb-6 px-16">
                <div className="lg:col-span-4">
                    <Calendar
                        selected={selectedDate}
                        onSelect={handleDaySelect}
                        mode="single"
                        captionLayout="dropdown"
                        className="rounded-lg border"
                    />
                </div>
                <div className="lg:col-span-2">
                    <AvailabilityComponente />
                </div>
            </div >
            <DrawerScrollableContent
                open={openDrawer}
                onOpenChange={handleSetOpenDrawer}
                events={query.data.events}
            />

        </>
    )
}