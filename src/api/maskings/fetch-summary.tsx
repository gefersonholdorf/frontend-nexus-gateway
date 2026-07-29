import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface Summary {
    total: number
    success: number
    error: number
    partialError: number
}

interface FetchSummarysRequest {
    page: number;
    perPage: number;
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

export function useFetchSummarysMaskings({ page = 1, perPage = 10 }: FetchSummarysRequest) {
    const { user } = useUser()

    return useQuery({
        queryKey: [
            "fetch-summarys-maskings",
            page,
            perPage,
        ],
        queryFn: async () => {
            const query = new URLSearchParams();

            query.append("page", String(page));
            query.append("perPage", String(perPage));

            const response = await fetch(`${import.meta.env.VITE_API_URL}/maskings/summary?${query.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar Resumo dos maskings")
            }

            const result: FetchSummarysResponse = await response.json()
            return result
        },
    })
}