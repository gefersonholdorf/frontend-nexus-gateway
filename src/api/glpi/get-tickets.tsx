import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface Ticket {
    id: number;
    name: string
    date: string
    date_mod: string
    closedate: string | null
    solvedate: string | null
    requester: string
    responsibles: {
        id: number
        name: string
        url: string | null
        role: string | null
    }[]
    urgency: string
    impact: string
    priority: string
    category: string
    type: string
    status: string
    time_to_own: string | null
    time_to_resolve: string | null
    takeintoaccountdate: string | null
    externalid: string
    sla: {
        atendimento: {
            title: "Atendimento" | "Resolução"
            label: string
            percentageValue:number
            percentage:number
            color: "green" | "yellow" | "orange" | "red"
            expired: boolean
            completed: boolean
            startDate: Date
            dueDate: Date | null
            completedDate: Date | null,
            remainingSeconds:number
            elapsedSeconds:number
            totalSeconds:number
        },
        resolucao: {
            title: "Atendimento" | "Resolução"
            label: string
            percentageValue:number
            percentage:number
            color: "green" | "yellow" | "orange" | "red"
            expired: boolean
            completed: boolean
            startDate: Date
            dueDate: Date | null
            completedDate: Date | null
            remainingSeconds:number
            elapsedSeconds:number
            totalSeconds:number
        },
    }
}

interface FetchTicketsResponse {
    tickets: Ticket[]
    pagination: {
        page: number,
        perPage: number,
        total: number,
        totalPages: number,
        hasNextPage: boolean,
        hasPreviousPage: boolean,
    }
}

interface Pagination {
    status: number
    page: number
    limit: number
}

export function useFetchTickets({ status, page, limit }: Pagination) {
    const { user } = useUser()
    const { handleSetLoginExpired } = useLoginExpired()

    return useQuery({
        queryKey: [
            "fetch-tickets", status, page, limit
        ],
        queryFn: async () => {
            const query = new URLSearchParams();

            query.append("page", String(page));
            query.append("perPage", String(limit));
            query.append("status", String(status));

            const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets?${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status === 401) {
                handleSetLoginExpired(true)
            }

            if (response.status !== 200) {
                throw new Error("Erro ao listar tickes")
            }

            const result: FetchTicketsResponse = await response.json()

            return result
        },
    })
}