import { useMemo } from "react";
import { useGetNextEvents } from "@/api/calendar/get-next-events-by-user";
import {
    format,
    formatDistanceToNowStrict,
    isToday,
    isYesterday,
    addHours,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import { CalendarCheck, Clock, Calendar, ChevronRight } from "lucide-react";

import { useUser } from "@/contexts/user-context";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

const adjust = (date: string) => addHours(new Date(date), -3);

function formatEventLabel(start: Date, end: Date) {
    const time = `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;

    if (isToday(start)) return `Hoje • ${time}`;
    if (isYesterday(start)) return `Ontem • ${time}`;

    return `${format(start, "dd MMM", { locale: ptBR })} • ${time}`;
}

export function NextEvents() {
    const { user } = useUser();

    const now = useMemo(() => new Date(), []);
    const nextWeek = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d;
    }, []);

    const { data, isLoading } = useGetNextEvents({
        startDate: now.toISOString(),
        endDate: nextWeek.toISOString(),
    });

    const events = useMemo(() => {
        return (data?.events ?? [])
            .map((e) => ({
                ...e,
                start: adjust(e.startAt),
                end: adjust(e.endAt),
            }))
            .sort((a, b) => a.start.getTime() - b.start.getTime());
    }, [data]);

    const nextEventIndex = useMemo(() => {
        return events.findIndex((e) => e.start.getTime() > Date.now());
    }, [events]);

    const nextEvent = nextEventIndex >= 0 ? events[nextEventIndex] : null;

    const upcomingEvents = useMemo(() => {
        if (nextEventIndex < 0) return [];

        return events
            .slice(nextEventIndex + 1, nextEventIndex + 2);
    }, [events, nextEventIndex]);

    const userPresence = nextEvent?.attendees.find(
        (a) => a.email === user?.email
    )?.response;

    const timeUntil = nextEvent
        ? formatDistanceToNowStrict(nextEvent.start, {
            locale: ptBR,
            roundingMethod: "floor",
        })
        : null;

    if (isLoading) {
        return (
            <Card className="h-100 p-0 overflow-hidden">
                <Skeleton className="h-full w-full" />
            </Card>
        );
    }

    return (
        <Card className="h-100 w-full rounded-2xl border bg-(image:--background-gradient) shadow-sm hover:shadow-lg transition-all">
            <CardHeader className="">
                <div className="flex items-center gap-3">
                    <div
                        className={`
                                        flex h-10 w-10 items-center justify-center rounded-md border
                                        border-blue-500
                                    `}
                    >
                        <CalendarCheck className="size-5 text-blue-500" />
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-primary-text">
                            Agenda
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Próximos compromissos
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 ">
                {nextEvent ? (
                    <div className="rounded-xl border p-4 bg-(image:--background-gradient)">
                        <div className="flex items-center gap-2 text-xs text-primary font-medium mb-2">
                            <Clock className="size-3.5" />
                            Em {timeUntil}
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold line-clamp-2">
                                {nextEvent.title}
                            </span>

                            <span className="text-xs text-muted-foreground">
                                {formatEventLabel(nextEvent.start, nextEvent.end)}
                            </span>

                            {userPresence && (
                                <Badge
                                    variant="outline"
                                    className={
                                        userPresence === "accepted"
                                            ? "border-emerald-500 text-emerald-600 w-fit"
                                            : "w-fit"
                                    }
                                >
                                    {userPresence === "accepted" ? "Confirmado" : "Pendente"}
                                </Badge>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border p-6 bg-background/40 text-center">
                        <CalendarCheck className="size-8 mx-auto text-muted-foreground/40 mb-2" />

                        <p className="text-sm font-medium text-muted-foreground">
                            Nenhum evento próximo
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                            Sua agenda está livre no momento
                        </p>
                    </div>
                )}

                {/* UPCOMING LIST */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                        Outros eventos
                    </span>

                    {upcomingEvents.length > 0 ? (
                        <div className="space-y-2">
                            {upcomingEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-muted/40 transition"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium line-clamp-1">
                                            {event.title}
                                        </span>

                                        <span className="text-xs text-muted-foreground">
                                            {formatEventLabel(event.start, event.end)}
                                        </span>
                                    </div>

                                    <ChevronRight className="size-4 text-muted-foreground" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed p-4 text-center">
                            <p className="text-xs text-muted-foreground">
                                Nenhum outro evento encontrado
                            </p>
                        </div>
                    )}
                </div>

                {/* ACTION */}
                <Button
                    variant="outline"
                    className="w-full mt-auto"
                    onClick={() =>
                        window.open(
                            "https://outlook.office.com/calendar/view/month",
                            "_blank"
                        )
                    }
                >
                    <Calendar className="size-4" />
                    Abrir calendário completo
                    <ChevronRight className="ml-auto size-4" />
                </Button>
            </CardContent>
        </Card>
    );
}