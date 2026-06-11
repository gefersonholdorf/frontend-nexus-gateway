import { Link, X } from "lucide-react";
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
            bg: "bg-red-700/10",
            colorFull: "bg-red-700"
        },
        {
            label: "Alto",
            value: 4,
            color: "border-red-500",
            textColor: "text-red-500",
            bg: "bg-red-500/10",
            colorFull: "bg-red-500"
        },
        {
            label: "Médio",
            value: 3,
            color: "border-orange-500",
            textColor: "text-orange-500",
            bg: "bg-orange-500/10",
            colorFull: "bg-orange-500"
        },
        {
            label: "Aviso",
            value: 2,
            color: "border-yellow-500",
            textColor: "text-yellow-500",
            bg: "bg-yellow-500/10",
            colorFull: "bg-yellow-500"
        },
        {
            label: "Informação",
            value: 1,
            color: "border-blue-500",
            textColor: "text-blue-500",
            bg: "bg-blue-500/10",
            colorFull: "bg-blue-500"
        },
    ];
    return (
        <Card
            className={`h-52 bg-card rounded-3xl border border-border shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg
                    
                `}
        >
            <CardHeader className="pb-2 space-y-2">
                <div className={`w-fit flex items-center gap-2 px-2 py-1 rounded-sm ${incidents[incident.severity].bg} border ${incidents[incident.severity].color}`}>
                    <span className={`flex gap-2 items-center text-xs font-semibold ${incidents[incident.severity].textColor}`}>
                        <div className={`w-2 h-2 rounded-full ${incidents[incident.severity].colorFull}`}></div>
                        {incidents[incident.severity].label}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-full flex items-start justify-between gap-3">
                        <div className="space-y-1">
                            <h3 className="line-clamp-2 font-semibold text-primary-text">
                                {incident.name}
                            </h3>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                    ID do Evento: {incident.eventid}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 border-t border-border pt-4">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-2">
                        {incident.urls.length > 0 && incident.urls.map((url) => (
                            <a
                                key={url.url}
                                href={url.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex gap-2 items-center text-primary text-sm font-medium"
                            >
                                <Link className="size-4" />
                                Abrir no GLPI
                            </a>
                        ))}
                        {incident.urls.length === 0 && (<span className="flex gap-2 items-center text-primary text-sm font-medium"><X className="size-4" />Nenhum chamado encontrado</span>)}
                    </div>
                </div>
            </CardContent >
        </Card >
    )
}