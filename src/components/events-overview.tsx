import { formatEventDate } from "@/lib/format-event-date";
import { ArrowRight, CalendarClock, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

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
            className="h-120 bg-(image:--background-gradient) flex flex-col rounded-3xl border-border shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg"
        >
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center bg-background/10 border border-primary">
                        <CalendarClock className="text-primary size-5" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-[1rem] text-primary-text">
                            Próximos Eventos
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Visão geral dos próximos eventos da Lusati
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col justify-between gap-2">
                {events.map((event) => (
                    <div
                        className="flex p-2 items-start justify-between gap-4 border-b border-border hover:bg-background"
                        key={event.id}
                    >
                        <div className="flex gap-4 items-center">
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[1.2rem] font-semibold text-primary-text">09</span>
                                <span className="text-[.8rem] font-light text-muted-foreground">Jul</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-medium truncate text-[.9rem] text-primary-text">{event.title}</span>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1">
                                        <Clock className="text-muted-foreground size-3" />
                                        <span className="text-[.75rem] text-muted-foreground">
                                            {formatEventDate(event.dateInit, event.dateFinish)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="text-muted-foreground size-3" />
                                        <span className="text-[.75rem] text-muted-foreground">
                                            Online (Teams)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-2 bg-purple-100 border border-border rounded-lg">
                            <span className="text-[.7rem] text-purple-700">Reunião</span>
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
                                            bg-transparent
                                            py-3
                                            text-sm
                                            font-medium
                                            text-primary cursor-pointer
                                            transition-all
                                            hover:bg-background
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