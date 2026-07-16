import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

interface Metrics {
    totalDocuments: {
        value: number,
        growth: number
    },
    totalCurrentRate: {
        value: number
        growth: number
    },
    totalAccess: {
        value: number,
        growth: number
    },
    totalDocumentsNeverAccessed: {
        value: number,
        growth: number
    },
    evolutionAccess: {
        label: string,
        access: number
    }[],
    usersRanking: {
        id: number,
        name: string,
        avatarUrl: string | null,
        total: number
    }[],
    documentsByCategory: {
        name: string,
        total: number
    }[],
    documentsByStatus: {
        name: string,
        total: number
    }[],
    documentAccessTable: {
        id: number
        code: string
        title: string
        access: number
        lastAccess: string | null
    }[],
    documentsByRolesPercentual: {
        name: string,
        total: number
    }[],
}

interface FetchDocumentsMetricsRequest {
    period: "7d" | "30d" | "1y" | "ds"
}

interface FetchDocumentsMetricsResponse {
    metrics: Metrics
}

export function useFetchDocumentsMetrics({ period }: FetchDocumentsMetricsRequest) {
    const { user } = useUser()

    return useQuery({
        queryKey: [
            "fetch-documents-metrics",
            period
        ],
        queryFn: async () => {
            const query = new URLSearchParams();

            query.append("period", String(period));

            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/metrics?${query.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar documentos")
            }

            const result: FetchDocumentsMetricsResponse = await response.json()

            return result
        },
    })
}