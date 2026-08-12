import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface UserCampaign {
  id: number;
  name: string;
  avatarUrl: string | null;
  email?: string;
  stats: {
    dateView: string | null
    dateAccess: string | null
    status: "Visualizou e acessou" | "Visualizou, não acessou" | "Não visualizou"
  }
}

interface FetchCampaignsResponse {
    users: UserCampaign[]
}

interface FetchCampaignsRequest {
    campaignId: number | null
}

export function useGetUsersByCampaign({ campaignId }: FetchCampaignsRequest) {
    const { user } = useUser()
    const { handleSetLoginExpired } = useLoginExpired()

    return useQuery({
        queryKey: [
            "user-by-campaign", campaignId
        ],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/campaigns/users/${campaignId}`, {
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
                throw new Error("Erro ao listar usuários da campanha")
            }

            const result: FetchCampaignsResponse = await response.json()

            return result
        },
        enabled: campaignId !== null,
    })
}