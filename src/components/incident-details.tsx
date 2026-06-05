import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

interface IncidentDetail {
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
}

export function IncidentDetails({ incident }: { incident: IncidentDetail }) {
    const incidents = [
        {
            label: "Desastre",
            value: 5,
            color: "border-red-700",
            textColor: "text-red-700",
            bg: "bg-red-700/10"
        },
        {
            label: "Alto",
            value: 4,
            color: "border-red-500",
            textColor: "text-red-500",
            bg: "bg-red-500/10"
        },
        {
            label: "Médio",
            value: 3,
            color: "border-orange-500",
            textColor: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            label: "Aviso",
            value: 2,
            color: "border-yellow-500",
            textColor: "text-yellow-500",
            bg: "bg-yellow-500/10"
        },
        {
            label: "Informação",
            value: 1,
            color: "border-blue-500",
            textColor: "text-blue-500",
            bg: "bg-blue-500/10"
        },
    ];
    return (
        <Card
            className={`h-fit rounded-3xl border-slate-200 shadow-sm transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg
                    border-l ${incidents[incident.severity].color} border-l-5
                `}
        >
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                        <AlertTriangle className={incidents[incident.severity].textColor} size={20} />
                    </div>

                    <div className="w-full flex items-start justify-between gap-3">
                        <div>
                            <h3 className="font-semibold text-slate-900">
                                {incident.name}
                            </h3>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                    ID do Evento: {incident.eventid}
                                </span>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-sm ${incidents[incident.severity].bg}`}>
                            <span className={`text-xs font-semibold ${incidents[incident.severity].textColor}`}>
                                {incidents[incident.severity].label}
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 border-t border-slate-200 pt-4">
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-600">Links relacionados</span>
                    <div className="flex flex-col gap-2">
                        {incident.urls.map((url) => (
                            <a
                                key={url.url}
                                href={url.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 text-sm hover:underline"
                            >
                                {url.name}
                            </a>
                        ))}
                    </div>
                </div>
            </CardContent >
        </Card >
    )
}