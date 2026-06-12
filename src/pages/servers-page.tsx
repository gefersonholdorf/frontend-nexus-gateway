import { BackComponent } from "@/components/back-component";
import { IncidentDetails } from "@/components/incident-details";
import { IncidentOverviewComponent } from "@/components/incident-overview";
import { SystemStatusCard } from "@/components/system-status-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersPrivilegesServers } from "@/components/users-privileges-servers";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import { AlertTriangle, LayoutDashboard, Server, ShieldAlert, Wifi, WifiOff } from "lucide-react";
import type React from "react";

interface IncidentsDetailsResponse {
    problems: {
        eventid: number
        source: number
        object: number
        objectid: number
        clock: number
        ns: number
        r_eventid: number
        r_clock: number
        r_ns: number
        correlationid: number
        userid: number
        name: string
        acknowledged: number
        severity: number
        cause_eventid: number
        suppressed: number
        opdata: string
        urls:
        {
            url: string
            name: string
        }[]
    }[]
}

export function ServersPage() {

    const query = useQuery({
        queryKey: ["incidents-details"],
        queryFn: async () => {
            const response = await fetch(`http://127.0.0.1:3336/problems/details`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    hostIds: [10654, 10653, 10656]
                })
            })

            const result = await response.json() as IncidentsDetailsResponse;
            console.log(result)
            return result;
        },
        refetchInterval: 30000,
    });

    if (query.isLoading) {
        return (
            <Card className="h-90 p-0">
                <Skeleton className="h-full bg-gray-100" />
            </Card>
        );
    }

    if (!query.data) {
        return null;
    }

    return (
        <div className="bg-background bg-cover bg-center flex flex-col min-h-screen">
            <div className="px-10 flex justify-between items-center border-b border-border bg-background p-4 rounded-lg">
                <div className="flex gap-3 items-center">
                    <BackComponent />
                    <div className="w-10 h-10 border border-primary rounded-md overflow-hidden flex items-center justify-center bg-background">
                        <Server className="text-primary size-4" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Servidores</h1>
                        <p className="text-muted-foreground text-[.8rem]">Monitore os servidores e gerencie os usuários e privilégios da empresa.</p>
                    </div>
                </div>
            </div>
            <div className="bg-background px-10 py-4 w-full gap-6">
                <Tabs defaultValue="dashboard">
                    <TabsList variant="line">
                        <TabsTrigger value="dashboard"><LayoutDashboard />Dashboard</TabsTrigger>
                        <TabsTrigger value="users"><ShieldAlert />Usuários e Privilégios</TabsTrigger>
                    </TabsList>
                    <TabsContent value="dashboard">
                        <div className="bg-background py-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <ServerCard color="blue" title="Qtd Servidores" quantity={3}>
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                                    <Server className="text-blue-500 size-5" />
                                </div>
                            </ServerCard>
                            <ServerCard color="emerald" title="Online" quantity={3}>
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                                    <Wifi className="text-emerald-500 size-5" />
                                </div>
                            </ServerCard>
                            <ServerCard color="red" title="Offline" quantity={0}>
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                                    <WifiOff className="text-red-500 size-5" />
                                </div>
                            </ServerCard>
                            <ServerCard color="orange" title="Alertas" quantity={4}>
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                                    <AlertTriangle className="text-orange-500 size-5" />
                                </div>
                            </ServerCard>
                        </div>
                        <div className="bg-background py-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <SystemStatusCard serverName="Server - INFRA" serverId="10653" />
                            <SystemStatusCard serverName="Server - HOM" serverId="10656" />
                            <SystemStatusCard serverName="Server - APP" serverId="10654" />
                        </div>
                        <div className="bg-background py-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="col-span-1">
                                <IncidentOverviewComponent />
                            </div>
                            <div className="col-span-2">
                                <Card
                                    className="h-90 rounded-3xl bg-(image:--background-gradient)
                                border-border
                                shadow-sm
                                transition-all duration-300
                                transform hover:scale-[1.01]
                                hover:shadow-lg"
                                >
                                    <Carousel
                                        opts={{
                                            align: "start",
                                        }}
                                        className="relative"
                                        plugins={[
                                            Autoplay({
                                                delay: 5000,
                                            }),
                                        ]}
                                    >
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 border border-primary rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                                                    <AlertTriangle className="text-primary size-5" />
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-primary-text">
                                                        Incidentes Ativos - Detalhes
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        Detalhes dos incidentes ativos
                                                    </p>
                                                </div>

                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <CarouselContent className="pr-3 py-3 pl-2">
                                                {query.data.problems.map((problem) => (
                                                    <CarouselItem className="basis-1/2 lg:basis-1/3"><IncidentDetails key={problem.eventid} incident={problem} /></CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious className="left-2" />
                                            <CarouselNext className="right-2" />
                                        </CardContent>
                                    </Carousel>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="users">
                        <UsersPrivilegesServers />
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    )
}

interface ServerCardProps {
    children: React.ReactNode
    title: string
    color: string
    quantity: number
}

export function ServerCard({ children, color, title, quantity }: ServerCardProps) {
    return (
        <Card
            className={`
                bg-(image:--background-gradient) flex-row gap-2 rounded-lg border border-border px-6 py-5 shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                hover:shadow-lg`}
        >
            {children}
            <div className="flex flex-col justify-start">
                <span className="text-[.8rem] text-muted-foreground">{title}</span>
                <span className={`font-bold text-[1.2rem] text-${color}-500`}>{quantity}</span>
            </div>
        </Card>
    )
}