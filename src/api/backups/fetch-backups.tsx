import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

interface Backup {
    id: number
    backupAutomationIdNas: number
    system: string
    description: string
    path: string
    retentionDays: number
    backupsDays: number
    enabled: boolean
    nextTriggerTime: string | null
    createdAt: string
    updatedAt: string
}

interface FetchBackupsRequest {
    page: number;
    perPage: number;
}

interface FetchBackupsResponse {
    backups: Backup[]
    pagination: {
        page: number,
        perPage: number,
        total: number,
        totalPages: number,
        hasNextPage: boolean,
        hasPreviousPage: boolean,
    }
}

export function useFetchBackups({ page = 1, perPage = 10 }: FetchBackupsRequest) {
    const { user } = useUser()

    return useQuery({
        queryKey: [
            "fetch-backups",
            page,
            perPage,
        ],
        queryFn: async () => {
            const query = new URLSearchParams();

            query.append("page", String(page));
            query.append("perPage", String(perPage));

            const response = await fetch(`${import.meta.env.VITE_API_URL}/backups?${query.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar Backups")
            }

            const result: FetchBackupsResponse = await response.json()

            return result
        },
    })
}