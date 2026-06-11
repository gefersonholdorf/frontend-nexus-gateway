import { AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { useQuery } from "@tanstack/react-query";

interface IncidentsResponse {
    incidents: {
        disaster: number,
        high: number
        average: number,
        warning: number,
        information: number
    }
}

export function IncidentOverviewComponent() {

    const query = useQuery({
        queryKey: ["incidents-overview"],
        queryFn: async () => {
            const response = await fetch(`http://127.0.0.1:3336/problems`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    hostIds: [10654, 10653, 10656]
                })
            })

            const result = await response.json() as IncidentsResponse;
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

    const incidents = [
        {
            label: "Desastre",
            value: query.data.incidents.disaster,
            color: "bg-red-700",
            textColor: "text-red-700",
        },
        {
            label: "Alto",
            value: query.data.incidents.high,
            color: "bg-red-500",
            textColor: "text-red-500",
        },
        {
            label: "Médio",
            value: query.data.incidents.average,
            color: "bg-orange-500",
            textColor: "text-orange-500",
        },
        {
            label: "Aviso",
            value: query.data.incidents.warning,
            color: "bg-yellow-500",
            textColor: "text-yellow-500",
        },
        {
            label: "Informação",
            value: query.data.incidents.information,
            color: "bg-blue-500",
            textColor: "text-blue-500",
        },
    ];

    return (
        <Card
            className="
                h-100 rounded-3xl bg-(image:--background-gradient)
                border-border
                shadow-sm
                transition-all duration-300
                transform hover:scale-[1.01]
                hover:shadow-lg
            "
        >
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-primary rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                        <AlertTriangle className="text-primary size-5" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-primary-text">
                            Incidentes Ativos - Servidores
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Monitoramento em tempo real
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-2">
                    {incidents.map((incident) => (
                        <div
                            key={incident.label}
                            className="
                                flex
                                items-center
                                justify-between
                                rounded-xl
                                border
                                border-border
                                px-4
                                py-1
                                transition-all
                                hover:border-border
                            "
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`h-3 w-3 rounded-full ${incident.color}`}
                                />

                                <span className="text-sm font-medium text-primary-text">
                                    {incident.label}
                                </span>
                            </div>

                            <span
                                className={`text-lg font-bold ${incident.textColor}`}
                            >
                                {incident.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Rodapé */}
                <div className=" pt-4">
                    <button
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-primary/10
                            py-3
                            text-sm
                            font-medium
                            text-primary
                            transition-all
                            hover:font-bold cursor-pointer
                        "
                    >
                        Ver detalhes dos incidentes
                        <ArrowRight size={16} />
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}