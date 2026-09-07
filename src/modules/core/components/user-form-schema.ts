import { z } from "zod";

/**
 * Schema compartilhado por `create-user-modal.tsx` e `edit-user-modal.tsx`
 * (RF006): nome/e-mail/cargo/status obrigatórios, e-mail válido.
 *
 * `fl_active` trafega como string ("true"/"false") no formulário para casar
 * com o `Select` (RN004: status binário Ativo/Inativo) e é convertido para
 * boolean no `onSubmit` de cada modal antes de chamar a mutation.
 *
 * Isolado de `user-form-fields.tsx` para não misturar export de componente
 * (Fast Refresh) com export de constante no mesmo arquivo.
 */
export const userFormSchema = z.object({
    ds_name: z.string().trim().min(3, "Informe um nome válido."),
    ds_email: z.string().trim().email("Informe um e-mail válido."),
    ds_role_description: z.string().trim().min(2, "Informe o cargo."),
    fl_active: z.enum(["true", "false"], { message: "Selecione o status." }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
