import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";
import { SquareArrowOutUpRight, Ticket, TicketIcon, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
            <Card className="h-52 p-0">
                <Skeleton className="h-full bg-gray-100" />
            </Card>
        );
    }

    if (!query.data) {
        return null;
    }

    return (
        <Card className="
                h-74
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
                                <span className="text-muted-foreground text-[.7rem] group-hover:text-primary/80">Ver Solicitações</span>
                                <SquareArrowOutUpRight className="size-3 text-muted-foreground cursor-pointer group-hover:text-primary/80" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Acesse o GLPI para visualizar e gerenciar suas solicitações</span>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div
                        className={`
                                    bg-(image:--background-gradient) flex gap-2 rounded-lg border border-border px-6 py-5 shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                                    hover:shadow-lg`}
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-card border border-border">
                            <TicketIcon className="text-primary size-5" />
                        </div>
                        <div className="flex flex-col gap-1 justify-start">
                            <div className="flex gap-2 items-center">
                                <span className={`font-bold text-[1.1rem] text-primary-text`}>{query.data.summaryTickets[0].quantity}</span>
                                <span className="text-[.9rem] font-medium text-primary-text">Solicitações</span>
                            </div>
                            <span className="text-[.8rem] text-muted-foreground">{query.data.summaryTickets[0].category}</span>
                        </div>
                    </div>


                    <div
                        className={`
                                    bg-(image:--background-gradient) flex gap-2 rounded-lg border border-border px-6 py-5 shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                                    hover:shadow-lg`}
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border border-border">
                            <XCircle className="text-primary size-5" />
                        </div>
                        <div className="flex flex-col gap-1 justify-start">
                            <div className="flex gap-2 items-center">
                                <span className={`font-bold text-[1.1rem] text-primary-text`}>{query.data.summaryTickets[1].quantity}</span>
                                <span className="text-[.9rem] font-medium text-primary-text">Solicitações</span>
                            </div>
                            <span className="text-[.8rem] text-muted-foreground">{query.data.summaryTickets[1].category}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}