import { AlertTriangle, ArrowRight, CalendarClock, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { formatEventDate } from "@/lib/format-event-date";

interface Event {
    id: string
    title: string
    dateInit: Date
    dateFinish: Date
    type: 'DEPLOYMENT' | 'MEETING'
}

const events: Event[] = [
    {
        id: '1',
        title: 'Reunião de Planejamento',
        dateInit: new Date('2024-06-20T10:00:00'),
        dateFinish: new Date('2024-06-20T11:00:00'),
        type: 'MEETING'
    },
    {
        id: '2',
        title: 'Deploy da Versão 2.0',
        dateInit: new Date('2024-06-21T14:00:00'),
        dateFinish: new Date('2024-06-21T15:00:00'),
        type: 'DEPLOYMENT'
    },
    {
        id: '3',
        title: 'Deploy da Versão 2.0',
        dateInit: new Date('2024-06-21T14:00:00'),
        dateFinish: new Date('2024-06-21T15:00:00'),
        type: 'DEPLOYMENT'
    },
    {
        id: '4',
        title: 'Deploy da Versão 2.0',
        dateInit: new Date('2024-06-21T14:00:00'),
        dateFinish: new Date('2024-06-21T15:00:00'),
        type: 'DEPLOYMENT'
    }
]

export function EventsOverviewComponent() {
    return (
        <Card
            className="h-116 rounded-3xl border-slate-200 shadow-sm transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg"
        >
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-blue-900 rounded-md overflow-hidden flex items-center justify-center bg-blue-900">
                        <CalendarClock className="text-primary-text size-5" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Próximos Eventos
                        </h3>
                        <p className="text-xs text-slate-500">
                            Visão geral dos próximos eventos
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {events.map((event) => (
                    <div
                        className="flex p-2 justify-start items-center gap-4 border-b border-slate-200"
                        key={event.id}
                    >
                        <div className="w-9 h-9 border border-blue-300 rounded-md overflow-hidden flex items-center justify-center bg-blue-50">
                            <AlertTriangle className="text-blue-500 size-4" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-medium truncate text-[.9rem]">{event.title}</span>
                            <div className="flex items-center gap-1">
                                <Clock className="text-muted-foreground size-3" />
                                <span className="text-[.75rem] text-muted-foreground">
                                    {formatEventDate(event.dateInit, event.dateFinish)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                <div className=" pt-4">
                    <button
                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            bg-slate-100
                                            py-3
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            transition-all
                                            hover:bg-slate-200
                                        "
                    >
                        Ver Calendário Completo
                        <ArrowRight size={16} />
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}