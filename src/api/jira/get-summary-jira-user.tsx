import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface Summary {
    pending: number
    inProgress: number
    correction: number
    completed: number
}

interface FetchSummarysResponse {
    total: number
    summary: Summary
}

export function useGetSummaryJiraUser() {
    const { user } = useUser()

    return useQuery({
        queryKey: ["fetch-summary"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/jira`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar resumo das tasks")
            }

            const result: FetchSummarysResponse = await response.json()
            return result
        },
    })
}