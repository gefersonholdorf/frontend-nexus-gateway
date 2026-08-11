import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

interface FetchTicketsResponse {
    summary: {
        total: number
        new: number
        inProgress: number
        planned: number
        pending: number
        solved: number
        closed: number
        approval: number
        sla: {
            atendimento: {
                percentage: number
                total: number
                completed: number
                met: number
                breached: number
                pending: number
            },
            resolucao: {
                percentage: number
                total: number
                completed: number
                met: number
                breached: number
                pending: number
            },
        },
        alerts: {
            slaExpired: {
                count: number;
            };

            withoutResponsible: {
                count: number;
            };

            withoutUpdate: {
                count: number;
            };
        }
    },
}

export function useFetchTicketsSummary() {
    const { user } = useUser()

    return useQuery({
        queryKey: [
            "fetch-tickets-summary",
        ],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets/summary`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar tickes")
            }

            const result: FetchTicketsResponse = await response.json()

            return result
        },
    })
}