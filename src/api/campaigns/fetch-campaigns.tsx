import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export interface CampaignUser {
  id: number;
  name: string;
  avatarUrl: string | null;
  email?: string;
}

export interface CampaignAccessStats {
  total: number;
  accessed: number;
  viewed: number;
  pending: number;
  ignored?: number;
  accessRate?: number;
}

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'INACTIVE';

export interface Campaign {
  id: number;
  code: string;
  title: string;
  description: string | null;
  monthYear: string;
  publishDate: string | null;
  status: CampaignStatus;
  url: string | null;
  accessStats: CampaignAccessStats;
  responsible: CampaignUser;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface FetchCampaignsRequest {
    page: number;
    perPage: number;
    text?: string;
    monthYear?: string
    status?: string;
}

interface FetchCampaignsResponse {
    campaigns: Campaign[]
    pagination: {
        page: number,
        perPage: number,
        total: number,
        totalPages: number,
        hasNextPage: boolean,
        hasPreviousPage: boolean,
    }
}

export function useFetchCampaigns({ page = 1, perPage = 10, monthYear, status, text }: FetchCampaignsRequest) {
    const { user } = useUser()
    const { handleSetLoginExpired } = useLoginExpired()

    return useQuery({
        queryKey: [
            "fetch-campaigns",
            page,
            perPage,
            text,
            monthYear,
            status,
        ],
        queryFn: async () => {
            const query = new URLSearchParams();

            query.append("page", String(page));
            query.append("perPage", String(perPage));

            if (text) {
                query.append("text", text);
            }

            if (status) {
                if (status !== "all") {
                    query.append("status", status);
                }
            }

            if (monthYear) {
                query.append("monthYear", monthYear);
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/campaigns?${query.toString()}`, {
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
                throw new Error("Erro ao listar documentos")
            }

            const result: FetchCampaignsResponse = await response.json()

            return result
        },
    })
}