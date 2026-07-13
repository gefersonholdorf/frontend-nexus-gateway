import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface ProfileSelectResponse {
    profiles: {
        id: number
        name: string
        description: string | null
    }[]
}

export function useGetProfilesSelect() {
    const { user } = useUser()

    return useQuery({
        queryKey: [
            "get-select-profiles",
        ],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/profiles/select`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar perfis")
            }

            const result: ProfileSelectResponse = await response.json()

            return result
        },
    })
}