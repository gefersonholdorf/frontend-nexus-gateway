import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface Masking {
    id: number
      executionId: string
      path: string
      status: string
      dsEnvironment: string
      databasesExpected: number
      databasesProcessed: number
      databasesSuccess: number
      databasesError: number
      recordsProcessed: number
      startedAt: string
      finishedAt: string
}

interface FetchMaskingsRequest {
    page: number;
    perPage: number;
}

interface FetchMaskingsResponse {
    maskings: Masking[]
    pagination: {
        page: number,
        perPage: number,
        total: number,
        totalPages: number,
        hasNextPage: boolean,
        hasPreviousPage: boolean,
    }
}

export function useFetchMaskings({ page = 1, perPage = 10 }: FetchMaskingsRequest) {
    const { user } = useUser()
    const { handleSetLoginExpired } = useLoginExpired()

    return useQuery({
        queryKey: [
            "fetch-maskings",
            page,
            perPage,
        ],
        queryFn: async () => {
            const query = new URLSearchParams();

            query.append("page", String(page));
            query.append("perPage", String(perPage));

            const response = await fetch(`${import.meta.env.VITE_API_URL}/maskings?${query.toString()}`, {
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
                throw new Error("Erro ao listar maskings")
            }

            const result: FetchMaskingsResponse = await response.json()

            return result
        },
    })
}