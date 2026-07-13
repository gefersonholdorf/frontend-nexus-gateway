import { useUser } from "@/contexts/user-context";
import { useMutation } from "@tanstack/react-query";

interface CreateDocumentEventRequest {
    id: number
}

export function useCreateDocumentEvent() {
    const { user } = useUser()

    return useMutation({
        mutationKey: ['create-document-event'],
        mutationFn: async (data: CreateDocumentEventRequest) => {
            await fetch(`${import.meta.env.VITE_API_URL}/documents/${data.id}/event`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${user?.token}`
                }
            })
        }
    })
}