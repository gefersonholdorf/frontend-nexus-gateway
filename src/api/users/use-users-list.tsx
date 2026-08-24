import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

interface UserList {
    id: number
    name: string
    avatarUrl: string | null
}

interface FetchUserListsResponse {
    users: UserList[]
}

export function useFetchUserLists() {
    const { user } = useUser()
    const { handleSetLoginExpired } = useLoginExpired()

    return useQuery({
        queryKey: ["fetch-users-lists"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/list`, {
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
                throw new Error("Erro ao listar usuários")
            }

            const result: FetchUserListsResponse = await response.json()

            return result
        },
    })
}