import { Clock, MapPin, User, Users, VideoIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "../ui/avatar";
import { formatEventDate } from "@/lib/format-event-date";
import type { Event } from "./drawer-events";

interface EventDetailsProps {
    event: Event
}

export function EventDetails({ event }: EventDetailsProps) {
    return (
        <div className="flex flex-col border border-border bg-card p-4 rounded-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold leading-tight">
                        {event.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="size-3.5" />
                            {formatEventDate(
                                new Date(event.startAt),
                                new Date(event.endAt)
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            <Users className="size-3.5" />
                            {event.attendees.length} Participantes
                        </div>
                    </div>

                    <div className="flex flex-row flex-wrap items-center gap-6 md:gap-12">
                        <Avatar>
                            <AvatarImage
                                src="https://github.com/shadcn.png"
                                alt="@shadcn"
                                className="grayscale"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Avatar>
                            <AvatarImage
                                src="https://github.com/evilrabbit.png"
                                alt="@evilrabbit"
                            />
                            <AvatarFallback>ER</AvatarFallback>
                            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                        </Avatar>
                        <AvatarGroup className="grayscale">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarImage
                                    src="https://github.com/maxleiter.png"
                                    alt="@maxleiter"
                                />
                                <AvatarFallback>LR</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarImage
                                    src="https://github.com/evilrabbit.png"
                                    alt="@evilrabbit"
                                />
                                <AvatarFallback>ER</AvatarFallback>
                            </Avatar>
                            <AvatarGroupCount>+3</AvatarGroupCount>
                        </AvatarGroup>
                    </div>

                    <div className="mt-2 flex items-center flex-wrap gap-1 text-xs text-muted-foreground">
                        <User className="size-3.5" />
                        {event.organizer.name}
                    </div>

                    <div className="mt-2 flex items-center flex-wrap gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3.5" />
                        {event.location}
                    </div>
                </div>

                <Button className="cursor-pointer">
                    <VideoIcon />
                    Entrar na Reunião
                </Button>
            </div>
        </div>
    )
}