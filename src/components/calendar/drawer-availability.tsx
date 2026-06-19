import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader
} from "@/components/ui/drawer";
import {
    ArrowLeftIcon,
    CheckCircle2,
    CircleCheck,
    CircleDashed,
    CircleX,
    Clock3,
    Coffee,
    Moon,
    Plane
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import type { Presence } from "./availability-component";


const availabilityConfig = {
    Available: {
        label: "Disponível",
        color: "bg-emerald-500",
        text: "text-emerald-500",
        icon: CheckCircle2,
    },

    AvailableIdle: {
        label: "Disponível (Inativo)",
        color: "bg-emerald-400",
        text: "text-emerald-400",
        icon: Coffee,
    },

    Busy: {
        label: "Ocupado",
        color: "bg-red-500",
        text: "text-red-500",
        icon: CircleX,
    },

    BusyIdle: {
        label: "Ocupado (Inativo)",
        color: "bg-red-400",
        text: "text-red-400",
        icon: Clock3,
    },

    Away: {
        label: "Ausente",
        color: "bg-amber-500",
        text: "text-amber-500",
        icon: Plane,
    },

    BeRightBack: {
        label: "Volto Já",
        color: "bg-yellow-500",
        text: "text-yellow-500",
        icon: Coffee,
    },

    DoNotDisturb: {
        label: "Não Perturbe",
        color: "bg-red-700",
        text: "text-red-700",
        icon: CircleX,
    },

    Offline: {
        label: "Offline",
        color: "bg-gray-500",
        text: "text-gray-500",
        icon: Moon,
    },

    PresenceUnknown: {
        label: "Desconhecido",
        color: "bg-gray-400",
        text: "text-gray-400",
        icon: CircleDashed,
    },
};

export interface UserAvailability {
    name: string;
    logo: string | null;
    presence: Presence
    scheduleId: string;
    availabilityView: string;
    scheduleItems: {
        status: string;
        subject?: string;
        location?: string;
        start: {
            dateTime: string;
            timeZone: string;
        };
        end: {
            dateTime: string;
            timeZone: string;
        };
    }[];
}

interface DrawerAvailabilityContentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userAvailability: UserAvailability | null;
}

interface AgendaItem {
    type: "free" | "busy";
    title: string;
    start: Date;
    end: Date;
    status?: string;
}

export function DrawerAvailabilityContent({
    open,
    onOpenChange,
    userAvailability,
}: DrawerAvailabilityContentProps) {
    if (!userAvailability) {
        return null;
    }

    const availability =
        availabilityConfig[
        userAvailability.presence.availability as keyof typeof availabilityConfig
        ] ?? availabilityConfig.PresenceUnknown;

    const StatusIcon = availability.icon;

    function formatHour(dateString: string) {
        return new Date(dateString).toLocaleTimeString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function duration(start: Date, end: Date) {
        const minutes =
            (end.getTime() - start.getTime()) / 1000 / 60;

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours && mins) {
            return `${hours}h${mins}min`;
        }

        if (hours) {
            return `${hours}h`;
        }

        return `${mins}min`;
    }

    function toBrazilDate(dateString: string) {
        const utcDate = new Date(dateString);

        return new Date(
            utcDate.getTime() - 3 * 60 * 60 * 1000
        );
    }

    function buildAgenda(): AgendaItem[] {
        const items: AgendaItem[] = [];

        const dayStart = new Date();
        dayStart.setHours(8, 0, 0, 0);

        const dayEnd = new Date();
        dayEnd.setHours(18, 0, 0, 0);

        const events = [...userAvailability!.scheduleItems].sort(
            (a, b) =>
                new Date(a.start.dateTime).getTime() -
                new Date(b.start.dateTime).getTime(),
        );

        let cursor = dayStart;

        for (const event of events) {
            const start = toBrazilDate(event.start.dateTime);
            const end = toBrazilDate(event.end.dateTime);

            if (cursor < start) {
                items.push({
                    type: "free",
                    title: "Horário livre",
                    start: new Date(cursor),
                    end: start,
                });
            }

            items.push({
                type: "busy",
                title: event.subject || "Compromisso",
                start,
                end,
                status: event.status,
            });

            cursor = end;
        }

        if (cursor < dayEnd) {
            items.push({
                type: "free",
                title: "Horário livre",
                start: cursor,
                end: dayEnd,
            });
        }

        return items;
    }

    const agenda = buildAgenda();

    const busyMinutes = agenda
        .filter((item) => item.type === "busy")
        .reduce(
            (acc, item) =>
                acc +
                (item.end.getTime() - item.start.getTime()) /
                1000 /
                60,
            0,
        );

    const freeMinutes = agenda
        .filter((item) => item.type === "free")
        .reduce(
            (acc, item) =>
                acc +
                (item.end.getTime() - item.start.getTime()) /
                1000 /
                60,
            0,
        );

    return (
        <Drawer
            direction="right"
            open={open}
            onOpenChange={onOpenChange}
        >
            <DrawerContent className="max-w-xl ml-auto">
                <DrawerHeader className="flex flex-col items-start space-y-0 gap-1">
                    <DrawerClose asChild>
                        <Button variant="link" className="text-muted-foreground">
                            <ArrowLeftIcon />Voltar
                        </Button>
                    </DrawerClose>
                    <div className="w-full flex items-center gap-3 border-b border-border p-4">
                        <div className="relative">
                            <Avatar className="h-14 w-14">
                                <AvatarImage
                                    src={userAvailability.logo ?? ""}
                                />
                                <AvatarFallback>
                                    {userAvailability.name
                                        .split(" ")
                                        .slice(0, 2)
                                        .map((v) => v[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>

                            <div
                                className={`
                                            absolute
                                            bottom-0
                                            right-0
                                            h-4
                                            w-4
                                            rounded-full
                                            border-2
                                            border-background
                                            ${availability.color}
                                        `}
                            />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[.85rem] font-semibold">
                                {userAvailability.name}
                            </span>

                            <span className="text-[.7rem] text-muted-foreground">
                                {userAvailability.presence.roleDescription}
                            </span>

                            <span className={`mt-1 flex items-center gap-1 text-[.75rem] ${availability.text}`}>
                                <StatusIcon className="size-3" />
                                {availability.label}
                            </span>
                        </div>
                    </div>
                </DrawerHeader>

                <div className="px-4 pb-4 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <Card className="p-4 text-center">
                            <div className="text-3xl font-bold">
                                {
                                    userAvailability.scheduleItems.length
                                }
                            </div>

                            <div className="text-xs text-muted-foreground">
                                Compromissos
                            </div>
                        </Card>

                        <Card className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-500">
                                {duration(
                                    new Date(0),
                                    new Date(
                                        busyMinutes * 60 * 1000,
                                    ),
                                )}
                            </div>

                            <div className="text-xs text-muted-foreground">
                                Ocupado
                            </div>
                        </Card>

                        <Card className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-500">
                                {duration(
                                    new Date(0),
                                    new Date(
                                        freeMinutes * 60 * 1000,
                                    ),
                                )}
                            </div>

                            <div className="text-xs text-muted-foreground">
                                Livre
                            </div>
                        </Card>
                    </div>

                    <span className="text-primary-text font-semibold">AGENDA DE HOJE - 19 DE JUNHO</span>

                    <div className="mt-2 space-y-4">
                        {agenda.map((item, index) => (
                            <Card
                                key={index}
                                className={`p-4 border border-border`}
                            >
                                <div className="flex gap-4">
                                    <div className="w-20">
                                        <p className="font-semibold text-sm">
                                            {formatHour(item.start.toISOString())}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {formatHour(item.end.toISOString())}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {duration(
                                                item.start,
                                                item.end,
                                            )}
                                        </p>
                                    </div>

                                    <div
                                        className={`w-1 rounded-full ${item.type === "free"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                            }`}
                                    />

                                    <div className="flex-1">
                                        <h3
                                            className={`flex gap-2 items-center font-medium ${item.type === "free"
                                                ? "text-green-600"
                                                : ""
                                                }`}
                                        >
                                            {item.type === "free" ? (<CircleCheck className="size-4" />) : (<CircleX className="size-4" />)}
                                            {item.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            {item.type === "free"
                                                ? "Disponível para reunião"
                                                : "Ocupado"}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}