import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface Summary {
    total: number
    draft: number
    scheduled: number
    published: number
    inactive: number
}

interface FetchSummarysRequest {
    status?: string
    monthYear?: string
    text?: string
}

interface FetchSummarysResponse {
    summary: Summary
    pagination: {
        page: number,
        perPage: number,
        total: number,
        totalPages: number,
        hasNextPage: boolean,
        hasPreviousPage: boolean,
    }
}

export function useFetchSummaryCampaign({ status, text, monthYear }: FetchSummarysRequest) {
    const { user } = useUser()
    const { handleSetLoginExpired } = useLoginExpired()

    return useQuery({
        queryKey: [
            "fetch-summarys-campaigns",
            text,
            status,
            monthYear
        ],
        queryFn: async () => {
            const query = new URLSearchParams();

            if (text) {
                query.append("text", text);
            }

            if (monthYear) {
                query.append("monthYear", monthYear);
            }

            if (status) {
                if (status !== "all") {
                    query.append("status", status);
                }
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/campaigns/summary?${query.toString()}`, {
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
                throw new Error("Erro ao listar Resumo dos documentos")
            }

            const result: FetchSummarysResponse = await response.json()
            return result
        },
    })
}