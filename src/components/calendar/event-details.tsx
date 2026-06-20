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
    CheckCircle,
    Clock,
    MapPin,
    User,
    Users,
    Video,
    VideoIcon,
    XCircle
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { Event } from "./drawer-events";


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
    const time = formatTime(event.startAt, event.endAt);
    const count = event.attendees.length;

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

    return (
        <div className="group relative overflow-hidden rounded-sm border border-border bg-linear-to-b from-background to-muted/30 p-5 transition-all hover:shadow-lg hover:-translate-y-px">
            <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-muted-foreground text-[.75rem]">
                            <Clock className="size-3.5" />
                            {time}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground text-[.75rem]">
                            <MapPin className="size-3.5" />
                            {event.location}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {event.isOnline ? (
                                <Badge
                                    className="bg-blue-500/10 text-blue-600 border border-border"
                                >
                                    <Video className="size-3" />
                                    Online
                                </Badge>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <MapPin className="size-3.5" />
                                    Presencial
                                </span>
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
                        <div className="flex items-center gap-2">
                            <Avatar
                                className={cn(
                                    "h-10 w-10 flex items-center justify-center",
                                )}
                            >
                                <AvatarImage src={`${event.organizer.logo}`} alt="@shadcn" />
                                <AvatarFallback>{initials(event.organizer.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-[.8rem] text-primary-text font-semibold">{event.organizer.name}</span>
                                <span className="truncate text-[.8rem] text-muted-foreground">Organizador</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex -space-x-2">
                            <AvatarGroup className="">
                                {event.attendees.slice(0, 4).map((a) => (

                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="relative">
                                                <Avatar
                                                    key={a.email}
                                                    className={cn(
                                                        "h-9 w-9 flex items-center justify-center p-[.10rem]",
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
                        </div>
                    </div>
                    {/* ACTION */}
                    {event.attendees.find((attendee) => attendee.email === user?.email && (attendee.response === 'accepted' || attendee.response === 'declined')) && (<Button
                        size="sm"
                        className="rounded-full px-4 shadow-sm text-primary bg-card"
                        onClick={() => window.open(event.webLink, "_blank")}
                    >
                        <VideoIcon />
                        Entrar na Reunião
                    </Button>)}
                    <div className="flex gap-4">
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
                    </div>
                </div>
            </div>
        </div >
    );
}