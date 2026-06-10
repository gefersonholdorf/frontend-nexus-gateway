import { BackComponent } from "@/components/back-component";
import { ChartIncidentsComponent } from "@/components/chart-incidents";
import { IncidentDetails } from "@/components/incident-details";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";

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

export function IncidentsPage() {
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
        <>
            <div className="px-10 flex justify-start items-start border-b border-zinc-100 bg-background p-4 rounded-lg">
                <div className="flex gap-3 items-center">
                    <BackComponent />
                    <div className="w-10 h-10 border border-blue-600 rounded-md overflow-hidden flex items-center justify-center bg-blue-100">
                        <AlertTriangle className="text-blue-600 size-4" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Incidentes</h1>
                        <p className="text-primary-text text-[.8rem]">Monitore e gerencie incidentes de segurança, falhas e anomalias em tempo real.</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 px-16 py-8 space-y-6">
                <div className="flex flex-col gap-4">
                    {query.data.problems.map((problem) => (
                        <IncidentDetails key={problem.eventid} incident={problem} />
                    ))}
                </div>
                <ChartIncidentsComponent />
            </div>
        </>
    )
}