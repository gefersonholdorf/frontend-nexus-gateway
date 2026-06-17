import { useUser } from "@/contexts/user-context";
import { ActivityIcon, HourglassIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";

export function WelcomeCard() {
    const [now, setNow] = useState(new Date());
    const { userName } = useUser();

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = now.getHours();

        if (hour >= 5 && hour < 12) return "Bom dia";
        if (hour >= 12 && hour < 18) return "Boa tarde";
        return "Boa noite";
    };

    return (
        <Card
            className="
            h-80
                relative p-4
                overflow-hidden
                rounded-3xl
                border
                border-border/50
                bg-(image:--background-gradient)
                shadow-lg
                transition-all duration-300 transform hover:scale-[1.01]
                hover:shadow-lg
            "
        >

            <CardContent className="relative px-3">
                {/* HEADER TEXT */}
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                        Bem-vindo ao <span className="font-medium text-primary">Nexus Gateway</span>
                    </p>

                    <h1 className="text-2xl font-semibold tracking-tight">
                        {getGreeting()},
                        <span className="ml-2 font-bold text-primary">
                            {userName}
                        </span>
                    </h1>

                    <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                        Plataforma centralizada de intranet da Lusati.
                    </p>
                </div>

                {/* TIME BLOCK */}
                <div
                    className="
                        mt-2
                        mb-4
                        flex
                        items-center
                        justify-between
                        rounded-sm
                        border
                        border-border
                        px-4
                        py-3
                        backdrop-blur-md bg-card
                    "
                >
                    <div className="text-left">
                        <p className="text-lg font-semibold tabular-nums">
                            {now.toLocaleTimeString()}
                        </p>

                        <p className="text-xs text-muted-foreground capitalize">
                            {now.toLocaleDateString("pt-BR", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric"
                            })}
                        </p>
                    </div>
                </div>
                <span className="text-muted-foreground text-[.8rem]">Resumo dos seus Chamados no GLPI:</span>
                <div className="pt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-card border border-border p-3 rounded-sm shadow-sm flex gap-2 items-center">
                        <ActivityIcon className="size-4 text-blue-500" />
                        <span className="text-primary-text text-sm">Abertos/Em Andamento:</span>
                        <span className="text-primary-text font-bold text-xl">4</span>
                    </div>
                    <div className="bg-card border border-border p-3 rounded-sm shadow-sm flex gap-2 items-center">
                        <HourglassIcon className="size-4 text-blue-500" />
                        <span className="text-primary-text text-sm">Aguardando Encerrar:</span>
                        <span className="text-primary-text font-bold text-xl">4</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}