import {
    CalendarCog,
    SquareArrowOutUpRight
} from "lucide-react";

import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";
import { EventDetails } from "./calendar/event-details";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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

export interface Event {
    id: string;
    title: string;
    startAt: string;
    endAt: string;
    organizer: {
        name: string;
        email: string;
    };
    attendees: {
        name: string;
        email: string;
        response: string;
    }[];
    isOnline: boolean;
    location: string;
    webLink: string;
}

export function CalendarOverviewComponent() {
    const { user } = useUser()
    const startDate = "2026-06-19T00:00:00.000Z"
    const endDate = "2026-06-19T23:59:00.000Z"

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

    return (
        <Card
            className="
                h-165
                flex
                flex-col
                rounded-3xl
                border-border
                bg-(image:--background-gradient)
                shadow-lg
                transition-all
                duration-300
                hover:shadow-xl
                overflow-hidden
            "
        >
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary bg-background/10">
                            <CalendarCog className="size-5 text-primary" />
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-primary-text">
                                Calendário Compartilhado
                            </h3>

                            <p className="text-xs text-muted-foreground">
                                Confira os próximos eventos da Lusati
                            </p>
                        </div>
                    </div>
                    <div>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="flex gap-1 items-center cursor-pointer group" onClick={() => window.open('https://glpi.lusati.com.br/front/ticket.php', "_blank")}>
                                    <span className="text-muted-foreground text-[.7rem] group-hover:text-primary/80">Ver Calendário Completo</span>
                                    <SquareArrowOutUpRight className="size-3 text-muted-foreground cursor-pointer group-hover:text-primary/80" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Acesse o módulo de calendário compartilhado da Lusati</span>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex h-full flex-col">
                <div className="flex-1 overflow-y-auto px-4">
                    <div className="space-y-3">
                        {query.data.events.map((event) => {

                            return (
                                <EventDetails event={event} />
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}