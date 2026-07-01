import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";
import { SquareArrowOutUpRight, Ticket } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

interface TicketGLPIResponse {
    summaryTickets: {
        category: string
        quantity: number
    }[]
}

export function GLPISummaryComponent() {
    const { user } = useUser()
    const query = useQuery({
        queryKey: ["tickets-glpi"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/summary/tickets`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                }
            })

            const result = await response.json() as TicketGLPIResponse;

            return result;
        },
        refetchInterval: 30000,
    });

    if (query.isLoading) {
        return (
            <Card className="h-80 p-0">
                <Skeleton className="h-full bg-gray-100" />
            </Card>
        );
    }

    if (!query.data) {
        return null;
    }

    const summary = query.data.summaryTickets.map((item) => ({
        status: item.category as
            | "Aberto"
            | "Em andamento"
            | "Resolvido"
            | "Fechado",
        value: item.quantity,
    }));

    const total = summary.reduce((acc, item) => acc + item.value, 0)

    function percentage(total: number, value: number) {
        return total > 0 ? (value / total) * 100 : 0
    }

    return (
        <Card className="
                h-80
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
            <CardHeader className="flex justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary bg-background/10">
                        <Ticket className="size-5 text-primary" />
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-primary-text">
                            Minhas Solicitações - GLPI
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Confira o resumo das suas solicitações no GLPI
                        </p>
                    </div>
                </div>
                <div>
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="flex gap-1 items-center cursor-pointer group" onClick={() => window.open('https://glpi.lusati.com.br/front/ticket.php', "_blank")}>
                                <span className="text-muted-foreground text-[.8rem] group-hover:text-primary/80">Ver Mais</span>
                                <SquareArrowOutUpRight className="size-3 text-muted-foreground cursor-pointer group-hover:text-primary/80" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Acesse o GLPI para visualizar e gerenciar suas solicitações</span>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </CardHeader>
            <CardContent className="pt-4 px-8 space-y-6">
                {summary.map((item) => (
                    <div
                        key={item.status}
                        className="flex items-center gap-3"
                    >
                        <span className="w-30 text-primary-text">
                            {item.status}
                        </span>

                        <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-500",
                                            item.status === "Aberto" && "bg-amber-500",
                                            item.status === "Em andamento" && "bg-blue-500",
                                            item.status === "Resolvido" && "bg-red-500",
                                            item.status === "Fechado" && "bg-emerald-500"
                                        )}
                                        style={{
                                            width: `${percentage(total, item.value)}%`,
                                        }}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    {item.value} solicitaç{item.value !== 1 ? "ões" : 'ão'} - 
                                    {item.status === 'Aberto' && ' Aguarde que o suporte irá responder'}
                                    {item.status === 'Em andamento' && ' Chamado estão em andamento'}
                                    {item.status === 'Resolvido' && ' Você precisa encerrar estes chamados'}
                                    {item.status === 'Fechado' && ' Chamados fechados com sucesso'}
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <span className="font-semibold">
                            {item.value}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}