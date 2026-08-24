import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

interface DocumentUserProfile {
    id: number
    name: string
    email: string
    avatarUrl: string | null
    roleDescription: string
    lastLogin: string | null
}

interface FetchDocumentsUsersProfilesResponse {
    users: DocumentUserProfile[]
}

export function useFetchDocumentsUsersProfiles() {
    const { user } = useUser()
    const { handleSetLoginExpired } = useLoginExpired()

    return useQuery({
        queryKey: ["fetch-documents"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/profiles`, {
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
                throw new Error("Erro ao listar usuários dos documentos")
            }

            const result: FetchDocumentsUsersProfilesResponse = await response.json()

            return result
        },
    })
}