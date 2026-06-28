import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface Summary {
    total: number,
    present: number,
    revision: number,
    progress: number,
    pending: number
}

interface FetchSummarysRequest {
    page: number;
    perPage: number;
    text?: string;
    category?: string;
    status?: string;
    department?: string;
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

export function useFetchSummarys({ page = 1, perPage = 10, category, department, status, text }: FetchSummarysRequest) {
    const { user } = useUser()

    return useQuery({
        queryKey: [
            "fetch-summarys",
            page,
            perPage,
            text,
            category,
            status,
            department,
        ],
        queryFn: async () => {
            const query = new URLSearchParams();

            query.append("page", String(page));
            query.append("perPage", String(perPage));

            if (text) {
                query.append("text", text);
            }

            if (category) {
                if (category !== "all") {
                    query.append("category", category);
                }
            }

            if (status) {
                if (status !== "all") {
                    query.append("status", status);
                }
            }

            if (department) {
                if (department !== "all") {
                    query.append("department", department);
                }
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/summary?${query.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar Resumo dos documentos")
            }

            const result: FetchSummarysResponse = await response.json()
            console.log(result)
            return result
        },
    })
}