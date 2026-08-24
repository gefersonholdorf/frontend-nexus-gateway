import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface Review {
    id: number
    document: {
        id: number
        title: string
    }
    applicant: string
    reviser: string | null
    status: string
    dueDate: string
}

interface FetchReviewsRequest {
    page: number;
    perPage: number;
    type?: "assignedMe" | "all" | "applicantMe",
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

export function useFetchReviews({ page = 1, perPage = 10, type }: FetchReviewsRequest) {
    const { user } = useUser()
    const { handleSetLoginExpired } = useLoginExpired()

    return useQuery({
        queryKey: [
            "fetch-Reviews",
            page,
            perPage,
            status,
        ],
        queryFn: async () => {
            const query = new URLSearchParams();

            query.append("page", String(page));
            query.append("perPage", String(perPage));

            if (type) {
                if (type !== "all") {
                    query.append("type", status);
                }
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/reviews?${query.toString()}`, {
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