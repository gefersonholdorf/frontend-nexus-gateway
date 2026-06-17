import { formatEventDate } from "@/lib/format-event-date";
import {
    ArrowRight,
    CalendarClock,
    Clock,
    MapPin,
    Video,
    Rocket,
    Users
} from "lucide-react";

import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

interface Event {
    id: string;
    title: string;
    dateInit: Date;
    dateFinish: Date;
    type: "DEPLOYMENT" | "MEETING";
}

const events: Event[] = [
    {
        id: "1",
        title: "Reunião de Planejamento",
        dateInit: new Date("2024-06-20T10:00:00"),
        dateFinish: new Date("2024-06-20T11:00:00"),
        type: "MEETING"
    },
    {
        id: "2",
        title: "Deploy da Versão 2.0",
        dateInit: new Date("2024-06-21T14:00:00"),
        dateFinish: new Date("2024-06-21T15:00:00"),
        type: "DEPLOYMENT"
    },
    {
        id: "3",
        title: "Deploy Hotfix Produção",
        dateInit: new Date("2024-06-22T18:00:00"),
        dateFinish: new Date("2024-06-22T19:00:00"),
        type: "DEPLOYMENT"
    },
    {
        id: "4",
        title: "Alinhamento com Produto",
        dateInit: new Date("2024-06-23T09:00:00"),
        dateFinish: new Date("2024-06-23T10:00:00"),
        type: "MEETING"
    }
];

function getIcon(type: Event["type"]) {
    switch (type) {
        case "DEPLOYMENT":
            return <Rocket className="size-4 text-emerald-500" />;
        case "MEETING":
            return <Users className="size-4 text-blue-500" />;
        default:
            return <Video className="size-4 text-muted-foreground" />;
    }
}

function getBadge(type: Event["type"]) {
    if (type === "DEPLOYMENT") {
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    }
    return "bg-blue-500/10 text-blue-600 border-blue-500/20";
}

export function EventsOverviewComponent() {
    return (
        <Card
            className="
                h-145
                flex
                flex-col
                rounded-3xl
                border-border/50
                bg-(image:--background-gradient)
                shadow-xl
                overflow-hidden
            "
        >
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-primary/20
                                bg-primary/10
                            "
                        >
                            <CalendarClock className="size-5 text-primary" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold tracking-tight">
                                Próximos Eventos
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Agenda e atividades programadas da equipe
                            </p>
                        </div>
                    </div>

                    <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                    >
                        {events.length} agendados
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="flex h-full flex-col">
                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="space-y-3">
                        {events.map((event) => {
                            const isDeployment = event.type === "DEPLOYMENT";

                            const day = event.dateInit.getDate();
                            const month = event.dateInit.toLocaleString(
                                "pt-BR",
                                { month: "short" }
                            );

                            return (
                                <div
                                    key={event.id}
                                    className="
                                        group
                                        flex
                                        gap-4
                                        rounded-2xl
                                        border
                                        border-border/50
                                        bg-background/40
                                        p-4
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-primary/30
                                        hover:bg-background/70
                                        hover:shadow-lg
                                    "
                                >
                                    {/* DATE BLOCK */}
                                    <div
                                        className="
                                            flex
                                            w-14
                                            flex-col
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            border-border
                                            bg-background
                                            py-2
                                        "
                                    >
                                        <span className="text-lg font-semibold leading-none">
                                            {day}
                                        </span>
                                        <span className="text-xs text-muted-foreground uppercase">
                                            {month}
                                        </span>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-semibold leading-tight">
                                                    {event.title}
                                                </h3>

                                                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="size-3.5" />
                                                        {formatEventDate(
                                                            event.dateInit,
                                                            event.dateFinish
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="size-3.5" />
                                                        Online (Teams)
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {getIcon(event.type)}

                                                <Badge
                                                    variant="outline"
                                                    className={getBadge(
                                                        event.type
                                                    )}
                                                >
                                                    {isDeployment
                                                        ? "Deploy"
                                                        : "Reunião"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* FOOTER ACTION */}
                <div className="pt-6">
                    <button
                        className="
                            group
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            border
                            border-border
                            bg-background/50
                            py-3
                            text-sm
                            font-medium
                            transition-all
                            duration-300
                            hover:border-primary/30
                            hover:bg-primary/5
                            hover:shadow-md
                        "
                    >
                        Ver calendário completo

                        <ArrowRight
                            size={16}
                            className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
                        />
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}