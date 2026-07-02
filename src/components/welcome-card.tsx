import { useGetSummaryEvents } from "@/api/calendar/get-summary-events";
import { useTheme } from "@/contexts/theme-context";
import { useUser } from "@/contexts/user-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeCardProps {
    onInitTour: () => void
}

export function WelcomeCard({ onInitTour }: WelcomeCardProps) {
    const [now, setNow] = useState(new Date());
    const { user } = useUser()
    const { data, isLoading } = useGetSummaryEvents({ type: 'user' })
    const { theme } = useTheme()

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (isLoading) {
        return (
            <Card className="h-62 rounded-sm">
                <Skeleton className="h-full w-full rounded-sm" />
            </Card>
        );
    }

    if (!data) return null;

    // const calendarSummary = [
    //     {
    //         title: "Reuniões Hoje",
    //         value: data.summary.meetingsToday.toString(),
    //         icon: Video,
    //         colorText: "text-blue-500",
    //     },
    //     {
    //         title: "Agendadas",
    //         value: `${data.summary.scheduledHoursToday.toFixed(1)}h`,
    //         icon: Clock,
    //         colorText: "text-amber-500",
    //     },
    //     {
    //         title: "Tempo Livre",
    //         value: `${data.summary.freeHoursToday.toFixed(1)}h`,
    //         icon: Coffee,
    //         colorText: "text-purple-500",
    //     },
    // ];

    const getGreeting = () => {
        const hour = now.getHours();

        if (hour >= 5 && hour < 12) return "Bom dia";
        if (hour >= 12 && hour < 18) return "Boa tarde";
        return "Boa noite";
    };

    return (
        <Card className="h-62 relative overflow-hidden rounded-3xl p-4">
            <div
                className={`
            absolute inset-0
            ${theme === 'dark' ? "bg-[url('https://api2.lusati.com.br/repositorio/nexus/dark-lusati-back.png')]" : "bg-[url('https://api2.lusati.com.br/repositorio/nexus/light-lusati-back.png')]"}
            bg-cover bg-right
        `}
            />

            <div
                className={`
                    absolute inset-0 bg-linear-to-r
                    ${theme === 'dark' ? 'from-[#18233D] via-[#18233D] to-[#18233D]/20' : 'from-[#FFF] via-[#FFF] to-[#FFF]/20'}        
                `}
            />

            <CardContent className="relative pt-4 px-3 space-y-4">
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

                    <p className="mt-4 text-[.8rem] line-clamp-2 max-w-90 text-muted-foreground leading-relaxed text-justify">
                        Plataforma centralizada de intranet da Lusati, desenvolvida para integrar sistemas e centralizar informações corporativas.
                    </p>
                </div>

                {/* <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
                    {calendarSummary.map((item) => (
                        <div
                            key={item.title}
                            className="bg-(image:--background-gradient) py-4 flex flex-col items-start justify-center border-2 border-border rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.01]
                                    hover:shadow-lg px-4 gap-1"
                        >
                            <div className="flex items-start gap-2">
                                <div className={`${item.colorText} p-3 rounded-full border border-border bg-card/50`}>
                                    <item.icon className="size-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-primary-text font-bold text-[.9rem]">{item.value}</span>
                                    <span className="text-[.8rem] text-muted-foreground">{item.title}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Card className="rounded-sm p-4 border-none border-transparent shadow-sm transition-all duration-300 transform hover:scale-[1.01]
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
                    <WeatherCard />
                </div> */}
                <Button
                        variant="outline"
                        size="sm"
                        onClick={onInitTour}
                    >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Iniciar Tour
                    </Button>
            </CardContent>
        </Card>
    );
}