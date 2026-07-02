import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface Permission {
    id: number
    key: string
    description: string | null
}

interface FetchProfilesResponse {
    permissions: Permission[]
}

export function useGetPermissions(){
    const { user } = useUser()

    return useQuery({
        queryKey: [
            "get-permissions",
        ],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/profiles/permissions`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar permissões")
            }

            const result: FetchProfilesResponse = await response.json()

            return result
        },
    })
}