import { ArrowRight, Megaphone, User2 } from "lucide-react";
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
    }
]

export function AnnouncementsComponent() {
    return (
        <Card
            className="h-120 flex flex-col py-6 bg-(image:--background-gradient) rounded-3xl border-border shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg"
        >
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-primary rounded-md overflow-hidden flex items-center justify-center bg-background/10">
                        <Megaphone className="text-primary size-5" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-[1rem] text-primary-text">
                            Comunicados
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Últimas atualizações
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col justify-between gap-2">
                {events.map((event) => (
                    <div
                        className="flex-1 flex p-2 items-start justify-between gap-4 border-b border-border rounded-lg hover:bg-primary/10"
                        key={event.id}
                    >
                        <div className="flex flex-col border border-primary bg-primary/10 p-2 rounded-lg items-center justify-center">
                            <User2 className="size-4 text-primary" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-medium truncate text-[.9rem]">{event.title}</span>
                            <div className="flex items-center gap-1">
                                <span className="text-[.75rem] text-muted-foreground line-clamp-2">
                                    A partir de agosto, todos os colaboradores poA partir de agosto, todos os colaboradores poderão aderir ao novo plano de saúde com coberturaderão aderir ao novo plano de saúde com coberturaA partir de agosto, todos os colaboradores poderão aderir ao novo plano de saúde com cobertura
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-[.70rem] font-light text-muted-foreground line-clamp-2">
                                    Há 40 minutos
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex-1 pt-4">
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
                        Ver Todos os Comunicados
                        <ArrowRight size={16} />
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}