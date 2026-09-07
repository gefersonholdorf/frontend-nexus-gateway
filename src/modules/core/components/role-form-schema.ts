import { z } from "zod";

/**
 * Schema compartilhado por `create-role-modal.tsx` e `edit-role-modal.tsx`
 * (RF011): nome/descrição/status obrigatórios.
 *
 * `fl_active` trafega como string ("true"/"false") no formulário para casar
 * com o `Select` (mesmo padrão de `user-form-schema.ts`) e é convertido para
 * boolean no `onSubmit` de cada modal antes de chamar a mutation.
 */
export const roleFormSchema = z.object({
    ds_name: z.string().trim().min(3, "Informe um nome válido."),
    ds_description: z.string().trim().min(3, "Informe uma descrição válida."),
    fl_active: z.enum(["true", "false"], { message: "Selecione o status." }),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
