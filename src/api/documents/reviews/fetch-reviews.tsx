import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface Review {
    id: number
    document: {
        id: number
        title: string
    }
    autoOpened: boolean
    reason: string
    description: string | null
    openUser: {
        id: number
        name: string
        avatarUrl: string | null
        roleDescription: string | null
    },
    reviserUser: {
        id: number
        name: string
        avatarUrl: string | null
        roleDescription: string | null
    } | null
    status: "ABERTA" | "EM_APROVACAO" | "APROVADA" | "CANCELADA",
    createdAt: string
    dueDate: string | null
    completedAt: string | null
    approvedAt: string | null
    versions:
    {
        id: number
        version: string
        changeLog: string | null
        createdAt: string
        status: "RASCUNHO" | "EM_APROVACAO" | "APROVADA" | "CANCELADA",
    }[]
    createUser: {
        id: number
        name: string
        avatarUrl: string | null
        roleDescription: string | null
    },
}

interface FetchReviewsRequest {
    page: number;
    perPage: number;
    documentId?: number
}

interface FetchReviewsResponse {
    revisions: Review[]
    pagination: {
        page: number,
        perPage: number,
        total: number,
        totalPages: number,
        hasNextPage: boolean,
        hasPreviousPage: boolean,
    }
}

export function useFetchReviews({ page = 1, perPage = 10, documentId }: FetchReviewsRequest) {
    const { user } = useUser()
    const { handleSetLoginExpired } = useLoginExpired()

    return useQuery({
        queryKey: [
            "fetch-Reviews",
            page,
            perPage,
            documentId,
        ],
        queryFn: async () => {
            const query = new URLSearchParams();

            query.append("page", String(page));
            query.append("perPage", String(perPage));

            if (documentId) {
                query.append("documentId", String(documentId));

            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/revisions?${query.toString()}`, {
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
                throw new Error("Erro ao listar revisões")
            }

            const result: FetchReviewsResponse = await response.json()

            return result
        },
    })
}