import { useGetNextEvents } from "@/api/calendar/get-next-events-by-user";
import {
    format,
    formatDate,
    formatDistanceToNowStrict,
    isToday,
    isYesterday,
    subHours,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Calendar,
    CalendarCheck,
    ChevronRight,
    Clock,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useUser } from "@/contexts/user-context";
import { Badge } from "../ui/badge";

export function formatDateEvent(
    startDate: string,
    endDate: string
) {
    const start = subHours(new Date(startDate), 3);
    const end = subHours(new Date(endDate), 3);

    if (isToday(start)) {
        return `Hoje • ${format(start, "HH:mm")} - ${format(
            end,
            "HH:mm"
        )}`;
    }

    if (isYesterday(start)) {
        return `Ontem • ${format(start, "HH:mm")} - ${format(
            end,
            "HH:mm"
        )}`;
    }

    return `${format(
        start,
        "dd 'de' MMMM",
        { locale: ptBR }
    )} • ${format(start, "HH:mm")} - ${format(
        end,
        "HH:mm"
    )}`;
}

export function NextEvents() {

    const { user } = useUser()
    const now = new Date();

    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const { data, isLoading } = useGetNextEvents({
        startDate: now.toISOString(),
        endDate: nextWeek.toISOString(),
    });

    if (isLoading) {
        return (
            <Card className="h-80 overflow-hidden p-0">
                <Skeleton className="h-full w-full" />
            </Card>
        );
    }

    if (!data) {
        return null;
    }

    const sortedEvents = [...data.events].sort(
        (a, b) =>
            new Date(a.startAt).getTime() -
            new Date(b.startAt).getTime()
    );

    const nextEvent = sortedEvents.find(
        event =>
            new Date(event.startAt).getTime() > Date.now()
    );

    const prensence = nextEvent?.attendees.find((next) => next.email === user?.email)?.response

    const timeUntilNextEvent = nextEvent
        ? formatDistanceToNowStrict(
            new Date(
                new Date(nextEvent.startAt).getTime() -
                3 * 60 * 60 * 1000
            ),
            {
                locale: ptBR,
                roundingMethod: "floor",
            }
        )
        : null;

    return (
        <Card
            className="
                h-74
                w-full
                rounded-2xl
                border
                bg-(image:--background-gradient)
                shadow-sm
                transition-all
                duration-300
                hover:shadow-lg
            "
        >
            <CardHeader className="">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary bg-background/10">
                        <CalendarCheck className="size-5 text-primary" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-primary-text">
                            Próximos Eventos
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Confira sua próxima agenda
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex h-full flex-col">
                {data.events.length > 0 ? (
                    <>
                        <div
                            className="
                                        mb-3
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        font-medium
                                        text-primary
                                    "
                        >
                            <Clock className="size-3.5" />

                            <span>
                                Próximo evento em{" "}
                                {timeUntilNextEvent}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 border border-border rounded-sm p-4">
                            <div className="flex items-center">
                                {/* <div className="border border-border p-2 rounded-full">
                                    <Calendar className="size-4 text-blue-400" />
                                </div> */}
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold line-clamp-2 max-w-60">{nextEvent?.title}</span>
                                    <span className="text-[.8rem] text-muted-foreground">
                                        {nextEvent &&
                                            formatDate(
                                                nextEvent.startAt,
                                                "EEEE, dd 'de' MMMM 'às' HH:mm",
                                                {
                                                    locale: ptBR,
                                                }
                                            )}
                                    </span>
                                    <Badge className={`bg-transparent border ${prensence === 'accepted' && 'border-emerald-500 text-emerald-500'}`}>
                                        {prensence === 'accepted' && 'Confirmado'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2">
                        <CalendarCheck className="size-10 text-muted-foreground/40" />

                        <p className="text-sm text-muted-foreground">
                            Nenhum evento encontrado
                        </p>
                    </div>
                )}

                {/* FOOTER FIXO */}
                <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => window.open("https://outlook.office.com/calendar/view/month", "_black")}
                >
                    <Calendar className="size-4" />
                    Ver Calendário Completo
                    <ChevronRight className="ml-auto size-4" />
                </Button>
            </CardContent>
        </Card>
    );
}