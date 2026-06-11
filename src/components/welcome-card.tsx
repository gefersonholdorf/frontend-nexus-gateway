import { useUser } from "@/contexts/user-context";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";

export function WelcomeCard() {
    const [tempo, setTempo] = useState(new Date());
    const { userName } = useUser()

    useEffect(() => {
        const timer = setInterval(() => setTempo(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getSaudacao = () => {
        const hora = tempo.getHours();

        if (hora >= 5 && hora < 12) {
            return "Bom dia";
        }

        if (hora >= 12 && hora < 18) {
            return "Boa tarde";
        }

        return "Boa noite";
    };

    return (
        <Card
            className="
                min-h-35 flex flex-col items-start rounded-2xl px-4 py-4 border transition-all duration-300 transform hover:scale-[1.01]
                hover:shadow-lg bg-(image:--background-gradient) border-b border-border shadow-lg
            ">
            <CardContent className="flex flex-col gap-2">
                <h2 className="text-primary-text font-extrabold text-3xl">
                    {getSaudacao()}, <span className={"text-primary-text"}>{userName}</span>
                </h2>
                <p className="text-muted-foreground font-normal text-sm">Bem-vindo ao <span className="font-bold text-primary-text">Nexus Gateway</span> — Plataforma centralizada de Intranet da Lusati</p>
                <div className="flex items-center gap-2 pt-2">
                    <Clock className="text-muted-foreground size-5" />
                    <p className="text-primary-text font-semibold text-lg">{tempo.toLocaleTimeString()}</p>
                    <p className="text-primary-text">|</p>
                    <p className="text-muted-foreground font-normal text-sm">
                        {tempo.toLocaleDateString("pt-BR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}