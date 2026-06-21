import { useGetEventsWaitingConfirm } from "@/api/calendar/get-events-waiting-confirm";
import { useUser } from "@/contexts/user-context";
import { format, formatDate, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, CalendarCheck, Video } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

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
    const { data, isLoading, isError } = useGetEventsWaitingConfirm()
    const { user } = useUser()

    if (isLoading) {
        return (
            <Card className="h-52 p-0">
                <Skeleton className="h-full bg-gray-100" />
            </Card>
        );
    }

    if (isError) {
        return null;
    }
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
                            Confira seus próximos eventos
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
                {data && data.events.length ? (
                    data.events.map((item) => (
                        <Card
                            key={item.id}
                            className="flex items-start gap-2 p-4 space-y-1 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl bg-(image:--background-gradient) border border-border"
                        >
                            <div className="flex items-start gap-2">
                                <div className="flex flex-col items-start justify-start">
                                    <div className="bg-card/10 px-3 py-1 rounded-sm border border-border flex flex-col items-center justify-center">
                                        <span className="text-primary-text font-semibold">{formatDate(new Date(item.startAt), "MMMM", {
                                            locale: ptBR,
                                        }).replace(/^./, (char) => char.toUpperCase()).slice(0, 3)}</span>
                                        <span className="text-primary-text font-semibold">{formatDate(new Date(item.startAt), 'dd')}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-primary-text font-semibold">{item.title}</span>
                                    <span className="text-muted-foreground text-[.8rem]">{formatDate(new Date(item.startAt), "HH:mm")} - {formatDate(new Date(item.endAt), "HH:mm")}</span>
                                </div>
                            </div>
                            {item.attendees.map((attendee) => {
                                const findUser = attendee.email === user?.email

                                if (!findUser) {
                                    return
                                }

                                return attendee.response === 'accepted' ? (
                                    <Button
                                        className="w-full cursor-pointer"
                                        onClick={() => window.open(`${item.webLink}`)}
                                    >
                                        <Video />
                                        Entrar na Reunião
                                    </Button>) : (
                                    <div className="w-full flex items-center gap-2 justify-center px-2 rounded-sm py-1 border border-border bg-transparent">
                                        <AlertCircle className="size-3.5" />
                                        <span className="text-muted-foreground text-[.8rem]">Aguardando Confirmação de Presença</span>
                                    </div>
                                )
                            })}
                        </Card>
                    ))
                ) : (
                    <div className="flex h-28 flex-col items-center justify-center gap-2 text-center">
                        <CalendarCheck className="size-8 text-muted-foreground/50" />
                        <p className="text-sm font-medium text-muted-foreground">
                            Nenhum evento encontrado
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}