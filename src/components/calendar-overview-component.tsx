import { formatEventDate } from "@/lib/format-event-date";
import {
    CalendarCog,
    Clock,
    MapPin,
    Rocket,
    SquareArrowOutUpRight,
    User,
    Users,
    Video,
    VideoIcon
} from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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

export function CalendarOverviewComponent() {
    return (
        <Card
            className="
                h-165
                flex
                flex-col
                rounded-3xl
                border-border
                bg-(image:--background-gradient)
                shadow-lg
                transition-all
                duration-300
                hover:shadow-xl
                overflow-hidden
            "
        >
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary bg-background/10">
                            <CalendarCog className="size-5 text-primary" />
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-primary-text">
                                Calendário Compartilhado
                            </h3>

                            <p className="text-xs text-muted-foreground">
                                Confira o calendário compartilhado da Lusati
                            </p>
                        </div>
                    </div>
                    <div>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="flex gap-1 items-center cursor-pointer group" onClick={() => window.open('https://glpi.lusati.com.br/front/ticket.php', "_blank")}>
                                    <span className="text-muted-foreground text-[.7rem] group-hover:text-primary/80">Ver Calendário Completo</span>
                                    <SquareArrowOutUpRight className="size-3 text-muted-foreground cursor-pointer group-hover:text-primary/80" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Acesse o módulo de calendário compartilhado da Lusati</span>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex h-full flex-col">
                <div className="flex-1 overflow-y-auto px-4">
                    <div className="space-y-3">
                        {events.map((event) => {

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
                                        rounded-lg
                                        border
                                        border-border
                                        bg-background/40
                                        p-4
                                        hover:bg-background/70
                                        transition-all
                                        duration-300
                                        hover:shadow-sm
                                        overflow-hidden hover:scale-[1.01]
                                    "
                                >
                                    {/* DATE BLOCK */}
                                    <div
                                        className="flex w-14 flex-col items-center justify-center rounded-xl bg-background py-2"
                                    >
                                        <span className="text-lg font-bold leading-none">
                                            {day}
                                        </span>
                                        <span className="text-xs text-muted-foreground uppercase">
                                            {month}
                                        </span>
                                        <span className="text-[.8rem] text-muted-foreground uppercase">1H</span>
                                    </div>

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
                                                        <Users className="size-3.5" />
                                                        8 participantes
                                                    </div>
                                                </div>

                                                {/* <div className="flex flex-row flex-wrap items-center gap-6 md:gap-12">
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
                                                </div> */}

                                                <div className="mt-2 flex items-center flex-wrap gap-1 text-xs text-muted-foreground">
                                                    <User className="size-3.5" />
                                                    Geferson Holdorf
                                                </div>

                                                <div className="mt-2 flex items-center flex-wrap gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="size-3.5" />
                                                    Online (Teams)
                                                </div>
                                            </div>

                                            <Button className="cursor-pointer">
                                                <VideoIcon />
                                                Entrar na Reunião
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}