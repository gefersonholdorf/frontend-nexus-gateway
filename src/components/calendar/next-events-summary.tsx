import { useGetNextEvents } from "@/api/calendar/get-next-events-by-user";
import { useUser } from "@/contexts/user-context";
import { format, formatDistanceToNowStrict, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, CalendarCheck, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

export function formatDateEvent(startDate: string, endDate: string) {
    const startDateForm = new Date(startDate);
    const endDateForm = new Date(endDate);

    if (isToday(startDateForm)) {
        return `Hoje, às ${format(startDateForm, "HH:mm")} - ${format(endDateForm, "HH:mm")}`;
    }

    if (isYesterday(startDateForm)) {
        return `Ontem, às ${format(startDateForm, "HH:mm")} - ${format(endDateForm, "HH:mm")}`;
    }

    return `${format(
        startDateForm,
        "dd 'de' MMMM, yyyy 'às' HH:mm",
        { locale: ptBR })} - ${format(endDateForm, "HH:mm")}`

}

export function NextEvents() {
    const now = new Date()
    const nextWeek = new Date()

    nextWeek.setDate(now.getDate() + 7)
    const { data, isLoading } = useGetNextEvents({
        startDate: now.toISOString(),
        endDate: nextWeek.toISOString()
    })

    const { user } = useUser()

    if (isLoading) {
        return (
            <Card className="h-52 p-0">
                <Skeleton className="h-full bg-gray-100" />
            </Card>
        );
    }

    if (!data) {
        return null;
    }

    const nextEvent = [...data.events]
        .sort(
            (a, b) =>
                new Date(a.startAt).getTime() -
                new Date(b.startAt).getTime()
        )
        .find(
            event =>
                new Date(event.startAt).getTime() > Date.now()
        );

    const timeUntilNextEvent = nextEvent
        ? formatDistanceToNowStrict(
            new Date(nextEvent.startAt),
            {
                locale: ptBR,
                roundingMethod: "floor",
            }
        )
        : null;

    return (
        <Card className="
                h-102 w-full rounded-2xl border border-border bg-(image:--background-gradient) shadow-lg transition-all duration-300 hover:shadow-xl
            "
        >
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary bg-background/10">
                        <CalendarCheck className="size-5 text-primary" />
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-primary-text">
                            Próximos Eventos
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Resumo dos seus próximos eventos
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 h-full pt-0 space-y-4 overflow-y-auto sidebar-scroll">
                {data && data.events.length > 0 ? (
                    <div className="border border-border rounded-sm bg-card p-4">
                        <div className="text-muted-foreground text-[.8rem] flex items-center gap-2">
                            <Clock className="size-4 text-primary" />
                            <span className="text-primary font-semibold text-center">
                                Próximo evento em {timeUntilNextEvent}
                            </span>
                        </div>
                        <span className="mt-1 line-clamp-1 truncate text-center">{data.events[0].title}</span>
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                        <CalendarCheck className="size-8 text-muted-foreground/50" />
                        <p className="text-sm font-medium text-muted-foreground">
                            Nenhum evento encontrado
                        </p>
                    </div>
                )}
                <Button className="w-full">
                    <Calendar />
                    Ver Agenda Completa
                </Button>
            </CardContent>
        </Card>
    )
}