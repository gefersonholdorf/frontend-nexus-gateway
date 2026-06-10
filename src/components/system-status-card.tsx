import { useQuery } from "@tanstack/react-query";
import { Activity, Cpu, HardDrive } from "lucide-react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface SystemStatusCardProps {
    serverId: string;
    serverName: string
}

export function SystemStatusCard({
    serverId,
    serverName
}: SystemStatusCardProps) {
    const query = useQuery({
        queryKey: ["status-server", serverId],
        queryFn: async () => {
            const response = await fetch(`http://127.0.0.1:3336/servers/${serverId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    hostName: serverName
                })
            })

            return response.json();
        },
        refetchInterval: 30000,
    });

    if (query.isLoading) {
        return (
            <Card className="h-55 p-0">
                <Skeleton className="h-full bg-gray-100" />
            </Card>
        );
    }

    if (!query.data) {
        return null;
    }

    const server = query.data.server;

    return (
        <Card
            className={`
                h-55 bg-background rounded-2xl border border-border px-6 py-5 shadow-sm flex flex-col gap-1 transition-all duration-300 transform hover:scale-[1.01]
                hover:shadow-lg`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-2 h-2 rounded-full ${server.up
                            ? "bg-emerald-400"
                            : "bg-red-400"
                            }`}
                    />

                    <h3 className="font-bold text text-primary-text">
                        {server.name}
                    </h3>
                </div>

                <div
                    className={`px-2 py-1 rounded-full text-[.8rem] font-semibold ${server.up
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {server.up ? "Online" : "Offline"}
                </div>
            </div>

            <div className="border-t border-border pt-2 flex flex-col gap-4">
                <Metric
                    icon={<Cpu size={14} />}
                    label="CPU"
                    value={`${server.cpu.toFixed(0)}%`}
                    percent={server.cpu}
                />

                <Metric
                    icon={<Activity size={14} />}
                    label="RAM"
                    value={`${server.memory.toFixed(0)}%`}
                    percent={server.memory}
                />

                <Metric
                    icon={<HardDrive size={14} />}
                    label="DISCO"
                    value={`${server.disk.toFixed(0)}%`}
                    percent={server.disk}
                />
            </div>
        </Card>
    );
}

interface MetricProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    percent: number;
}

function Metric({
    icon,
    label,
    value,
    percent,
}: MetricProps) {
    const isCritical = percent >= 80;
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                    <span className="text-primary-text">
                        {icon}
                    </span>

                    <span className="text-sm font-medium text-primary-text">
                        {label}
                    </span>
                </div>

                <span
                    className={`font-bold text-sm ${isCritical ? "text-red-600" : "text-primary-text"
                        }`}
                >
                    {value}
                </span>
            </div>

            <div className="h-2 bg-gray-500 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${isCritical
                        ? "bg-red-500"
                        : "bg-emerald-500"
                        }`}
                    style={{
                        width: `${Math.min(percent, 100)}%`,
                    }}
                />
            </div>
        </div>
    );
}