import { Hourglass, Ticket, TicketPercentIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

export function GLPISummaryComponent() {
    return (
        <Card className="
        h-58
                w-full
                rounded-2xl
                border
                border-border
                bg-(image:--background-gradient)
                shadow-lg
                transition-all
                duration-300
                hover:shadow-xl
            ">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary bg-background/10">
                        <Ticket className="size-5 text-primary" />
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-primary-text">
                            Resumo dos seus Chamados
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Confira o resumo dos seus chamados do GLPI
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card
                        className={`
                                    bg-(image:--background-gradient) flex-row gap-2 rounded-lg border border-border px-6 py-5 shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                                    hover:shadow-lg`}
                    >
                        <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                            <TicketPercentIcon className="text-emerald-500 size-5" />
                        </div>
                        <div className="flex flex-col justify-start">
                            <span className="text-[.8rem] text-muted-foreground">Em Aberto / Andamento</span>
                            <span className={`font-bold text-[1.2rem] text-emerald-500`}>4</span>
                        </div>
                    </Card>


                    <Card
                        className={`
                                    bg-(image:--background-gradient) flex-row gap-2 rounded-lg border border-border px-6 py-5 shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                                    hover:shadow-lg`}
                    >
                        <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                            <Hourglass className="text-red-500 size-5" />
                        </div>
                        <div className="flex flex-col justify-start">
                            <span className="text-[.8rem] text-muted-foreground">Aguardando Encerrar</span>
                            <span className={`font-bold text-[1.2rem] text-red-500`}>4</span>
                        </div>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
}