import { z } from "zod";

/**
 * Schema compartilhado por `create-role-modal.tsx` e `edit-role-modal.tsx`
 * (RF011): nome/descrição obrigatórios. Status não é coletado no form — toda
 * role nasce com status default do backend e é alterado depois via
 * `useToggleRoleStatus` (`PATCH /roles/{id}/status`).
 */
export const roleFormSchema = z.object({
    ds_name: z.string().trim().min(3, "Informe um nome válido."),
    ds_description: z.string().trim().min(3, "Informe uma descrição válida."),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
