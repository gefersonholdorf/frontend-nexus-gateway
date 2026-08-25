import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";
import type { Review } from "./fetch-reviews";

interface GetReviewByIdRequest {
    revisionId?: number
}

interface GetReviewByIdResponse {
    revision: Review
}

export function useGetReviewById({ revisionId }: GetReviewByIdRequest) {
    const { user } = useUser()
    const { handleSetLoginExpired } = useLoginExpired()

    return useQuery({
        queryKey: [
            "get-review-by-id",
            revisionId
        ],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/revisions/${revisionId}`, {
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
                throw new Error("Erro ao listar revisão")
            }

            const result: GetReviewByIdResponse = await response.json()

            return result
        },
        enabled: !!revisionId
    })
}