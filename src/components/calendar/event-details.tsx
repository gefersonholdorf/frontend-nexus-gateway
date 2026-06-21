import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { cn } from "@/lib/utils";
import {
    CircleAlert,
    CircleCheck,
    CircleX,
    Clock,
    MapPin,
    Users,
    Video,
    VideoIcon
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { Event } from "./drawer-events";
import { useState } from "react";


interface Props {
    event: Event;
}

function initials(name: string) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

/* ---------------- COMPONENT ---------------- */

export function EventDetails({ event }: Props) {
    const { user } = useUser()
    const [openAttendanceList, setOpenAttendanceList] = useState(false)
    const time = formatTime(event.startAt, event.endAt);
    const count = event.attendees.length;

    function handleOpenAttendanceList() {
        setOpenAttendanceList(!openAttendanceList)
    }

    function formatTime(startAt: string, endAt: string) {
        const start = new Date(startAt);
        const end = new Date(endAt);

        start.setHours(start.getHours() - 3);
        end.setHours(end.getHours() - 3);

        return `${start.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        })} – ${end.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    }

    const accepted = event.attendees.filter(
        attendee => attendee.response === "accepted"
    );

    const declined = event.attendees.filter(
        attendee => attendee.response === "declined"
    );

    const pending = event.attendees.filter(
        attendee =>
            attendee.response !== "accepted" &&
            attendee.response !== "declined"
    );

    return (
        <>
            <div className="group relative overflow-hidden rounded-lg border border-border bg-(image:--background-gradient) p-5 transition-all hover:shadow-lg hover:-translate-y-px">
                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1 text-muted-foreground text-[.75rem]">
                                    <Clock className="size-3.5" />
                                    {time}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground text-[.75rem]">
                                    <MapPin className="size-3.5" />
                                    {event.location}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                {event.isOnline && (
                                    <Badge
                                        className="bg-blue-500/10 text-blue-600 border border-border"
                                    >
                                        <Video className="size-3" />
                                        Online
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <h3 className="mt-2 text-[15px] font-semibold tracking-tight text-foreground truncate">
                            {event.title}
                        </h3>
                    </div>
                </div>

                <div className="mt-2 space-y-4">
                    <div className="flex flex-col justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-muted-foreground text-[.8rem]">
                                <Users className="size-3" />
                                <span>Organizado por</span>
                                <span className="text-primary-text font-medium">{event.organizer.name}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex -space-x-2 gap-6 items-center">
                                <AvatarGroup className="">
                                    {event.attendees.slice(0, 4).map((a) => (

                                        <Tooltip>
                                            <TooltipTrigger>
                                                <div className="relative">
                                                    <Avatar
                                                        key={a.email}
                                                        className={cn(
                                                            "h-8 w-8 flex items-center justify-center p-[.10rem]",
                                                            a.response === "accepted" &&
                                                            "bg-emerald-500",
                                                            a.response === "declined" &&
                                                            "bg-red-500",
                                                            a.response === "tentativelyAccepted" &&
                                                            "bg-amber-500",
                                                            a.response === "notResponded" &&
                                                            "bg-gray-400",
                                                            a.response === "none" &&
                                                            "bg-gray-500",
                                                        )}
                                                    >
                                                        <AvatarImage src={`${a.logo}`} alt="@shadcn" />
                                                        <AvatarFallback>{initials(a.name)}</AvatarFallback>
                                                    </Avatar>

                                                    <div
                                                        className={cn(
                                                            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                                            a.response === "accepted" &&
                                                            "bg-emerald-500",
                                                            a.response === "declined" &&
                                                            "bg-red-500",
                                                            a.response === "tentativelyAccepted" &&
                                                            "bg-amber-500",
                                                            a.response === "notResponded" &&
                                                            "bg-gray-400",
                                                            a.response === "none" &&
                                                            "bg-gray-500",
                                                        )}
                                                    />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>
                                                    {a.name} -
                                                    {a.response === 'none' && ' Não respondeu'}
                                                    {a.response === 'accepted' && ' Aceitou'}
                                                    {a.response === 'declined' && ' Recusou'}
                                                </span>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}

                                    {count > 4 && (
                                        <AvatarGroupCount className="bg-card">+{count - 4}</AvatarGroupCount>
                                    )}
                                </AvatarGroup>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <span
                                            onClick={handleOpenAttendanceList}
                                            className="text-[.7rem] text-muted-foreground hover:text-primary cursor-pointer">{event.attendees.length} Participantes</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span>
                                            Ver Lista de Presença
                                        </span>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            {event.attendees.find((attendee) => attendee.email === user?.email && (attendee.response === 'accepted' || attendee.response === 'declined')) && (<Button
                                size="sm"
                                className="rounded-full px-4 cursor-pointer"
                                onClick={() => window.open(event.webLink, "_blank")}
                            >
                                <VideoIcon />
                                Entrar na Reunião
                            </Button>)}
                        </div>
                        {/* <div className="flex gap-4">
                        {event.attendees.find((attendee) => attendee.email === user?.email && (attendee.response !== 'accepted' && attendee.response !== 'declined')) && (
                            <Button className="bg-emerald-500 hover:bg-emerald-400">
                                <CheckCircle />
                                Confirmar Presença
                            </Button>
                        )}
                        {event.attendees.find((attendee) => attendee.email === user?.email && (attendee.response !== 'accepted' && attendee.response !== 'declined')) && (
                            <Button className="bg-red-500 hover:bg-red-400">
                                <XCircle />
                                Recusar Presença
                            </Button>
                        )}
                    </div> */}

                    </div>
                </div>
                {openAttendanceList && (
                    <div className="mt-4 rounded-xl border border-border bg-(image:--background-gradient) p-4">

                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">
                                    Lista de Presença
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {event.attendees.length} participantes
                                </p>
                            </div>
                        </div>

                        {accepted.length > 0 && (
                            <div className="mb-6">
                                <div className="mb-3 flex items-center gap-2 text-emerald-400">
                                    <CircleCheck className="size-4" />
                                    <span className="font-medium">
                                        Confirmados ({accepted.length})
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {accepted.map((attendee) => (
                                        <AttendanceItem
                                            key={attendee.email}
                                            attendee={attendee}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {pending.length > 0 && (
                            <div className="mb-6">
                                <div className="mb-3 flex items-center gap-2 text-amber-400">
                                    <CircleAlert className="size-4" />
                                    <span className="font-medium">
                                        Pendentes ({pending.length})
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {pending.map((attendee) => (
                                        <AttendanceItem
                                            key={attendee.email}
                                            attendee={attendee}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {declined.length > 0 && (
                            <div>
                                <div className="mb-3 flex items-center gap-2 text-red-400">
                                    <CircleX className="size-4" />
                                    <span className="font-medium">
                                        Recusados ({declined.length})
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {declined.map((attendee) => (
                                        <AttendanceItem
                                            key={attendee.email}
                                            attendee={attendee}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div >

        </>
    );
}

type Attendee = Event["attendees"][number];

function AttendanceItem({ attendee }: { attendee: Attendee }) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-3 transition-colors hover:bg-background/70">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={attendee.logo ?? ""} />
                    <AvatarFallback>
                        {initials(attendee.name)}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <p className="text-sm font-medium">
                        {attendee.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        {attendee.email}
                    </p>
                </div>
            </div>

            <Badge
                variant="outline"
                className={
                    attendee.response === "accepted"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : attendee.response === "declined"
                            ? "border-red-500/30 bg-red-500/10 text-red-400"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                }
            >
                {attendee.response === "accepted" && "Confirmado"}
                {attendee.response === "declined" && "Recusado"}
                {attendee.response !== "accepted" &&
                    attendee.response !== "declined" &&
                    "Pendente"}
            </Badge>
        </div>
    );
}