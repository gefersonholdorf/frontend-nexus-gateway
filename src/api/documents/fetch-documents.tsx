import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

interface Document {
    id: number
    code: string,
    category: string,
    responsible: string,
    status: string,
    title: string,
    url: string,
    updatedAt: string,
}

interface FetchDocumentsRequest {
    page: number;
    perPage: number;
    text?: string;
    category?: string;
    status?: string;
    department?: string;
}

interface FetchDocumentsResponse {
    documents: Document[]
    pagination: {
        page: number,
        perPage: number,
        total: number,
        totalPages: number,
        hasNextPage: boolean,
        hasPreviousPage: boolean,
    }
}

export function useFetchDocuments({ page = 1, perPage = 10, category, department, status, text }: FetchDocumentsRequest) {
    const { user } = useUser()

    return useQuery({
        queryKey: [
            "fetch-documents",
            page,
            perPage,
            text,
            category,
            status,
            department,
        ],
        queryFn: async () => {
            const query = new URLSearchParams();

            query.append("page", String(page));
            query.append("perPage", String(perPage));

            if (text) {
                query.append("text", text);
            }

            if (category) {
                query.append("category", category);
            }

            if (status) {
                query.append("status", status);
            }

            if (department) {
                query.append("department", department);
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/documents?${query.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao listar documentos")
            }

            const result: FetchDocumentsResponse = await response.json()

            return result
        },
    })
}