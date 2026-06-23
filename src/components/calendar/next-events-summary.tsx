import { useGetNextEvents } from "@/api/calendar/get-next-events-by-user";
import {
    format,
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
                h-80
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
                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-primary/10
                        "
                    >
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

            <CardContent className="flex h-full flex-col gap-4">
                {data.events.length > 0 ? (
                    <>
                        {nextEvent ? (
                            <div
                                className="
                                    flex-1
                                    rounded-xl
                                    border
                                    p-4
                                    transition-colors
                                    hover:bg-muted/20
                                "
                            >
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

                                <h4
                                    className="
                                        line-clamp-2
                                        text-base
                                        font-semibold
                                        text-primary-text
                                    "
                                >
                                    {nextEvent.title}
                                </h4>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        text-muted-foreground
                                    "
                                >
                                    {formatDateEvent(
                                        nextEvent.startAt,
                                        nextEvent.endAt
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div
                                className="
                                    flex
                                    flex-1
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                "
                            >
                                <div className="text-center">
                                    <CalendarCheck className="mx-auto mb-2 size-8 text-muted-foreground/50" />

                                    <p className="text-sm text-muted-foreground">
                                        Nenhum próximo evento
                                    </p>
                                </div>
                            </div>
                        )}
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
                    className="mt-auto w-full"
                >
                    <Calendar className="size-4" />
                    Ver Agenda Completa
                    <ChevronRight className="ml-auto size-4" />
                </Button>
            </CardContent>
        </Card>
    );
}