import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
} from "@/components/ui/drawer";
import {
    ArrowLeftIcon,
    CheckCircle2,
    CircleDashed,
    CircleX,
    Clock3,
    Coffee,
    Moon,
    Plane,
    MapPin,
    Timer,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import type { Presence } from "./availability-component";

/* ---------------- STATUS ---------------- */

const statusMap = {
    Available: { label: "Disponível", color: "bg-emerald-500", icon: CheckCircle2 },
    AvailableIdle: { label: "Inativo", color: "bg-emerald-400", icon: Coffee },
    Busy: { label: "Ocupado", color: "bg-red-500", icon: CircleX },
    BusyIdle: { label: "Ocupado", color: "bg-red-400", icon: Clock3 },
    Away: { label: "Ausente", color: "bg-amber-500", icon: Plane },
    BeRightBack: { label: "Volto já", color: "bg-yellow-500", icon: Coffee },
    DoNotDisturb: { label: "Não perturbe", color: "bg-red-700", icon: CircleX },
    Offline: { label: "Offline", color: "bg-gray-500", icon: Moon },
    PresenceUnknown: { label: "Desconhecido", color: "bg-gray-400", icon: CircleDashed },
} as const;

/* ---------------- TYPES ---------------- */

export interface UserAvailability {
    name: string;
    logo: string | null;
    presence: Presence;
    scheduleItems: {
        subject?: string;
        location?: string;
        status?: string;
        start: { dateTime: string };
        end: { dateTime: string };
    }[];
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userAvailability: UserAvailability | null;
}

interface Block {
    type: "free" | "busy";
    title: string;
    location?: string;
    start: Date;
    end: Date;
}

/* ---------------- HELPERS ---------------- */

const toDate = (d: string) =>
    new Date(new Date(d).getTime() - 3 * 60 * 60 * 1000);

const time = (d: Date) =>
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

const duration = (a: Date, b: Date) =>
    Math.round((b.getTime() - a.getTime()) / 60000);

/* ---------------- BUILD ---------------- */

function build(items: UserAvailability["scheduleItems"]): Block[] {
    const startDay = new Date();
    startDay.setHours(8, 0, 0, 0);

    const endDay = new Date();
    endDay.setHours(18, 0, 0, 0);

    const sorted = [...items].sort(
        (a, b) =>
            new Date(a.start.dateTime).getTime() -
            new Date(b.start.dateTime).getTime()
    );

    const out: Block[] = [];
    let cursor = startDay;

    for (const i of sorted) {
        const start = toDate(i.start.dateTime);
        const end = toDate(i.end.dateTime);

        if (cursor < start) {
            out.push({
                type: "free",
                title: "Janela livre",
                start: cursor,
                end: start,
            });
        }

        out.push({
            type: "busy",
            title: i.subject || "Compromisso",
            location: i.location,
            start,
            end,
        });

        cursor = end;
    }

    if (cursor < endDay) {
        out.push({
            type: "free",
            title: "Janela livre",
            start: cursor,
            end: endDay,
        });
    }

    return out;
}

/* ---------------- COMPONENT ---------------- */

export function DrawerAvailabilityContent({
    open,
    onOpenChange,
    userAvailability,
}: Props) {
    if (!userAvailability) return null;

    const status =
        statusMap[
        userAvailability.presence.availability as keyof typeof statusMap
        ] ?? statusMap.PresenceUnknown;

    const StatusIcon = status.icon;

    const blocks = useMemo(
        () => build(userAvailability.scheduleItems),
        [userAvailability]
    );

    const totalBusy = blocks
        .filter(b => b.type === "busy")
        .reduce((acc, b) => acc + duration(b.start, b.end), 0);

    const totalFree = blocks
        .filter(b => b.type === "free")
        .reduce((acc, b) => acc + duration(b.start, b.end), 0);

    const currentIndex = blocks.findIndex(b => {
        const now = new Date();
        return now >= b.start && now <= b.end;
    });

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="max-w-xl ml-auto overflow-y-scroll sidebar-scroll">
                <DrawerHeader className="flex flex-col items-start space-y-0 gap-1">
                    <DrawerClose asChild>
                        <Button variant="link" className="text-muted-foreground">
                            <ArrowLeftIcon /> Voltar
                        </Button>
                    </DrawerClose>

                    <div className="w-full flex items-center gap-3 border-b border-border p-4">
                        <Avatar className="h-14 w-14">
                            <AvatarImage src={userAvailability.logo ?? ""} />
                            <AvatarFallback>
                                {userAvailability.name
                                    .split(" ")
                                    .slice(0, 2)
                                    .map(n => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                            <span className="text-[.9rem] font-semibold">
                                {userAvailability.name}
                            </span>

                            <span className="text-[.75rem] text-muted-foreground">
                                {userAvailability.presence.roleDescription}
                            </span>

                            <span className="mt-1 flex items-center gap-1 text-[.75rem]">
                                <StatusIcon className="size-3" />
                                {status.label}
                            </span>
                        </div>
                    </div>
                </DrawerHeader>

                {/* BODY */}
                <div className="px-5 pb-6 space-y-6">

                    {/* META BAR (mais denso, estilo SaaS real) */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{blocks.length} blocos no dia</span>

                        <span className="flex items-center gap-4">
                            <span>Ocupado: {totalBusy}min</span>
                            <span>Livre: {totalFree}min</span>
                        </span>
                    </div>

                    {/* TIMELINE */}
                    <div className="space-y-3">

                        {blocks.map((b, i) => {
                            const isActive = i === currentIndex;

                            return (
                                <div key={i} className="flex gap-4">

                                    {/* TIME */}
                                    <div className="w-20 text-right shrink-0">
                                        <p className={`text-xs font-medium ${isActive ? "text-primary" : ""}`}>
                                            {time(b.start)}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {time(b.end)}
                                        </p>
                                    </div>

                                    {/* LINE */}
                                    <div className="relative flex flex-col items-center">
                                        <div
                                            className={`h-2.5 w-2.5 rounded-full ${b.type === "free"
                                                ? "bg-emerald-500"
                                                : "bg-red-500"
                                                } ${isActive ? "scale-125 ring-4 ring-muted" : ""}`}
                                        />
                                        {i !== blocks.length - 1 && (
                                            <div className="w-px flex-1 bg-border mt-1" />
                                        )}
                                    </div>

                                    {/* CARD */}
                                    <Card className={`flex-1 p-4 transition ${isActive ? "border-primary/40 bg-muted/30" : "border-muted/40"}`}>

                                        <div className="flex items-start justify-between">

                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">
                                                    {b.title}
                                                </p>

                                                {/* EXTRA INFO (agora mais rica) */}
                                                <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">

                                                    <span className="flex items-center gap-1">
                                                        <Timer className="size-3" />
                                                        {duration(b.start, b.end)}min
                                                    </span>

                                                    {b.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="size-3" />
                                                            {b.location}
                                                        </span>
                                                    )}

                                                    <span>
                                                        {b.type === "free"
                                                            ? "Disponível"
                                                            : "Ocupado"}
                                                    </span>

                                                </div>
                                            </div>

                                        </div>

                                    </Card>

                                </div>
                            );
                        })}

                    </div>

                </div>
            </DrawerContent>
        </Drawer>
    );
}