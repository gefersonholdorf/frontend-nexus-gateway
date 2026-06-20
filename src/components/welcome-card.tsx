import { useUser } from "@/contexts/user-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Clock, Coffee, Video } from "lucide-react";

export const calendarSummary = [
    {
        title: "Reuniões Hoje",
        value: "5",
        icon: Video,
        colorText: 'text-blue-500'
    },
    {
        title: "Horas Agendadas",
        value: "5H",
        icon: Clock,
        colorText: 'text-amber-500'
    },
    {
        title: "Tempo Livre",
        value: "4H",
        icon: Coffee,
        colorText: 'text-purple-500'
    }
]

export function WelcomeCard() {
    const [now, setNow] = useState(new Date());
    const { user } = useUser()

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
                transition-all
                duration-300
                hover:shadow-xl
            "
        >

            <CardContent className="relative px-3">
                {/* HEADER TEXT */}
                <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                        Bem-vindo ao <span className="font-medium text-primary">Nexus Gateway</span>
                    </p>

                    <h1 className="text-3xl mt-1 font-semibold tracking-tight">
                        {getGreeting()},
                        <span className="ml-2 font-bold text-primary">
                            {user?.name}
                        </span>
                    </h1>

                    <p className="mt-0 text text-muted-foreground font-normal capitalize italic">
                        {now.toLocaleDateString("pt-BR", {
                            weekday: "long",
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                        })}
                    </p>

                    <p className="mt-4 text-[.8rem] text-muted-foreground leading-relaxed text-justify">
                        Plataforma centralizada de intranet da Lusati, desenvolvida para integrar sistemas e centralizar informações corporativas em um único ambiente seguro e eficiente.
                    </p>
                </div>

                <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
                    {calendarSummary.map((item) => (
                        <div
                            key={item.title}
                            className="flex flex-col items-center justify-center border border-border rounded-sm shadow-lg transition-all duration-300 transform hover:scale-[1.01]
                                    hover:shadow-lg p-2 gap-1"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`${item.colorText} p-2 rounded-lg border border-border bg-card`}>
                                    <item.icon className="size-4" />
                                </div>
                                <span className="text-primary-text font-bold text-[1.1rem]">{item.value}</span>
                            </div>
                            <span className="text-[.8rem] text-muted-foreground">{item.title}</span>
                        </div>
                    ))}
                    {/* <Card className="rounded-sm p-4 border-none border-transparent shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                                    hover:shadow-lg outline-none flex flex-col items-start justify-center">
                        <div className="text-left">
                            <p className="text-2xl font-semibold tabular-nums italic">
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
                    </Card>
                    <WeatherCard /> */}
                </div>
            </CardContent>
        </Card>
    );
}