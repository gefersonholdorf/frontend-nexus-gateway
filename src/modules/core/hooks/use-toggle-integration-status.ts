import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { useApiClient } from "@/lib/api/use-api-client";
import type { CoreIntegration } from "./use-fetch-integrations";

export interface ToggleIntegrationStatusInput {
    cd_id: number;
    fl_active: boolean;
}

/**
 * O documento de refatoração (RF024-RF027) não lista um endpoint dedicado de
 * ativar/inativar integração — diferente de usuários (`PATCH
 * /users/{id}/active`, RF012) e módulos (`PATCH /modules/{id}/active`,
 * RF022), que têm rota própria. A opção adotada aqui trata `fl_active` como
 * um campo aceito pelo mesmo `PUT /integrations/{id}` do RF026 (edição),
 * enviando somente esse campo no corpo — mantendo a ação de ativar/inativar
 * na UI em vez de removê-la, já que cabe dentro de um RF já documentado. Se o
 * backend rejeitar atualizações parciais desse PUT (exigindo os demais
 * campos), esta suposição precisa ser revista com o time de backend.
 *
 * `fl_active` (interruptor manual do administrador) é independente de
 * `st_status` (resultado do último "Testar Conexão", RN006).
 */
export function useToggleIntegrationStatus() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cd_id, fl_active }: ToggleIntegrationStatusInput) =>
            api.put<CoreIntegration>(`/integrations/${cd_id}`, {
                body: { fl_active },
                errorMessage: "Erro ao atualizar status da integração",
            }),
        onSuccess: (integration, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.integrations.detail(variables.cd_id) });
            toast.success(
                (integration?.fl_active ?? variables.fl_active)
                    ? "Integração ativada com sucesso."
                    : "Integração inativada com sucesso.",
                { position: "top-center", richColors: true },
            );
        },
        onError: (error) => {
            toast.error(
                error instanceof Error ? error.message : "Erro ao atualizar status da integração.",
                { position: "top-center", richColors: true },
            );
        },
    });
}
