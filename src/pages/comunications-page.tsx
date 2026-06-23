import { useQuery } from "@tanstack/react-query";
import {
    Calendar,
    Clock3,
    Megaphone,
    Pencil,
    Plus,
    Rocket,
    Send,
    Trash2,
    Users
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type EventType = "DEPLOYMENT" | "MEETING" | "GENERAL";

interface Announcement {
    id: string;
    title: string;
    description: string;
    dateInit: Date;
    type: EventType;
    status: "DRAFT" | "PUBLISHED";
}

const mockFetch = async (): Promise<Announcement[]> => {
    return [
        {
            id: "1",
            title: "Deploy versão 2.1 em produção",
            description: "Atualização crítica com melhorias de performance e segurança.",
            dateInit: new Date(),
            type: "DEPLOYMENT",
            status: "PUBLISHED"
        },
        {
            id: "2",
            title: "Reunião de alinhamento técnico",
            description: "Definição de roadmap do próximo trimestre.",
            dateInit: new Date(),
            type: "MEETING",
            status: "DRAFT"
        },
        {
            id: "3",
            title: "Manutenção programada",
            description: "Janela de manutenção para atualização de infraestrutura.",
            dateInit: new Date(),
            type: "GENERAL",
            status: "PUBLISHED"
        }
    ];
};

export function CommunicationsPage() {
    const [filter, setFilter] = useState<EventType | "ALL">("ALL");

    const query = useQuery({
        queryKey: ["communications"],
        queryFn: mockFetch,
        refetchInterval: 30000
    });

    if (query.isLoading) {
        return (
            <Card className="h-96">
                <Skeleton className="h-full" />
            </Card>
        );
    }

    if (!query.data) return null;

    const filtered = query.data.filter((item) =>
        filter === "ALL" ? true : item.type === filter
    );

    return (
        <div className="min-h-screen bg-background px-10 py-6 space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md border flex items-center justify-center bg-primary/10">
                        <Megaphone className="text-primary size-5" />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold">Comunicações</h1>
                        <p className="text-muted-foreground text-sm">
                            Gerencie comunicados internos, deploys e avisos da organização.
                        </p>
                    </div>
                </div>

                <Button className="gap-2">
                    <Plus className="size-4" />
                    Novo comunicado
                </Button>
            </div>

            {/* FILTERS */}
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
                <TabsList variant="line">
                    <TabsTrigger value="ALL">Todos</TabsTrigger>
                    <TabsTrigger value="DEPLOYMENT">Deploys</TabsTrigger>
                    <TabsTrigger value="MEETING">Reuniões</TabsTrigger>
                    <TabsTrigger value="GENERAL">Gerais</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {filtered.map((item) => {
                    const icon =
                        item.type === "DEPLOYMENT"
                            ? Rocket
                            : item.type === "MEETING"
                                ? Users
                                : Megaphone;

                    const Icon = icon;

                    return (
                        <Card
                            key={item.id}
                            className="
                                bg-(image:--background-gradient)
                                border-border/50
                                hover:shadow-lg
                                transition-all
                                duration-300
                                hover:-translate-y-1
                            "
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                                            <Icon className="size-4 text-primary" />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-sm">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {item.type}
                                            </p>
                                        </div>
                                    </div>

                                    <Badge
                                        variant="outline"
                                        className={
                                            item.status === "PUBLISHED"
                                                ? "text-emerald-600 border-emerald-500/30"
                                                : "text-orange-500 border-orange-500/30"
                                        }
                                    >
                                        {item.status}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {item.description}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="size-3.5" />
                                        {item.dateInit.toLocaleDateString()}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Clock3 className="size-3.5" />
                                        Agora
                                    </div>
                                </div>

                                {/* ACTIONS */}
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">
                                            <Pencil className="size-4" />
                                        </Button>

                                        <Button size="sm" variant="outline">
                                            <Trash2 className="size-4 text-red-500" />
                                        </Button>
                                    </div>

                                    <Button size="sm">
                                        <Send className="size-4" />
                                        Publicar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}