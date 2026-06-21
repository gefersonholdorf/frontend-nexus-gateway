import { useGetEventsWaitingConfirm } from "@/api/calendar/get-events-waiting-confirm";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarCheck, CalendarClock, CircleCheck, CircleX, Clock, Pin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ConfirmEventModal } from "./modal/confirm-event-modal";

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

export function EventsWaitingConfirm() {
    const { data, isLoading, isError } = useGetEventsWaitingConfirm()

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
        <Card
            className="
        h-102 w-full rounded-2xl border border-border
        bg-(image:--background-gradient)
        shadow-lg transition-all duration-300 hover:shadow-xl
    "
        >
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary bg-background/10">
                        <CalendarClock className="size-5 text-primary" />
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-primary-text">
                            Pendências - Confirmação de Presença
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Eventos aguardando confirmação de presença
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4 overflow-y-auto sidebar-scroll">
                {data?.events?.length ? (
                    data.events.map((item) => (
                        <Card
                            key={item.id}
                            className="
                        grid grid-cols-1 lg:grid-cols-3
                        gap-4 p-4 rounded-lg
                        shadow-lg transition-all duration-300
                        hover:shadow-xl
                        bg-(image:--background-gradient)
                        border-l-2 border-blue-500
                    "
                        >
                            <div className="col-span-2 flex flex-col gap-3">
                                <span className="font-semibold text-primary-text">
                                    {item.title}
                                </span>

                                <div className="flex flex-wrap items-start gap-4">
                                    <div className="flex items-center gap-1 text-[.8rem] text-muted-foreground">
                                        <Clock className="size-3.5" />
                                        <span>
                                            {(
                                                item.startAt,
                                                item.endAt
                                            )}
                                        </span>
                                    </div>

                                    {item.location && (
                                        <div className="flex items-center gap-1 text-[.8rem] text-muted-foreground">
                                            <Pin className="size-3.5" />
                                            <span>{item.location}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start gap-4">
                                    <AvatarGroup>
                                        {item.attendees.slice(0, 4).map((a) => (
                                            <Tooltip key={a.email}>
                                                <TooltipTrigger asChild>
                                                    <div className="relative">
                                                        <Avatar
                                                            className={cn(
                                                                "h-8 w-8 p-[.10rem]",
                                                                a.response === "accepted" &&
                                                                "bg-emerald-500",
                                                                a.response === "declined" &&
                                                                "bg-red-500",
                                                                a.response ===
                                                                "tentativelyAccepted" &&
                                                                "bg-amber-500",
                                                                (a.response ===
                                                                    "notResponded" ||
                                                                    a.response ===
                                                                    "none") &&
                                                                "bg-gray-500"
                                                            )}
                                                        >
                                                            <AvatarImage
                                                                src={a.logo ?? ""}
                                                            />
                                                            <AvatarFallback>
                                                                {a.name[0]}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div
                                                            className={cn(
                                                                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                                                a.response ===
                                                                "accepted" &&
                                                                "bg-emerald-500",
                                                                a.response ===
                                                                "declined" &&
                                                                "bg-red-500",
                                                                a.response ===
                                                                "tentativelyAccepted" &&
                                                                "bg-amber-500",
                                                                (a.response ===
                                                                    "notResponded" ||
                                                                    a.response ===
                                                                    "none") &&
                                                                "bg-gray-500"
                                                            )}
                                                        />
                                                    </div>
                                                </TooltipTrigger>

                                                <TooltipContent>
                                                    <span>
                                                        {a.name} -
                                                        {a.response === "none" &&
                                                            " Não respondeu"}
                                                        {a.response === "accepted" &&
                                                            " Aceitou"}
                                                        {a.response === "declined" &&
                                                            " Recusou"}
                                                        {a.response ===
                                                            "tentativelyAccepted" &&
                                                            " Talvez"}
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}

                                        {item.attendees.length > 4 && (
                                            <AvatarGroupCount className="bg-card">
                                                +{item.attendees.length - 4}
                                            </AvatarGroupCount>
                                        )}
                                    </AvatarGroup>

                                    <div className="flex items-center gap-1 text-[.8rem] text-muted-foreground">
                                        <span className="max-w-50 line-clamp-2">
                                            Organizado por{" "}
                                            <span className="font-semibold text-primary-text">
                                                {item.organizer.name}
                                            </span>{" "}
                                            e mais {item.attendees.length} participantes
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 flex flex-col gap-3">
                                <ConfirmEventModal event={item}>
                                    <Button className="bg-emerald-500 hover:bg-emerald-600">
                                        <CircleCheck />
                                        Aceitar
                                    </Button>
                                </ConfirmEventModal>

                                <Button variant="outline">
                                    <CircleX />
                                    Recusar
                                </Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                        <CalendarCheck className="size-8 text-muted-foreground/50" />

                        <p className="text-sm font-medium text-muted-foreground">
                            Nenhuma pendência encontrada
                        </p>

                        <p className="text-xs text-muted-foreground/70">
                            Todos os convites foram respondidos.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}