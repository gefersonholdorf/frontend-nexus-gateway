
import { AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { useQuery } from "@tanstack/react-query";

interface SystemStatusCardProps {
    serverId: string;
    serverName: string
}

interface ServerAccessCounterResponse {
    accessServer: {
        logins: number
        failedLogins: number
    }
}

export function ServerAccessCounterComponent({
    serverId,
    serverName
}: SystemStatusCardProps) {
    const query = useQuery({
        queryKey: ["access-server", serverId],
        queryFn: async () => {
            console.log(serverName)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/servers/access`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    server: serverName
                })
            })

            const result = await response.json() as ServerAccessCounterResponse;
            return result
        },
        refetchInterval: 30000,
    });

    if (query.isLoading) {
        return (
            <Card className="h-20 p-0">
                <Skeleton className="h-full bg-gray-100" />
            </Card>
        );
    }

    if (!query.data) {
        return null;
    }

    return (
        <Card
            className={`
                h-fit bg-(image:--background-gradient) rounded-2xl border border-border px-6 py-5 shadow-sm flex flex-col gap-1 transition-all duration-300 transform hover:scale-[1.01]
                hover:shadow-lg`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text text-primary-text">
                        {serverName} - Tentativas de Acessos
                    </h3>
                </div>
            </div>
            <div className="flex items-center gap-4 justify-between p-3 rounded-sm border border-border bg-card">
                <CheckCircle className="size-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">Login com sucesso</span>
                <span className="text-lg text-emerald-500 font-bold">{query.data.accessServer.logins}</span>
            </div>
            <div className="flex items-center gap-4 justify-between p-3 rounded-sm border border-border bg-card">
                <AlertCircle className="size-4 text-red-500" />
                <span className="text-sm text-muted-foreground">Login com falha</span>
                <span className="text-lg text-red-500 font-bold">{query.data.accessServer.failedLogins}</span>
            </div>
        </Card>
    );
}