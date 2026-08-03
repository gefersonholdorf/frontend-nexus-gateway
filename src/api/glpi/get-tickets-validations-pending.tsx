import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface TicketValidationPending {
    id: string
    ticketTitle: string
    ticketDescription: string
    itilcategories_id: number
    time_to_own: string
    requester: string
    userRole: string | null
    requesterId: number
    requesterPathUrl: string
    commentApproval: string
    createdAt: string
    priority: string
    status: string
    url: string
}

export interface TicketValidationsPendingsSummary {
    pendingForMe: number
    pendingForOthers: number
    approveds: number
    refusals: number
    ratioApproveds: number
}

interface FetchTicketValidationPendingsResponse {
    ticketsValidationsPendings: TicketValidationPending[]
    summary: TicketValidationsPendingsSummary
}

export function useFetchTicketValidationPendings() {
    const { user } = useUser()

    return useQuery({
        queryKey: [
            "fetch-ticket-validation-pendings"
        ],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets/validation-pendings`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar ticker validations pendings")
            }

            const result: FetchTicketValidationPendingsResponse = await response.json()

            return result
        },
    })
}