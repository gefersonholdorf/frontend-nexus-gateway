import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";
import type { Campaign } from "./fetch-campaigns";

interface FetchCampaignsResponse {
    campaign: Campaign | null
}

export function useGetCampaignActive(isLoginCompleted: boolean) {
    const { user } = useUser()
    const { handleSetLoginExpired } = useLoginExpired()

    return useQuery({
        queryKey: ["fetch-campaigns", user],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/campaigns/active`, {
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
                throw new Error("Erro ao listar campanha")
            }

            const result: FetchCampaignsResponse = await response.json()

            return result
        },
        enabled: !!isLoginCompleted
    })
}