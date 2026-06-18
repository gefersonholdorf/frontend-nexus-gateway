import { useUser } from "@/contexts/user-context";
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
                h-65
                relative p-4
                overflow-hidden
                rounded-3xl
                border
                border-border/50
                bg-(image:--background-gradient)
                shadow-lg
                transition-all
                duration-300
                hover:shadow-xl
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
                        Plataforma centralizada de intranet da Lusati, desenvolvida para integrar sistemas e centralizar informações corporativas em um único ambiente seguro e eficiente.
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
            </CardContent>
        </Card>
    );
}