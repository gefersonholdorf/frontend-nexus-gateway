import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

interface Profile {
    id: number
    title: string,
    description: string | null,
    createdAt: string,
    status: boolean,
    countUsers: number,
    countTotalPermissions: number,
    permissions:
    {
        id: number,
        key: string,
        description: string | null
    }[]
}

interface FetchProfilesRequest {
    page: number;
    perPage: number;
    title?: string;
    status?: string;
    profile?: string
}

interface FetchProfilesResponse {
    profiles: Profile[]
    pagination: {
        page: number,
        perPage: number,
        total: number,
        totalPages: number,
        hasNextPage: boolean,
        hasPreviousPage: boolean,
    }
    countPermissions: number
}

export function useFetchProfiles({ page = 1, perPage = 10, status, title, profile }: FetchProfilesRequest) {
    const { user } = useUser()

    return useQuery({
        queryKey: [
            "fetch-profiles",
            page,
            perPage,
            title,
            status,
            profile,
        ],
        queryFn: async () => {
            const query = new URLSearchParams();

            query.append("page", String(page));
            query.append("perPage", String(perPage));

            if (title) {
                query.append("title", title);
            }

            if (status) {
                if (status !== "all") {
                    query.append("status", status);
                }
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/profiles?${query.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar perfis")
            }

            const result: FetchProfilesResponse = await response.json()

            return result
        },
    })
}