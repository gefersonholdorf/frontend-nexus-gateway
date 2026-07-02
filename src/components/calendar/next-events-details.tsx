import { useGetNextEvents } from "@/api/calendar/get-next-events-by-user";
import { useUser } from "@/contexts/user-context";
import { cn } from "@/lib/utils";
import { format, formatDate, isToday, isYesterday, subHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarCheck, CalendarClock, Pin, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
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

export function NextEventsDetails() {
    const { user } = useUser()
    const now = new Date()
    const nextWeek = new Date()

    nextWeek.setDate(now.getDate() + 7)
    const { data, isLoading } = useGetNextEvents({
        startDate: now.toISOString(),
        endDate: nextWeek.toISOString()
    })

    if (isLoading) {
        return (
            <Card className="h-110 p-0">
                <Skeleton className="h-full bg-gray-100" />
            </Card>
        );
    }

    if (!data) {
        return null;
    }


    return (
        <Card
            className="
        h-110 w-full rounded-2xl border border-border
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
                            Próximos Eventos
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Acompanhe seus próximos eventos
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="w-full flex-1 space-y-4 pt-2 pb-2 overflow-y-scroll sidebar-scroll">
                {data?.events?.length ? (
                    data.events.map((item) => (
                        <Card
                            key={item.id}
                            className={cn(
                                "w-full flex flex-row items-center justify-between gap-4 px-4 pt-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl bg-(image:--background-gradient) border border-border border-l-4",
                                item.organizer.email === user?.email && "border-l-emerald-500",
                                item.attendees.some(
                                    (a) => a.email === user?.email && a.response === "accepted"
                                ) && "border-l-emerald-500",
                                item.attendees.some(
                                    (a) => a.email === user?.email && a.response === "tentativelyAccepted"
                                ) && "border-l-amber-500",
                                item.attendees.some(
                                    (a) => a.email === user?.email && a.response === "declined"
                                ) && "border-l-red-500",
                                item.attendees.some(
                                    (a) =>
                                        a.email === user?.email &&
                                        ["none", "notResponded"].includes(a.response)
                                ) && "border-l-amber-600"
                            )}
                        >
                            <div className="flex flex-row items-center gap-4">
                                <div className="flex flex-col items-center pr-4 text-primary-text border-r-2 border-border">
                                    <span className="text-[.8rem] font-medium">{formatDate(item.startAt, "MMM", { locale: ptBR }).toUpperCase()}</span>
                                    <span className="text-[1.3rem] font-bold">{formatDate(item.startAt, "dd", { locale: ptBR }).toUpperCase()}</span>
                                    <span className="text-[.8rem]">{formatDate(subHours(new Date(item.startAt), 3), "HH:mm")}</span>
                                </div>
                                <div className="col-span-2 flex flex-col gap-3">
                                    <span className="font-semibold text-primary-text">
                                        {item.title}
                                    </span>

                                    <div className="flex flex-wrap items-start gap-4">
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
                                                        <Avatar
                                                            className={cn(
                                                                "h-8 w-8 bg-background",
                                                            )}
                                                        >
                                                            <AvatarImage
                                                                src={a.logo ?? ""}
                                                            />
                                                            <AvatarFallback>
                                                                {a.name[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </TooltipTrigger>

                                                    <TooltipContent>
                                                        <span>
                                                            {a.name}
                                                        </span>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}

                                            {item.attendees.length > 4 && (
                                                <AvatarGroupCount className="bg-card border border-border">
                                                    +{item.attendees.length - 4}
                                                </AvatarGroupCount>
                                            )}
                                        </AvatarGroup>

                                        {item.attendees.length <= 1 ? (
                                            <div className="flex items-center gap-1 text-[.8rem] text-muted-foreground">
                                                <span className="max-w-80 line-clamp-2">
                                                    Organizado por{" "}
                                                    <span className="font-semibold text-primary-text">
                                                        {item.organizer.name}
                                                    </span>
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-[.8rem] text-muted-foreground">
                                                <span className="max-w-70 line-clamp-2">
                                                    Organizado por{" "}
                                                    <span className="font-semibold text-primary-text">
                                                        {item.organizer.name}
                                                    </span>{" "}
                                                    e mais {item.attendees.length - 1} participantes
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="self-stretch flex flex-col justify-between items-end">
                                <div className="flex flex-col justify-between items-end self-stretch">
                                    {
                                        (
                                            item.organizer.email === user?.email ||
                                            item.attendees.some(
                                                (a) =>
                                                    a.email === user?.email &&
                                                    a.response === "accepted"
                                            )
                                        ) ? (
                                            <Badge className="bg-emerald-500/10 text-emerald-600 text-[.8rem] font-medium px-2 py-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="font-medium">Presença Confirmada</span>
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-amber-500/10 text-amber-500 text-[.8rem] font-medium px-2 py-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                <span className="font-medium">Aguardando sua Confirmação</span>
                                            </Badge>
                                        )
                                    }
                                </div>
                                <Button
                                    className="w-full flex items-center justify-end text-muted-foreground cursor-pointer p-0 hover:text-primary"
                                    variant="link"
                                >
                                    <Video />
                                    Acessar Reunião
                                </Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                        <CalendarCheck className="size-8 text-muted-foreground/50" />

                        <p className="text-sm font-medium text-muted-foreground">
                            Nenhuma evento encontrado
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}