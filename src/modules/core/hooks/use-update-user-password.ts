import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useApiClient } from "@/lib/api/use-api-client";

export interface UpdateUserPasswordInput {
    cd_id: number;
    senha: string;
}

/**
 * `PATCH /users/{id}/password` (RF013) — altera a senha de um usuário.
 * Não invalida `queryKeys.users` pois a senha não é exibida/consumida pela
 * listagem/detalhe de usuários.
 */
export function useUpdateUserPassword() {
    const api = useApiClient();

    return useMutation({
        mutationFn: ({ cd_id, senha }: UpdateUserPasswordInput) =>
            api.patch<void>(`/users/${cd_id}/password`, {
                body: { senha },
                errorMessage: "Erro ao alterar senha do usuário",
            }),
        onSuccess: () => {
            toast.success("Senha alterada com sucesso.", {
                position: "top-center",
                richColors: true,
            });
        },
        onError: () => {
            toast.error("Erro ao alterar senha do usuário.", {
                position: "top-center",
                richColors: true,
            });
        },
    });
}
