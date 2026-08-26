import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface Summary {
    total: number,
    open: number
    pendingApproval: number
    approved: number
    cancelled: number
}

interface FetchSummarysRequest {
    page: number;
    perPage: number;
    documentId?: number
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

export function useFetchSummarysReviews({ page = 1, perPage = 10, documentId }: FetchSummarysRequest) {
    const { user } = useUser()
    const { handleSetLoginExpired } = useLoginExpired()

    return useQuery({
        queryKey: [
            "fetch-summarys-reviews",
            page,
            perPage,
            documentId
        ],
        queryFn: async () => {
            const query = new URLSearchParams();

            query.append("page", String(page));
            query.append("perPage", String(perPage));

            if (documentId) {
                query.append("documentId", String(documentId));

            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/revisions/summary?${query.toString()}`, {
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