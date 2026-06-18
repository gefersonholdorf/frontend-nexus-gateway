import {
    ArrowRight,
    Calendar,
    Calendars,
    Clock3,
    Rocket,
    Users
} from "lucide-react";

import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";

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
        title: "Reunião de Planejamento Estratégico",
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
        dateInit: new Date("2024-06-21T18:00:00"),
        dateFinish: new Date("2024-06-21T19:00:00"),
        type: "DEPLOYMENT"
    }
];

export function AnnouncementsComponent() {
    return (
        <Card
            className="
                h-150
                overflow-hidden
                rounded-3xl
                border-border/50
                bg-(image:--background-gradient)
                backdrop-blur-xl
                shadow-xl
            "
        >
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary bg-background/10">
                            <Calendars className="size-5 text-primary" />
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-primary-text">
                                Comunicados
                            </h3>

                            <p className="text-xs text-muted-foreground">
                                Confira os comunicados da Lusati
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex h-full flex-col">
                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="relative">
                        <div
                            className="
                                absolute
                                left-6
                                top-0
                                bottom-0
                                w-px
                                bg-border
                            "
                        />

                        <div className="space-y-4">
                            {events.map((event) => {
                                const isDeployment =
                                    event.type === "DEPLOYMENT";

                                return (
                                    <div
                                        key={event.id}
                                        className="
                                            group
                                            relative
                                            ml-2
                                            flex
                                            gap-4
                                        "
                                    >
                                        <div
                                            className="
                                                z-10
                                                mt-4
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-background
                                                bg-card
                                                shadow-md
                                            "
                                        >
                                            {isDeployment ? (
                                                <Rocket className="size-4 text-emerald-500" />
                                            ) : (
                                                <Users className="size-4 text-blue-500" />
                                            )}
                                        </div>

                                        <div
                                            className="
                                                flex-1
                                                rounded-sm
                                                border-2
                                                border-border/50
                                                bg-background/40
                                                p-4
                                                transition-all
                                                duration-300
                                                hover:border-primary/30
                                                hover:bg-background/70
                                                hover:shadow-lg
                                            "
                                        >
                                            <div className="mb-3 flex items-start justify-between gap-3">
                                                <div>
                                                    <h3
                                                        className="
                                                            font-semibold
                                                            leading-none
                                                        "
                                                    >
                                                        {event.title}
                                                    </h3>

                                                    <p
                                                        className="
                                                            mt-2
                                                            text-sm
                                                            text-muted-foreground
                                                            line-clamp-2
                                                        "
                                                    >
                                                        A partir de agosto,
                                                        todos os colaboradores
                                                        poderão aderir ao novo
                                                        plano de saúde com
                                                        cobertura ampliada para
                                                        dependentes e consultas
                                                        especializadas.
                                                    </p>
                                                </div>

                                                <Badge
                                                    className={
                                                        isDeployment
                                                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                            : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                                    }
                                                    variant="outline"
                                                >
                                                    {isDeployment
                                                        ? "Deploy"
                                                        : "Reunião"}
                                                </Badge>
                                            </div>

                                            <div
                                                className="
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-4
                                                    text-xs
                                                    text-muted-foreground
                                                "
                                            >
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="size-3.5" />
                                                    20 Jun 2024
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <Clock3 className="size-3.5" />
                                                    Há 40 minutos
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        className="
                            group
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-sm
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
                            cursor-pointer
                        "
                    >
                        Ver todos os comunicados

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