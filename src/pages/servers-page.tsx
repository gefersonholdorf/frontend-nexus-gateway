import { BackComponent } from "@/components/back-component";
import { IncidentOverviewComponent } from "@/components/incident-overview";
import { SystemStatusCard } from "@/components/system-status-card";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Server, Wifi, WifiOff } from "lucide-react";
import type React from "react";

export function ServersPage() {
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
                        <p className="text-muted-foreground text-[.8rem]">Visualize e Gerencie os servidores da empresa.</p>
                    </div>
                </div>
            </div>
            <div className="bg-background px-10 py-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
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
            <div className="bg-background px-10 py-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SystemStatusCard serverName="Server - INFRA" serverId="10653" />
                <SystemStatusCard serverName="Server - HOM" serverId="10656" />
                <SystemStatusCard serverName="Server - APP" serverId="10654" />
                <IncidentOverviewComponent />
            </div>
        </div>
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