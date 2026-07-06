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

interface FetchProfilesResponse {
    profile: Profile
}

export function useGetProfilesById({id}: {id: number}) {
    const { user } = useUser()

    return useQuery({
        queryKey: [
            "get-profile-by-id",
            id
        ],
        enabled: !!id,
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/profiles/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar perfil")
            }

            const result: FetchProfilesResponse = await response.json()

            return result
        },
    })
}